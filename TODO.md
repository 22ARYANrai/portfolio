# TODO for Aryan

Nothing below is shown on the site as "TODO". Where a fact was missing, the site leaves it out instead.

## Before you share the link
- [ ] **GitHub URL.** Add it to `profile.github` in `src/data/content.ts`. The GitHub links stay hidden until you do.
- [ ] **Site URL.** After the first deploy, set `VITE_SITE_URL` (in `.env` or Vercel's environment variables) so link previews show the right image.
- [ ] **Your resume.** After the site is live, add the site link to your resume, export it as PDF and save it as `public/resume/Aryan-Rai-Resume.pdf` (exact name), then commit and push. Every Resume button (nav, phone menu, hero, contact) appears automatically once that file exists; until then they stay hidden. Remove your phone number first if you don't want it public.
- [ ] **Kuku disclosure.** Confirm that showing "52K+ learners in 2 months", the stack and the billing and analytics vendors publicly is fine with Kuku.

## Content gaps (add to `src/data/content.ts`)
- [ ] **Kuku AI Coach.** Add screenshots (save them to `public/assets/work/kuku-ai-coach/`) and any metrics you can publish: retention, free-to-paid conversion, latency or cost savings from prompt caching.
- [ ] **Dicta.** Add your exact role, launch status, stack confirmation, metrics and screenshots. Right now it shows only the one-line description from LinkedIn.
- [ ] **Campus Calories.** Were you founder or co-founder? (Another student's resume also lists Campus Calories.) Add the live URL if there is one.
- [ ] **Lovable.** Add the date, the context (NextLeap?) and the MVP prototype link from the deck.
- [ ] **Rigi TV.** Add the context and date, and confirm whether the "Confidential" one-pager can be published. It is described but not embedded.
- [ ] **AI support bot.** Add the dates (your resumes disagree: Nov 2025–Jan 2026 vs Feb–Mar 2026).
- [ ] **Swiggy.** Solo or team? Any result, such as a placement in the challenge?
- [ ] **ReVx.** Describe your specific part in the team of 4.
- [ ] **Bloomberg certificates** (Market Concepts, Spreadsheet Analysis, ESG). These are listed on Notion, but there are no files, so they are not on the site yet.

## Numbers on your resumes that the decks don't support
Where a resume and a deck disagreed, the site uses the deck. Before reusing these numbers elsewhere, find their source or drop them:

| Project | Resume / Notion says | Site uses (from the deck or report) |
|---|---|---|
| Hinge | "achieving / targeting a 20% rise in chat-to-date" | Research findings (78%, 84%, 65%) and the North Star metric |
| CoinSwitch | "1,000+ rows in SQL, 20% late-night drop-off" | 355-order dataset: cancellations 7% → 33%, users −30% |
| Gnani.ai | "17.5% WER, <500 ms, 80% FCR, 70% OpEx savings" | Deck targets: −38% repeat cost, 2.5× refund TAT, 99% accountability |
| WILP research | "35% signal quality, 100× faster, 75% lower compute" | Report: DDIM 4× lower sampling time (the ~100× figure is the published paper's result that you replicated) |
| AI chatbot | "+40% engagement, 5K+ queries, 30% faster retrieval" | Workflow facts only |
| Campus Calories | "70% less logging friction, 30-user alpha" | Features visible in the app screenshots |
| Swiggy | "₹4.1 Cr from 6,000+ transactions" | ₹409.22L per-semester campus-wallet market (6,000+ students) |
| Finance | "DCF for 4+ companies, 15% valuation gap" | Torrent Pharma FCFF/DCF method only |

## Housekeeping
- [ ] **Rotate the Google API key** in `Downloads/BITS PILANI/PROJECTS/me f376 dop kundan sir/GOOGLE CREDENTIALS not share.json`. It is a live service-account credential sitting in a project folder. It was not copied into this site.
- Left out on purpose:
  - Carbon Footprint deck (it lists other presenters)
  - Valura.ai (campus ambassador, not an internship)
  - Offer letters
  - Wellness, LinkedIn-profile, G Suite and Carrd certificates
  - The volleyball certificate

## Added 2026-11-22
- [ ] **Bloomberg Spreadsheet Analysis and ESG.** No file or verify link found anywhere on this laptop. Download them from portal.bloombergforeducation.com (Certificates), then add `verify:` links in `src/data/content.ts`. Market Concepts is done.
- [ ] **Live Play Store numbers on Vercel.** GitHub Pages rebuilds daily on its own. For Vercel: create a Deploy Hook (Project → Settings → Git → Deploy Hooks) and save it as the GitHub secret `VERCEL_DEPLOY_HOOK`; `.github/workflows/vercel-refresh.yml` then redeploys daily.
