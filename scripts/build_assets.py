"""Build /public/assets from Aryan's original files (read-only).

- Never writes to the source folders.
- Redacts phone numbers and BITS student IDs from every published PDF.
- Renders deck slides to WebP for the in-page slide viewer.

Run:  python -I scripts/build_assets.py   (needs: pip install pymupdf pillow)
"""
import io
import json
import re
import shutil
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFont

HOME = Path.home()
DL = HOME / "Downloads"
RP = DL / "RESUME PROJECTS"
BP = DL / "BITS PILANI" / "PROJECTS"
CE = DL / "BITS PILANI" / "certificate"
RK = DL / "resume after joining kuku"

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets"
MANIFEST = ROOT / "src" / "data" / "assets.json"

PHONE = ["+91-7223088291", "+91 7223088291", "7223088291"]
ID_RE = re.compile(r"^\(?(19|20)\d{2}[A-Z0-9]{4}\d{4}[HPG]\)?[,.)]*$")
SLIDE_W = 1600
THUMB_W = 720


def fill_for(page, rect):
    """Sample the background colour just left of the rect so redaction boxes blend in."""
    pix = page.get_pixmap(matrix=pymupdf.Matrix(1, 1))
    x = max(0, min(pix.width - 1, int(rect.x0) - 3))
    y = max(0, min(pix.height - 1, int((rect.y0 + rect.y1) / 2)))
    r, g, b = pix.pixel(x, y)[:3]
    return (r / 255, g / 255, b / 255)


def redact(doc):
    hits = 0
    for page in doc:
        rects = []
        for p in PHONE:
            rects += page.search_for(p)
        for w in page.get_text("words"):
            if ID_RE.match(w[4]):
                rects.append(pymupdf.Rect(w[:4]))
        for r in rects:
            page.add_redact_annot(r, fill=fill_for(page, r))
        if rects:
            page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_PIXELS)
            hits += len(rects)
    return hits


def open_redacted(src):
    doc = pymupdf.open(src)
    n = redact(doc)
    return doc, n


SECRET_RE = re.compile(rb"7223088291|(?:19|20)\d{2}[A-Z0-9]{4}\d{4}[HPG]")


def scrub(doc):
    """Remove hidden places where redacted text can survive: the tagged-PDF
    structure tree (ActualText/Alt), document info + XMP metadata, outlines,
    embedded files and hidden text."""
    cat = doc.pdf_catalog()
    for key in ("StructTreeRoot", "MarkInfo", "Metadata", "Outlines", "PieceInfo"):
        doc.xref_set_key(cat, key, "null")
    for page in doc:
        for key in ("StructParents", "PieceInfo"):
            doc.xref_set_key(page.xref, key, "null")
    doc.scrub(metadata=True, xml_metadata=True, embedded_files=True, attached_files=True,
              hidden_text=True, javascript=True, thumbnails=True, redactions=False,
              redact_images=False, remove_links=False, reset_fields=False, reset_responses=False)
    doc.set_metadata({})


def deep_leaks(path):
    """Decompress every object and stream; return any phone/ID matches."""
    d = pymupdf.open(path)
    hits = set()
    for x in range(1, d.xref_length()):
        try:
            blobs = [d.xref_object(x, compressed=False).encode("latin-1", "ignore")]
            # Image pixel data can't hold searchable text and causes random false matches.
            if d.xref_is_stream(x) and d.xref_get_key(x, "Subtype")[1] != "/Image":
                blobs.append(d.xref_stream(x) or b"")
        except Exception:
            continue
        for b in blobs:
            hits.update(m.decode() for m in SECRET_RE.findall(b))
    d.close()
    return hits


def save_pdf(doc, dest, max_mb=3.0):
    dest.parent.mkdir(parents=True, exist_ok=True)
    scrub(doc)
    doc.save(dest, garbage=4, deflate=True, clean=True)
    if dest.stat().st_size > max_mb * 1e6:
        tmp = pymupdf.open(dest)
        tmp.rewrite_images(dpi_threshold=150, dpi_target=110, quality=70)
        buf = tmp.tobytes(garbage=4, deflate=True)
        tmp.close()
        dest.write_bytes(buf)
    return round(dest.stat().st_size / 1024)


def page_image(page, width):
    z = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=False)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


def save_webp(img, dest, q=78):
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=q, method=6)


def deck(slug, src, pages=None, pdf_name=None, publish_pdf=True):
    doc, n = open_redacted(src)
    idx = pages if pages is not None else list(range(doc.page_count))
    d = OUT / "work" / slug
    if d.exists():
        shutil.rmtree(d)
    slides = []
    for i, p in enumerate(idx):
        img = page_image(doc[p], SLIDE_W)
        name = f"slide-{i + 1:02d}.webp"
        save_webp(img, d / name)
        slides.append({"src": f"assets/work/{slug}/{name}", "w": img.width, "h": img.height})
        if i == 0:
            t = img.copy()
            t.thumbnail((THUMB_W, THUMB_W * 2))
            save_webp(t, d / "thumb.webp", q=75)
    entry = {"slides": slides, "thumb": f"assets/work/{slug}/thumb.webp", "redactions": n}
    if publish_pdf:
        fname = pdf_name or f"{slug}.pdf"
        kb = save_pdf(doc, OUT / "files" / fname)
        entry.update(pdf=f"assets/files/{fname}", pdfKB=kb, pages=doc.page_count)
    doc.close()
    print(f"  {slug:18} {len(slides):2} slides  redactions={n}  pdf={entry.get('pdfKB', '-')}KB")
    return entry


def find_page(src, needle):
    doc = pymupdf.open(src)
    for i, p in enumerate(doc):
        if needle.lower() in p.get_text().lower():
            return i
    return 0


def photo():
    src = DL / "Professional Portrait with Warm Bokeh.png"
    img = Image.open(src).convert("RGB")
    for w, name in [(960, "aryan-rai.webp"), (480, "aryan-rai-480.webp")]:
        t = img.copy()
        t.thumbnail((w, w))
        save_webp(t, OUT / "img" / name, q=82)
    t = img.copy()
    t.thumbnail((960, 960))
    (OUT / "img").mkdir(parents=True, exist_ok=True)
    t.save(OUT / "img" / "aryan-rai.jpg", "JPEG", quality=84, optimize=True)
    return img


def og_image(img):
    W, H = 1200, 630
    paper, ink, accent = (247, 244, 238), (22, 22, 26), (39, 71, 214)
    c = Image.new("RGB", (W, H), paper)
    p = img.copy()
    side = min(p.size)
    p = p.crop(((p.width - side) // 2, 0, (p.width + side) // 2, side)).resize((H, H))
    c.paste(p, (W - H + 60, 0))
    d = ImageDraw.Draw(c)
    fonts = Path("C:/Windows/Fonts")
    serif = ImageFont.truetype(str(fonts / "georgiab.ttf"), 76)
    sans = ImageFont.truetype(str(fonts / "segoeui.ttf"), 30)
    small = ImageFont.truetype(str(fonts / "segoeuib.ttf"), 22)
    d.rectangle([0, 0, W - H + 60, H], fill=paper)
    d.text((64, 70), "PORTFOLIO", font=small, fill=accent)
    d.text((64, 140), "Aryan Rai", font=serif, fill=ink)
    lines = ["AI product builder: product, data", "and forward-deployed engineering."]
    for i, l in enumerate(lines):
        d.text((64, 260 + i * 44), l, font=sans, fill=ink)
    d.text((64, 520), "Kuku AI Coach  ·  50K+ downloads on Google Play", font=small, fill=accent)
    c.save(OUT / "img" / "og.jpg", "JPEG", quality=86)


def certs():
    m = {
        "nextleap-pm-fellowship": CE / "NextLeap/certificate of completion.pdf",
        "coursera-intro-ml": CE / "Introduction to ML.pdf",
        "coursera-genai-basics": CE / "GenAI Basics - How LLMs Work.pdf",
        "coursera-ai-data-analysis": CE / "AI-Powered Data Analysis-A Practical Introduction.pdf",
        "coursera-ai-marketing-swot": CE / "AI for Marketing-SWOT Analysis.pdf",
        "coursera-sql": CE / "Coursera sql.pdf",
        "coursera-business-analysis": CE / "Business Analysis and Process Management.pdf",
        "coursera-excel": CE / "excel.pdf",
        "forage-bcg": CE / "forage/BCG - Digital Transformation.pdf",
        "forage-mastercard": CE / "forage/Mastercard Advisors & Consulting Services Job Simulation on Forage - March 2025.pdf",
        "forage-deloitte": CE / "forage/Deloitte Australia Data Analytics job simulation,.pdf",
        "forage-tata-dataviz": CE / "forage/TATA - Data Visualisation Empowering Business.pdf",
        "forage-tata-genai": CE / "forage/Tata GenAI Powered Data Analytics.pdf",
        "forage-cba-datascience": CE / "forage/Commonwealth Bank Introduction to Data Science.pdf",
        "forage-ge-aerospace": CE / "forage/GE Aerospace - Explore Engineering Job Simulation.pdf",
        "forage-british-airways": CE / "forage/British Airways Engineering job simulation.pdf",
        "datacamp-data-topics": CE / "Statement of Accomplishment.pdf",
        "skillsetmaster-data-analytics": CE / "Aryan_Rai_Certificate_DA.pdf",
        "analyst-club-business-analyst": CE / "1775900183512-08cc9acf-032e-4400-9b01-99b30e38af62.pdf",
        "skilled-sapiens-mclp": CE / "mclp certificate.pdf",
        "skilled-sapiens-flp": CE / "flp certificate.pdf",
        "codewithharry-data-science": CE / "The_Ultimate_Job_Ready_Data_Science_Course_Certificate.pdf",
        "codewithharry-python": CE / "[English]_Complete_2026_Python_Bootcamp__Learn_Python_from_Scratch_Certificate.pdf",
        "upgrad-genai": CE / "gen ai - upgrad Free Course Completion.pdf",
        "skillup-figma": CE / "Aryan Rai - FIGMA.pdf",
        "lnt-cps-iiot-cloud": CE / "l&t certificate.pdf",
        "mathworks-matlab": CE / "matlabcertificate.pdf",
        "bloomberg-bmc": DL / "GALAXY M31" / "Download" / "certificate_of_completion (1).pdf",
        "coursera-yale-wellbeing": CE / "The Science of Well-Being for Teens-Coursera 6M3TVFBY68H2.pdf",
        "coursera-wesleyan-suicide-prevention": CE / "Suicide Prevention coursera.pdf",
        "coursera-gsuite": CE / "Collaborating with G Suite Apps.pdf",
        "coursera-carrd": CE / "NO CODE WEB.pdf",
        "coursera-linkedin-profile": CE / "linkedin.pdf",
        "udemy-digital-wellness": CE / "UC-digital wellness.pdf",
    }
    out = {}
    for slug, src in m.items():
        doc, n = open_redacted(src)
        kb = save_pdf(doc, OUT / "certs" / f"{slug}.pdf", max_mb=1.2)
        doc.close()
        out[slug] = {"pdf": f"assets/certs/{slug}.pdf", "kb": kb}
    print(f"  {len(out)} certificates")
    return out


APPS = ROOT / "scripts" / "app-screens"  # Play Store screenshots (public listing images)


def app_screens():
    """Resize Play Store screenshots into the public folder and register them."""
    out = {}
    for slug, prefix in (("kuku-ai-coach", "coach"), ("dicta", "dicta")):
        d = OUT / "work" / slug
        if d.exists():
            shutil.rmtree(d)
        slides = []
        for i, src in enumerate(sorted(APPS.glob(f"{prefix}-shot*.webp"))):
            img = Image.open(src).convert("RGB")
            img.thumbnail((620, 1100))
            name = f"screen-{i + 1:02d}.webp"
            save_webp(img, d / name, q=80)
            slides.append({"src": f"assets/work/{slug}/{name}", "w": img.width, "h": img.height})
        icon = Image.open(APPS / f"{prefix}-icon.webp").convert("RGB")
        icon.thumbnail((192, 192))
        save_webp(icon, d / "icon.webp", q=85)
        out[slug] = {"slides": slides, "thumb": slides[0]["src"], "icon": f"assets/work/{slug}/icon.webp"}
        print(f"  {slug:18} {len(slides)} screenshots")
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {"work": {}}
    print("photo + og")
    og_image(photo())
    print("decks")
    w = manifest["work"]
    w["hinge"] = deck("hinge", RP / "NLHinge-Aryan Rai.pdf", pdf_name="aryan-rai-hinge-date-planner.pdf")
    w["lovable"] = deck("lovable", RP / "NL LOVABLE-aryan.pdf", pdf_name="aryan-rai-lovable-ship-mode.pdf")
    w["replit"] = deck("replit", RP / "NL_Replit_Nocode.pdf", pdf_name="aryan-rai-replit-activation.pdf")
    w["coinswitch"] = deck("coinswitch", RP / "2022A4PS1175H_BITS Pilani Hyderabad Campus_coinswitch.pdf", pdf_name="aryan-rai-foodswift-order-drop.pdf")
    w["gnani"] = deck("gnani", RP / "Aryan Rai_2022A4PS1175H_GNANI AI_Founder's Office Assignment.pdf", pdf_name="aryan-rai-gnani-voice-ai.pdf")
    w["revx"] = deck("revx", RP / "REVX.pdf", pdf_name="aryan-rai-revx-energy-gtm.pdf")
    w["swiggy"] = deck("swiggy", RP / "Swiggy_Campus_foodforthought.pdf", pdf_name="aryan-rai-swiggy-campus.pdf")
    w["linkedin"] = deck("linkedin", CE / "NextLeap/Next Leap Certificate and Grad project_removed.pdf", pdf_name="aryan-rai-linkedin-creator-growth.pdf")
    w["campus-calories"] = deck("campus-calories", RP / "campus calorie.pdf", pages=[0, 2], publish_pdf=False)
    wilp = RP / "WILP-Guided Diffusion Models for Image Synthesis.pdf"
    rp = find_page(wilp, "Some Results in images format")
    w["wilp"] = deck("wilp", wilp, pages=[rp, rp + 1, 0], pdf_name="aryan-rai-wilp-diffusion-restoration-report.pdf")
    w["chatbot"] = deck("chatbot", BP / "chatbot/# n8n telegram chatbot workflow.pdf", pages=[0], pdf_name="aryan-rai-n8n-ai-support-bot.pdf")
    w["igcar"] = deck("igcar", RP / "2022A4PS1175H_-compreppt IGCAR.pdf", pages=list(range(0, 30)), pdf_name="aryan-rai-igcar-water-hammer-slides.pdf")
    w["iot"] = deck("iot", RP / "IoT concept development in manufacturing.pdf", pages=[0], pdf_name="aryan-rai-iot-manufacturing-dashboard-report.pdf")
    w["torrent"] = deck("torrent", RP / "Financial Valuation Modeling-Torrent_PHARMA.pdf", pages=[0], pdf_name="aryan-rai-torrent-pharma-valuation.pdf")
    solar = DL / "Final Progress Report 2.pdf"
    w["solar"] = deck("solar", solar, pages=[0, find_page(solar, "Stepped with dimples"), find_page(solar, "In conclusion")], pdf_name="solar-distillation-dsir-progress-report.pdf")
    w.update(app_screens())
    print("certificates")
    manifest["certs"] = certs()
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    print("deep leak scan")
    leaks = {str(p.relative_to(OUT)): deep_leaks(p) for p in OUT.rglob("*.pdf")}
    leaks = {k: v for k, v in leaks.items() if v}
    if leaks:
        for k, v in leaks.items():
            print(f"  LEAK {k}: {sorted(v)}")
        raise SystemExit("Refusing to finish: personal identifiers remain in published PDFs.")
    print(f"  clean: {sum(1 for _ in OUT.rglob('*.pdf'))} PDFs")
    MANIFEST.write_text(json.dumps(manifest, indent=1))
    total = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
    print(f"done: {total / 1e6:.1f} MB in public/assets")


if __name__ == "__main__":
    sys.exit(main())
