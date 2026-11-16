# Aryan Rai — Portfolio

Personal portfolio: React 19 + TypeScript + Vite 7 + Tailwind CSS 4. Static output, no backend.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Where things live

| What | Where |
|---|---|
| All copy, metrics, projects, roles, skills, certificates | `src/data/content.ts` |
| Generated asset manifest (slides, PDFs, resumes) | `src/data/assets.json` (written by the asset script) |
| Design tokens (colours, light/dark) | `src/index.css` (`:root` and `[data-theme='dark']`) |
| Sections | `src/components/` |
| Processed files served by the site | `public/assets/` |

### Role lens

The lens bar (All / Product / Analytics / Consulting / AI & FDE) reorders projects, highlights skills and certificates, and switches which resume the hero button downloads. The choice is saved in the URL, so you can send a recruiter a pre-filtered link:

- `https://<your-site>/?lens=product`
- `https://<your-site>/?lens=analytics`
- `https://<your-site>/?lens=consulting`
- `https://<your-site>/?lens=ai`

Case studies have their own links too, for example `https://<your-site>/#/work/hinge`.

## Regenerating assets

`scripts/build_assets.py` reads your original files in `~/Downloads` (read-only) and writes processed copies into `public/assets/`:

- renders deck slides to WebP for the slide viewer
- redacts phone numbers and BITS student IDs from every published PDF (including teammates' IDs)
- compresses large PDFs and writes phone-free resumes
- builds the Open Graph image

Run it again after you update a resume or deck:

```bash
pip install pymupdf pillow
npm run assets
```

## Deploy

### Vercel (recommended)

1. Push this folder to a new GitHub repository.
2. In Vercel: **Add New → Project → Import** the repo. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. Under **Settings → Environment Variables**, add `VITE_SITE_URL` = your final URL (e.g. `https://aryanrai.vercel.app`), then redeploy. This drives the Open Graph image, canonical URL and sitemap.
4. Optional: add a custom domain under **Settings → Domains** and update `VITE_SITE_URL`.

### GitHub Pages

1. Push to a GitHub repository named, for example, `portfolio`.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds with `BASE_PATH=/<repo-name>/` and publishes. The site will be at `https://<username>.github.io/<repo-name>/`.
4. For a user site (`<username>.github.io` repo) or a custom domain, set `BASE_PATH` to `/` in the workflow.

## Accessibility and quality checks run before handover

- axe-core (WCAG 2 A/AA): 0 violations in light mode, dark mode and the case-study dialog
- Keyboard: skip link first; native `<dialog>` with Esc to close; ← / → in the slide viewer; visible focus rings
- No horizontal scroll at 390 px; reduced-motion respected; print styles
- All 165 referenced files present in the build; no console errors
