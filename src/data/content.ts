/*
 * Every fact on the site lives here. Sources are named per item.
 * Rule: decks/reports win over resume summaries when they disagree.
 * Open questions are listed in TODO.md at the repo root — not on the page.
 */
import type { Cert, Lens, Project, Role, SkillGroup, Track } from './types'
import play from './play-stats.json'

export const profile = {
  name: 'Aryan Rai',
  positioning: 'AI product builder: product, data and forward-deployed engineering.',
  sub: 'Building AI products at Kuku · BITS Pilani · NextLeap PM Fellow',
  location: 'Bengaluru, India',
  email: 'aryanrai.workspace@gmail.com',
  linkedin: 'https://www.linkedin.com/in/aryanrai-ai/',
  github: 'https://github.com/22ARYANrai',
}

export const lenses: { id: Lens; label: string; blurb: string }[] = [
  { id: 'all', label: 'All work', blurb: 'Everything, flagship first.' },
  { id: 'product', label: 'Product', blurb: 'Discovery, prioritisation, metrics and shipped product.' },
  { id: 'analytics', label: 'Analytics', blurb: 'Funnels, cohorts, models and dashboards.' },
  { id: 'consulting', label: 'Consulting', blurb: 'Market sizing, GTM, pricing and strategy.' },
  { id: 'ai', label: 'AI & FDE', blurb: 'LLM products, voice AI, evals and applied ML.' },
]

export const impact = [
  { value: play.coach.downloads, label: 'downloads on Google Play', context: 'Kuku AI Coach' },
  { value: '4×', label: 'faster diffusion sampling with DDIM', context: 'Applied AI research, BITS WILP' },
  { value: '150+', label: 'B2B leads, 12–15% to conversation', context: 'Metvy' },
  { value: '3,000+', label: 'attendees, 40+ person team', context: 'Utkal Samaj, BITS Hyderabad' },
]

export const about = `I build AI products that real people use. At Kuku, I work on Kuku AI Coach, an AI spoken-English tutor for Hindi speakers with ${play.coach.downloads} downloads on Google Play. My week moves between prompt design and LLM evals, voice-call latency, billing flows and the retention funnel. I studied Mechanical Engineering with a minor in Finance at BITS Pilani, did applied-AI research on image restoration, and trained as a PM through NextLeap's fellowship. That mix shapes how I work: break the problem down, check it against data, ship, then measure. I'm open to roles in AI product, analytics, strategy and forward-deployed engineering.`

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const PLAY = {
  coach: 'https://play.google.com/store/apps/details?id=com.vlv.aravali.kukuaicoach&hl=en_IN',
  dicta: 'https://play.google.com/store/apps/details?id=com.vlv.aravali.kukuflow&hl=en_IN',
}
export const playLinks = PLAY

export const projects: Project[] = [
  {
    slug: 'kuku-ai-coach',
    title: 'Kuku AI Coach',
    context: 'Kuku · FDE & AI Operations',
    period: 'Aug 2026 – present',
    tier: 'flagship',
    tracks: ['ai', 'product', 'analytics'],
    oneLiner: `An AI spoken-English tutor for Hindi speakers, on web and Android. ${play.coach.downloads} downloads on Google Play.`,
    problem:
      'Kuku AI Coach is an AI spoken-English tutor for Hindi speakers: conversational lessons, AI voice practice calls and a learner journey on web and Android, with a free first lesson that places each learner at the right level.',
    role: 'Graduate Management Trainee, FDE & AI Operations. I work across the whole product: the lesson engine and prompts, voice calls, learner flows, billing, analytics and AI quality.',
    approach: [
      'Built the conversational lesson engine and prompt workflows on the Anthropic Claude API, where code decides what each turn of a lesson is for and the model writes the words.',
      'Built onboarding placement: a short assessment, scored on the server, that starts each learner at Beginner, Intermediate or Advanced.',
      'Shipped a free first lesson that places the learner, starts their daily streak and unlocks a short voice-practice trial.',
      'Added AI voice-practice calls with ElevenLabs and Azure Speech, plus a post-call report on grammar and pronunciation that is generated in the background.',
      'Built coach tools for everyday English (translate, write an email, ask about a photo or document) and the speak-to-English bubble that later became Dicta.',
      'Integrated subscriptions with UPI autopay and Google Play Billing, a low-cost trial, coins for voice practice billed by the minute, and tax invoices. Access is only granted once the server confirms payment.',
      'Built server-decided reminder pushes with quiet hours, daily caps and control groups to measure real lift, plus an ops dashboard with editable copy.',
      'Instrumented the funnel with Firebase, GA4, AppsFlyer and Meta Pixel from one shared event spec across web and Android, and supported A/B tests.',
      'Improved tutor quality and unit economics: LLM evaluation, model benchmarking, per-step latency measurement, prompt caching and safety guardrails.',
      'Hardened trust: safety checks run before every AI reply, distress gets a fixed supportive response, and personal details are removed before anything is stored.',
      'Redesigned the learner web app, and turned feedback into shipped features such as a home-screen widget and lesson-practice improvements.',
    ],
    tools: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Claude API', 'ElevenLabs', 'Azure Speech', 'Razorpay', 'Google Play Billing', 'Firebase', 'GA4', 'AppsFlyer', 'Meta Pixel'],
    outcomes: [
      { value: play.coach.downloads, label: 'downloads on Google Play', kind: 'shipped' },
      { value: `${play.coach.rating}★`, label: 'Google Play rating', kind: 'shipped' },
    ],
    links: [{ label: 'Get it on Google Play', href: PLAY.coach }],
    evidenceKey: 'kuku-ai-coach',
    evidenceNote: 'Screens from the public Google Play listing.',
    source: 'LinkedIn profile (Kuku role) and current resumes.',
  },
  {
    slug: 'dicta',
    title: 'Dicta',
    context: 'Kuku · FDE & AI Operations',
    period: 'Nov 2026 – present',
    tier: 'flagship',
    tracks: ['ai', 'product'],
    oneLiner: 'Speak in Hindi or Hinglish over any app, get clear English back in the tone you want.',
    problem:
      'Plenty of people think in Hindi or Hinglish but have to write in English: a message, an email, a reply at work. Dicta is an Android app with a floating bubble: tap it over any app, speak, and get polished English to copy and paste.',
    role: 'Dicta runs on the same backend I build for Kuku AI Coach. Its core (voice-to-English in five tones, safety checks, sign-in, subscriptions and analytics) first shipped as part of Coach. On the Dicta app itself I worked on the Premium paywall, the home and profile screens, tone quality, and safety and analytics audits.',
    approach: [
      'A floating bubble that works over any app: speak, then copy the English.',
      'Pick the tone: casual, semi-formal, formal, Hinglish or Hindi.',
      'Translate and email tools, history and a personal dictionary inside the app.',
      'Privacy-first by design: it never reads other apps, never pastes for you, and does not keep audio once it is processed.',
      'Shared engine: speech to text, then an AI rewrite in the chosen tone, with safety checks on every request.',
      'Phone OTP or Google sign-in, daily free uses and a Premium plan with UPI autopay.',
      'Fixed tone quality so the casual tone no longer adds things the user never said.',
      'Audited the app\'s safety handling and analytics events before scaling up.',
    ],
    tools: ['Android', 'Kotlin', 'Jetpack Compose', 'Django', 'PostgreSQL', 'Speech-to-text', 'Claude API'],
    outcomes: [
      { value: play.dicta.downloads, label: 'downloads on Google Play', kind: 'shipped' },
      { value: `${play.dicta.rating}★`, label: 'Google Play rating', kind: 'shipped' },
    ],
    links: [{ label: 'Get it on Google Play', href: PLAY.dicta }],
    evidenceKey: 'dicta',
    evidenceNote: 'Screens from the public Google Play listing.',
    source: 'Dicta product behaviour and Aryan’s own contributions.',
  },
  {
    slug: 'hinge',
    title: 'Hinge: from chat to a confirmed date',
    context: 'Product case study · NextLeap PM Fellowship',
    period: 'Sep – Oct 2025',
    tier: 'case',
    tracks: ['product', 'analytics'],
    oneLiner: 'Found where promising chats die and designed a Date Planner that removes the social and logistical friction of asking.',
    problem:
      'About 65% of high-intent chats stall after the second exchange. Hinge gets 82% of matches to a first message, but only 24% reach a concrete ask (time and place), 12% schedule a date and 7% actually meet.',
    role: 'Solo product case study: discovery, research, solution design, metrics and rollout plan.',
    approach: [
      'Ran 6 in-depth interviews (3 men, 3 women), 2 moderated chat replays and a 32-person survey.',
      'Mapped the match-to-meet funnel and isolated three frictions: fear of the awkward ask, the logistics of picking a time and place, and vague plans that feel unsafe.',
      'Compared three paths (AI conversation coach, smarter "Your Turn" nudge, native Date Planner) and chose the Date Planner, the only one that addressed all three frictions.',
      'Designed the flow: private date preferences → low-pressure intent signal → mutual reveal only when both opt in → browse and propose vetted public venues.',
      'Defined safety hooks (one open proposal at a time, reporting cancels the proposal, public venues only) and a 10% → 50% phased rollout with copy A/B tests.',
    ],
    tools: ['User interviews', 'Survey design', 'Funnel analysis', 'Figma', 'Success metrics', 'A/B test design'],
    outcomes: [
      { value: '78%', label: 'of surveyed users feel anxious or unsure about how and when to propose a date', kind: 'finding' },
      { value: '84%', label: 'would likely use an in-app tool that makes suggesting a date less awkward', kind: 'finding' },
      { value: '65%', label: 'of women feel significantly safer with a specific plan than a vague "let\'s hang out"', kind: 'finding' },
      { label: 'North Star: Date Confirmation Rate, with block/report rate after a proposal as a hard guardrail', kind: 'target' },
    ],
    evidenceKey: 'hinge',
    source: 'Hinge case study deck (9 slides).',
  },
  {
    slug: 'lovable',
    title: 'Lovable: Ship Mode',
    context: 'Product case study · AI app builders',
    tier: 'case',
    tracks: ['product', 'ai'],
    oneLiner: 'An outcome-first "Ship Mode" that gets non-technical builders past the deployment cliff without becoming DevOps engineers.',
    problem:
      'Lovable is great at generating UI, but projects die at deployment. In the funnel I mapped, 85% clone a template, 45% preview, 20% click deploy and only 5% go live. Backend wiring (Supabase, auth, RLS, environment variables) and fear of breaking the app or leaking keys are the blockers.',
    role: 'Solo product case study: research, positioning, solution design, metrics and risk plan.',
    approach: [
      'Surveyed builders and ran interviews; built two personas, Leo (vibe-coder founder) and Sarah (internal-tool PM).',
      'Benchmarked Lovable against Replit, Bolt.new, Zapier and n8n on deployment, friction and sandboxing.',
      'Framed three gaps: Skill (backend config), Trust (black-box fear), Shame (avoiding asking engineers for help).',
      'Compared education, a post-failure AI debugger and Ship Mode; chose Ship Mode because it prevents the failure instead of explaining it.',
      'Designed Ship Mode: Flight Check (blocks deploys with open RLS or missing keys), auto-orchestration through the Supabase Management API, database branching for a safe sandbox, and a gamified launch with a shareable proof card.',
      'Planned de-risking: an eject option to export raw SQL and code, identity checks against abuse, and automatic snapshots before any migration.',
    ],
    tools: ['User research', 'Competitive analysis', 'Funnel analysis', 'Supabase', 'Metrics design', 'Risk planning'],
    outcomes: [
      { value: '68%', label: 'of surveyed users cite fear of breaking the app or API/auth confusion as the #1 reason they abandon', kind: 'finding' },
      { value: '35% → 52.5%', label: 'North Star: users who ship within 14 days of starting a template', kind: 'target' },
      { value: '−40%', label: 'Time to first ship', kind: 'target' },
      { value: '2.5% → 10%', label: 'Pro upgrade conversion among deployed users', kind: 'target' },
    ],
    evidenceKey: 'lovable',
    source: 'Lovable Ship Mode deck (9 slides).',
  },
  {
    slug: 'replit',
    title: 'Replit: activation strategy',
    context: 'Product case study · NextLeap PM Fellowship',
    period: 'Jul – Sep 2025',
    tier: 'more',
    tracks: ['product', 'analytics'],
    oneLiner: 'Diagnosed why Replit users build 80% of an app and never deploy, and refocused activation on indie hackers and SMBs.',
    problem:
      'Replit has about 22.5M users, but only about 100,000 projects were deployed live, roughly 5% activation from build to deploy. Users who never ship never reach the paid tiers, and without public deploys the word-of-mouth loop breaks.',
    role: 'Product case study: funnel diagnosis, research, segmentation, solution and metrics.',
    approach: [
      'Mapped the funnel from template browsing to a shared live URL and sized drop-offs at each step.',
      'Ran a 30-response survey and 6 interviews; tested three hypotheses: "False Summit" (strong), "Testing Void" (partial) and "Security Fear" (very strong).',
      'Chose the Bootstrapped Builder (indie hackers and SMB owners) as the target segment for higher willingness to pay and retention.',
      'Designed a dual-mode canvas where UI design and backend logic sit side by side, guided by a live visual checklist.',
      'Defined Weekly Active Deployed Apps (WADA) to track real production use, not just prototyping.',
    ],
    tools: ['Funnel analysis', 'Survey design', 'User interviews', 'Market sizing', 'Personas', 'Metrics design'],
    outcomes: [
      { value: '68%', label: 'of respondents have low trust storing API keys on these platforms', kind: 'finding' },
      { value: '42%', label: 'already rely on ChatGPT or Gemini to write code', kind: 'finding' },
      { value: '+15%', label: 'free-to-paid conversion', kind: 'target' },
      { label: 'North Star: deployment rate (deploys ÷ projects created), tracked with WADA', kind: 'target' },
    ],
    evidenceKey: 'replit',
    source: 'Replit activation deck (9 slides).',
  },
  {
    slug: 'coinswitch',
    title: 'FoodSwift: solving the order drop',
    context: 'CoinSwitch APM hiring assignment',
    period: 'Dec 2025 – Jan 2026',
    tier: 'case',
    tracks: ['analytics', 'product'],
    oneLiner: 'Used order data to show that restaurant-side cancellations, not churn from one bad order, drove a Q1 order drop, then designed a restaurant dashboard to prevent them.',
    problem:
      'FoodSwift (a fictional delivery app) saw monthly orders fall from 130 to 100 over Q1. Unique users dropped 30% and month-on-month retention fell from 62% to 55%. Leadership asked for the cause and an app-side fix.',
    role: 'Restaurant Experience PM (assignment): data analysis, hypothesis testing and solution design.',
    approach: [
      'Analysed the 355-order Q1 dataset: monthly orders, unique users, orders per user, cohort retention and cancellation reasons.',
      'H1 "cancellations directly cause churn": disproved. Users with a cancelled order returned at 64–67%, versus 63% for successful orders.',
      'H2 "restaurant cancellations drive the decline": proved. March had 17 item-unavailable and 14 high-volume cancels.',
      'H3 "peak-hour overload amplifies it": proved. 40% of March cancels came from 3 restaurants in the 7–9 PM peak.',
      'Designed "Reliable Prep", a restaurant dashboard with demand forecasting, auto-stock alerts with menu pauses, and surge controls that alert at 80% capacity.',
    ],
    tools: ['Data analysis', 'Cohort retention', 'Hypothesis testing', 'Dashboard design', 'Metrics design'],
    outcomes: [
      { value: '7% → 33%', label: 'cancellation rate from January to March', kind: 'finding' },
      { value: '73.6%', label: 'of cancellations were item unavailability (39.6%) or high order volume (34%), both preventable', kind: 'finding' },
      { value: '<10%', label: 'cancellation rate, with MoM retention recovering to ~65%', kind: 'target' },
      { label: 'Pilot with 10 high-volume restaurants, then an A/B test with 100', kind: 'target' },
    ],
    evidenceKey: 'coinswitch',
    source: 'CoinSwitch / FoodSwift deck (6 slides).',
  },
  {
    slug: 'gnani',
    title: 'Gnani.ai: voice AI for return-pickup validation',
    context: "Gnani.ai Founder's Office assignment",
    period: 'Feb – Mar 2026',
    tier: 'more',
    tracks: ['ai', 'consulting'],
    oneLiner: 'A voice-AI flow that verifies "customer unavailable" return pickups in real time, before the delivery partner leaves.',
    problem:
      'An e-commerce partner had return pickups marked "customer unavailable" with no independent check. Nobody could tell whether the attempt happened, so repeat pickups drove up reverse-logistics cost, refunds were delayed and partner accountability was weak.',
    role: 'Solo submission: problem framing, conversational flow, architecture, metrics and scaling risks (3-slide limit).',
    approach: [
      'The 45-second intercept: the failure webhook triggers a Gnani voice call to the customer within 45 seconds while the partner is held within a 100 m radius.',
      'Intent recognition routes each call three ways: customer available (reopen the pickup), unreachable (omnichannel fallback and auto-reschedule), or fake attempt (flag for review).',
      'Architecture: partner app → API gateway → Gnani conversational engine → e-commerce OMS and analytics.',
      'Scaling risks with mitigations: festive-sale call spikes (auto-scaling SIP channels), Hinglish and dialect intent errors (localised ASR with low-confidence routing), partners gaming the system (number masking and geofencing tied to payouts).',
    ],
    tools: ['Voice AI', 'Conversational design', 'System architecture', 'Operations metrics'],
    outcomes: [
      { value: '−38%', label: 'repeat reverse-logistics cost within a quarter', kind: 'target' },
      { value: '2.5×', label: 'faster refund turnaround', kind: 'target' },
      { value: '99%', label: 'delivery-partner accountability via GPS-stamped validation', kind: 'target' },
    ],
    evidenceKey: 'gnani',
    source: 'Gnani.ai assignment brief and 3-slide submission.',
  },
  {
    slug: 'revx',
    title: 'ReVx Energy: GTM for intelligent transport',
    context: 'SusVentures × Climate Ninja · team of 4',
    period: 'Jan – Mar 2026',
    tier: 'case',
    tracks: ['consulting', 'analytics'],
    oneLiner: 'A go-to-market blueprint, market model and pilot playbook to take an intelligent transport system to bus operators.',
    problem:
      'Bus operators face climate pressure but stall on high-CAPEX hardware, fragmented software and slow public procurement. ReVx Energy needed a GTM plan and high-probability pilots.',
    role: 'Team member (with Harit Khera, Vansh Raj S and Siddhesh Kothawale) across market modelling, lead generation and GTM.',
    approach: [
      'Mapped the ecosystem: MoRTH mandates, Smart City RFP norms and municipal budgets, and found two intercept points (pre-RFP consultation and the pilot-mandate window).',
      'Sized TAM, SAM and SOM in a live market calculator.',
      'Profiled the economic buyer (CFO / transit authority head: ROI, payback, compliance) and the technical buyer (fleet / IT: uptime, integration, reliability).',
      'Positioned against legacy incumbents and broad smart-city tech, then built a CAPEX vs OPEX/SaaS pricing strawman around a low-friction pilot bundle.',
      'Drafted a partnership thesis (hardware OEMs, SIs, telecom, map players) and a 30-60-90 day pilot plan with discovery scripts, outreach copy and objection handling.',
    ],
    tools: ['TAM/SAM/SOM', 'Pricing strategy', 'ICP & personas', 'Lead generation', 'Sales enablement', 'Excel'],
    outcomes: [
      { value: '120+', label: 'validated contacts across 10–20 high-value target organisations', kind: 'shipped' },
      { label: 'Delivered market model, competitive matrix, procurement map, pricing strawman, partnership thesis and pilot plan', kind: 'shipped' },
    ],
    evidenceKey: 'revx',
    source: 'ReVx Energy GTM deck (15 slides).',
  },
  {
    slug: 'swiggy',
    title: 'Swiggy: becoming the campus default',
    context: 'Swiggy Food for Thought challenge',
    period: 'Mar – Jun 2025',
    tier: 'case',
    tracks: ['consulting', 'product', 'analytics'],
    oneLiner: 'Sized the BITS Hyderabad food market, validated 13 hypotheses with students, and ranked three growth bets with RICE.',
    problem:
      'Make Swiggy the first-choice food companion for 6,000+ students and 2,500+ faculty, staff and families at BITS Hyderabad, across delivery, on-campus outlets and dining out.',
    role: 'Market sizing, user research, solution design and prioritisation.',
    approach: [
      'Sized two markets: the fee-funded campus wallet (₹409.22L per semester) and other campus outlets (about ₹77.5L per month, assumption-based).',
      'Turned 4 student interviews into 13 hypotheses, then validated them with a 13-response survey.',
      'Designed three solutions: a hyper-local campus cloud kitchen, a Swiggy Campus Wallet that unlocks prepaid campus funds, and a Dineout "Social Planner" with group voting and ride bundling.',
      'Modelled each one (for example, the cloud kitchen: ₹52L one-time investment, about 7-month payback) and ranked them with RICE.',
    ],
    tools: ['Market sizing', 'User interviews', 'Survey', 'RICE', 'Financial modelling', 'Wireframes'],
    outcomes: [
      { value: '69%', label: 'name cost as the #1 barrier to ordering off-campus', kind: 'finding' },
      { value: '85%', label: 'spend more freely from prepaid campus-wallet money', kind: 'finding' },
      { value: '457', label: 'top RICE score: Dineout Social Planner (vs 384 cloud kitchen, 167 wallet)', kind: 'finding' },
      { value: '+₹4.5L', label: 'monthly Dineout revenue from the campus at 30% ride-bundle adoption', kind: 'target' },
    ],
    evidenceKey: 'swiggy',
    source: 'Swiggy Food for Thought deck (5 slides).',
  },
  {
    slug: 'campus-calories',
    title: 'Campus Calories',
    context: 'Product build · BITS Hyderabad',
    period: 'Nov 2025 – Jan 2026',
    tier: 'more',
    tracks: ['product'],
    oneLiner: 'A calorie and protein tracker built around what students can actually buy on campus.',
    problem:
      'Students eating at campus outlets need calorie, protein and price information for what is actually on offer around them.',
    role: 'Led MVP development.',
    approach: [
      'Recommendations from real campus outlets (night canteen, vending machines), each item showing calories, protein, portion and price, refreshed every 4 hours.',
      'One-tap "Add to log" and editable daily calorie and protein goals.',
      'Guest mode that works offline, so students can log before signing up.',
    ],
    tools: ['Product design', 'MVP', 'Mobile web'],
    outcomes: [{ label: 'Working MVP with outlet-aware recommendations, logging and goals', kind: 'shipped' }],
    evidenceKey: 'campus-calories',
    evidenceNote: 'Screens from a recorded walkthrough of the MVP.',
    source: 'Campus Calories app walkthrough (screenshots).',
  },
  {
    slug: 'ai-support-bot',
    title: 'AI support bot on n8n',
    context: 'Personal build · LLM applications',
    tier: 'more',
    tracks: ['ai'],
    oneLiner: 'A Telegram assistant that opens tickets, remembers each user and answers with an LLM, built entirely as an n8n workflow.',
    problem:
      'Automate customer-support conversations on Telegram, end to end: ticketing, per-user memory, AI replies and reporting.',
    role: 'Designed and built the workflow end to end.',
    approach: [
      'A Telegram trigger receives each message and generates a unique ticket ID.',
      'Zep checks whether the user exists and registers new users automatically.',
      'Two GPT-4.1-nano assistant paths: new users get a fresh answer; returning users get one informed by their Zep memory and Google Sheets history.',
      'Every conversation is logged to Zep (memory) and Google Sheets (ticket reporting), and the reply goes back on Telegram.',
      'Detects the user\'s language and always replies in English.',
    ],
    tools: ['n8n', 'OpenAI GPT-4.1-nano', 'Zep memory', 'Telegram Bot API', 'Google Sheets'],
    outcomes: [{ label: 'Working end-to-end workflow: ticketing, memory, AI replies and reporting', kind: 'shipped' }],
    evidenceKey: 'chatbot',
    source: 'Workflow documentation and n8n workflow export.',
  },
  {
    slug: 'wilp-diffusion',
    title: 'Image restoration with diffusion and GANs',
    context: 'Practice School II · BITS Pilani WILP, Hyderabad',
    period: 'Jul – Dec 2025',
    tier: 'more',
    tracks: ['ai', 'analytics'],
    oneLiner: 'Built and benchmarked defocus-deblur, super-resolution and guided-diffusion pipelines for camera-based vehicle data.',
    problem:
      'Defocus blur, low resolution and sensor noise degrade images that downstream perception depends on. Which restoration approach gives the best quality at an acceptable compute cost?',
    role: 'Applied AI & Project Management Intern: implementation, experiments and report (6-month Practice School II).',
    approach: [
      'Implemented guided diffusion in PyTorch: unconditional generation, classifier-guided sampling and DDIM-accelerated inference, trained on MNIST and CIFAR-10.',
      'Benchmarked ESRGAN, Real-ESRGAN and A-ESRGAN on real automotive images using PSNR, SSIM, FID and IS.',
      'Studied physics-inspired defocus models (GKM, GGKMNet) and proposed a hybrid pipeline: physical deblurring first, then generative refinement.',
    ],
    tools: ['PyTorch', 'Google Colab', 'Diffusion models', 'ESRGAN family', 'PSNR / SSIM / FID'],
    outcomes: [
      { value: '4×', label: 'less sampling time with DDIM, with negligible loss in perceptual quality', kind: 'shipped' },
      { label: 'A-ESRGAN gave the best perceptual quality, Real-ESRGAN the most stable reconstructions, and plain ESRGAN tended to hallucinate detail', kind: 'finding' },
    ],
    note: 'Recommendation: GAN-based super-resolution for real-time automotive use; diffusion where quality matters more than latency.',
    evidenceKey: 'wilp',
    source: 'Practice School II report (48 pages).',
  },
  /* ---------------- More projects (compact) ---------------- */
  {
    slug: 'linkedin-creators',
    title: 'LinkedIn: creator growth',
    context: 'NextLeap graduation project',
    period: '2025',
    tier: 'more',
    tracks: ['product'],
    oneLiner: 'Tools to help creators get discovered on LinkedIn, measured by engagement with creator content.',
    problem: 'LinkedIn has over 1 billion users but only about 3 million post weekly. Creators struggle with discoverability and monetisation.',
    role: 'Graduation project for the NextLeap PM Fellowship.',
    approach: [
      'Market and competitor scan (Instagram, YouTube, Substack, X) and the actors involved.',
      'Proposed an AI-driven dynamic content-discovery engine and creator tools.',
      'Defined the North Star as engagement rate with creator content.',
    ],
    tools: ['Market research', 'Competitive analysis', 'Metrics design'],
    outcomes: [],
    evidenceKey: 'linkedin',
    source: 'NextLeap graduation project deck.',
  },
  {
    slug: 'rigi-tv',
    title: 'Rigi TV: India microdrama growth strategy',
    context: 'Growth marketing case study',
    period: '2026',
    tier: 'more',
    tracks: ['consulting', 'product'],
    oneLiner: 'A paid-acquisition plan and FY2026 budget split to win India\'s ad-supported microdrama category.',
    problem: 'Short-drama downloads grew 320M year-on-year in 2024, and 60–70% of installs come from paid ads. Rigi TV needed a channel plan to take category leadership.',
    role: 'Stepped into the Growth Marketing Office role and wrote a one-page strategy brief for the marketing leadership team.',
    approach: [
      'Analysed the global microdrama industry and what its growth means for India.',
      'Studied how leading short-drama platforms acquire users, and the audience overlap with mobile gamers.',
      'Ranked six channels by role, from Meta Ads (critical) to programmatic display (defer).',
      'Recommended a budget split: 45% Meta, 27% Google, 15% creators, 8% referral, 3% ASO, 2% creative testing.',
    ],
    tools: ['Growth marketing', 'Channel strategy', 'Budget allocation'],
    outcomes: [],
    links: [{ label: 'Read the LinkedIn post', href: 'https://lnkd.in/p/gdtw7HMZ' }],
    evidenceNote: 'The brief itself is confidential; the LinkedIn post summarises the work.',
    source: 'Rigi TV growth-strategy one-pager and LinkedIn post.',
  },
  {
    slug: 'torrent-valuation',
    title: 'Torrent Pharma valuation',
    context: 'Business Analysis & Valuation · BITS · team of 4',
    tier: 'more',
    tracks: ['consulting', 'analytics'],
    oneLiner: 'FCFF projections, DCF and EV/EBITDA relative valuation of Torrent Pharmaceuticals.',
    problem: 'Value Torrent Pharmaceuticals from its financial statements.',
    role: 'Group project member.',
    approach: ['Projected income-statement and balance-sheet items from historical growth rates.', 'Built FCFF projections, cost of capital and terminal value for a DCF, cross-checked with EV/EBITDA multiples.'],
    tools: ['Excel', 'DCF', 'FCFF', 'Relative valuation'],
    outcomes: [],
    evidenceKey: 'torrent',
    source: 'BAV group report and model.',
  },
  {
    slug: 'iot-dashboard',
    title: 'IoT dashboard for manufacturing',
    context: 'Design Project (ME F376) · BITS Hyderabad',
    period: 'Dec 2024',
    tier: 'more',
    tracks: ['analytics', 'ai'],
    oneLiner: 'A live Dash + Plotly web app fed from Google Sheets and hosted on PythonAnywhere.',
    problem: 'Shop-floor data sat in Excel files that had to be re-uploaded by hand for every update.',
    role: 'Sole author under Mr. Kundan Kumar Singh.',
    approach: ['Migrated the data from Excel to Google Sheets so updates show up live.', 'Built the visualisation app in Dash, Plotly and Flask and deployed it on PythonAnywhere.'],
    tools: ['Python', 'Dash', 'Plotly', 'Flask', 'Google Sheets API', 'PythonAnywhere'],
    outcomes: [],
    evidenceKey: 'iot',
    source: 'ME F376 final report.',
  },
  {
    slug: 'igcar-water-hammer',
    title: 'Water-hammer modelling at IGCAR',
    context: 'Practice School I · Indira Gandhi Centre for Atomic Research',
    period: 'Jun – Jul 2024',
    tier: 'more',
    tracks: ['analytics'],
    oneLiner: 'A numerical model of cavitation and column separation during water hammer in water and steam lines.',
    problem: 'Sudden valve or pump changes create pressure surges that can damage piping.',
    role: 'Summer research intern.',
    approach: ['Solved the continuity and momentum equations with the Method of Characteristics, comparing steady, quasi-steady and unsteady friction models.', 'Implemented the model as a C program and validated it on single-pipeline cases.'],
    tools: ['Method of Characteristics', 'C', 'Numerical simulation'],
    outcomes: [],
    evidenceKey: 'igcar',
    source: 'PS-I report and final presentation.',
  },
  {
    slug: 'solar-distillation',
    title: 'Efficient solar distillation (DSIR project)',
    context: 'DSIR PRISM project · Prof. S. S. Deshmukh · BITS Hyderabad',
    period: '2024 – 2025',
    tier: 'more',
    tracks: ['analytics'],
    oneLiner: 'Simulated and tested three solar-still designs to find the one that produces the most clean water.',
    problem: 'Solar stills turn saline water into drinking water using only sunlight, but output is low. The DSIR-sponsored project set out to design and prove a more efficient apparatus.',
    role: 'Worked on the project through a laboratory project (ME F366, with Khushi Singh) and the G. N. Ramachandran research fellowship, under Prof. Sandip Deshmukh.',
    approach: [
      'Modelled heat and mass transfer in ANSYS Fluent to see how design choices change output.',
      'Compared three designs: unstepped, stepped, and stepped with dimples.',
      'Instrumented the fabricated stills with thermocouples, solarimeters and pH meters, and analysed the logged data.',
    ],
    tools: ['ANSYS Fluent', 'CFD', 'Experimental design', 'Sensor data', 'Excel'],
    outcomes: [
      { label: 'The stepped still with dimples outperformed the other designs by adding heat-absorbing surface area', kind: 'finding' },
      { label: 'A lower starting water depth increased output, since less latent heat is needed', kind: 'finding' },
    ],
    evidenceKey: 'solar',
    evidenceNote: 'Project progress report submitted under the DSIR PRISM scheme (Nov 2024).',
    source: 'DSIR PRISM progress report and ME F366 report.',
  },
]

/** Order of projects per lens. Anything not listed falls back to default order and is dimmed. */
export const lensOrder: Record<Track, string[]> = {
  product: ['kuku-ai-coach', 'hinge', 'lovable', 'replit', 'coinswitch', 'campus-calories', 'swiggy', 'dicta', 'linkedin-creators', 'rigi-tv'],
  analytics: ['coinswitch', 'replit', 'kuku-ai-coach', 'hinge', 'swiggy', 'revx', 'wilp-diffusion', 'torrent-valuation', 'iot-dashboard', 'igcar-water-hammer', 'solar-distillation'],
  consulting: ['revx', 'swiggy', 'gnani', 'rigi-tv', 'torrent-valuation', 'coinswitch'],
  ai: ['kuku-ai-coach', 'dicta', 'ai-support-bot', 'gnani', 'wilp-diffusion', 'lovable', 'iot-dashboard'],
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export const experience: Role[] = [
  {
    org: 'Kuku',
    title: 'Graduate Management Trainee, FDE & AI Operations',
    period: 'Aug 2026 – present',
    place: 'Bengaluru · on-site',
    tracks: ['ai', 'product', 'analytics', 'consulting'],
    bullets: [
      `Built and shipped **Kuku AI Coach** end to end, from the **Claude-powered lesson engine** to the **web and Android** learner flows. It has ${play.coach.downloads} downloads on Google Play.`,
      'Added **AI voice-practice calls** by integrating **ElevenLabs** and **Azure Speech**.',
      'Drove **activation and monetization** with a **free first lesson** and **automatic placement**, plus **subscription and coin billing** on Razorpay and Google Play.',
      'Instrumented the funnel across **Firebase, GA4, AppsFlyer and Meta Pixel**, and supported **A/B tests** and **push campaigns** that bring learners back.',
      'Improved **tutor quality** and **unit economics** through **LLM evaluation**, **safety guardrails**, latency tuning and **prompt caching**.',
      'Built **onboarding placement**, a free first lesson, **coach tools** and **server-decided reminder pushes** with **control groups**.',
      '**Dicta**, an AI voice-to-text app, runs on the **backend I build for Coach**; I also shipped its **paywall**, screen fixes and **tone-quality** work.',
      'Shipped 250+ commits across **web, backend, prompts and analytics** in my first three months.',
    ],
  },
  {
    org: 'BITS Pilani · Work Integrated Learning Programmes',
    title: 'Applied AI & Project Management Intern (Practice School II)',
    period: 'Jul – Dec 2025',
    place: 'Hyderabad',
    tracks: ['ai', 'analytics'],
    bullets: [
      'Built **defocus-deblur, super-resolution and guided-diffusion** pipelines in **PyTorch** for vehicle camera data.',
      'Benchmarked 3+ models (**ESRGAN, Real-ESRGAN, A-ESRGAN**) on **PSNR, SSIM and FID**; **DDIM sampling** cut sampling time 4× with negligible quality loss.',
    ],
  },
  {
    org: 'Metvy',
    title: 'Business Development & Sales Intern',
    period: 'Sep – Nov 2025',
    place: 'Remote',
    tracks: ['consulting', 'analytics'],
    bullets: [
      'Generated 150+ **leads** through **multi-channel outreach** and managed the **CRM** database.',
      'Reached a 12–15% **lead-to-conversation rate** with targeted email and phone campaigns.',
    ],
  },
  {
    org: 'NextLeap',
    title: 'Product Management Fellow (Cohort 39)',
    period: 'Jul – Nov 2025',
    place: 'Remote',
    tracks: ['product'],
    bullets: [
      'Completed the 13-week **fellowship**: understanding the space, **user research**, **prioritisation**, **metrics & growth**, and **technology & AI foundations**.',
      'Case studies on **Hinge** and **Replit**, plus a graduation project on **LinkedIn creator growth**.',
    ],
  },
  {
    org: 'Sasha Innoworks',
    title: 'Student Associate · Team Lead, Autonomous Mobile Robots',
    period: 'Feb – Dec 2025',
    place: 'Hyderabad',
    tracks: ['analytics', 'consulting'],
    bullets: [
      'Led a 16-member **BITS intern team**: task delegation, **mentorship** and **performance tracking**.',
      'Built a **real-time KPI dashboard** to find bottlenecks and reallocated tasks, boosting **efficiency** by 20%.',
      'Applied **root-cause analysis** to robotics data and synthesised reports for project alignment.',
    ],
  },
  {
    org: 'BITS BioCyTiH Foundation',
    title: 'Prof. G. N. Ramachandran Undergraduate Research Fellow',
    period: 'May – Sep 2025',
    place: 'BITS Pilani, Goa',
    tracks: ['analytics'],
    bullets: ['Selected for a **funded four-month research fellowship** under **Prof. Sandip Deshmukh**, Department of Mechanical Engineering.'],
  },
  {
    org: 'Indira Gandhi Centre for Atomic Research',
    title: 'Summer Research Intern (Practice School I)',
    period: 'May – Jul 2024',
    place: 'Kalpakkam',
    tracks: ['analytics'],
    bullets: ['Modelled **cavitation and column separation** during **water hammer** with the **Method of Characteristics**.'],
  },
]

export const leadership = [
  {
    org: 'Utkal Samaj, BITS Hyderabad',
    title: 'Coordinator',
    period: 'Aug 2024 – May 2025',
    text: 'Led a 40+ member team to run 5+ cultural events for 3,000+ attendees, owning budgets, vendors and publicity.',
  },
  {
    org: 'Hindi Tarang, BITS Hyderabad',
    title: 'Social Media & Outreach Lead',
    period: 'Aug 2024 – May 2025',
    text: "Ran the club's social media and outreach campaigns to grow participation in literary events.",
  },
]

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skills: SkillGroup[] = [
  {
    name: 'Product',
    tracks: ['product', 'consulting'],
    items: ['Product strategy', 'Product discovery', 'Problem framing', 'User research & interviews', 'Survey design', 'Personas & journeys', 'PRDs', 'Roadmapping', 'Prioritisation (RICE)', 'North Star & guardrail metrics', 'A/B test design', 'Phased rollouts', 'Competitive analysis', 'Go-to-market', 'Wireframing (Figma, Whimsical)', 'Agile delivery'],
  },
  {
    name: 'AI',
    tracks: ['ai'],
    items: ['Claude API', 'Prompt engineering', 'LLM evaluation', 'Safety guardrails', 'PII redaction', 'Prompt caching', 'Latency & cost optimisation', 'Conversational design', 'Voice AI: speech-to-text & TTS', 'Pronunciation assessment', 'Agentic workflows (n8n)', 'Embeddings & vector search', 'Diffusion models & GANs', 'PyTorch'],
  },
  {
    name: 'Data & Analytics',
    tracks: ['analytics', 'product'],
    items: ['SQL (MySQL)', 'Python (Pandas, NumPy)', 'Funnel & cohort analysis', 'Hypothesis testing', 'Root-cause analysis', 'KPI dashboards', 'Power BI', 'Tableau', 'Excel (advanced)', 'Plotly / Matplotlib', 'GA4', 'Firebase Analytics', 'AppsFlyer', 'Meta Pixel', 'Data storytelling'],
  },
  {
    name: 'Engineering',
    tracks: ['ai'],
    items: ['React', 'TypeScript', 'Vite & Tailwind', 'Django', 'PostgreSQL', 'REST APIs', 'Webhooks', 'Android (Kotlin, Jetpack Compose)', 'Supabase', 'Flask / Dash', 'Git', 'C', 'MATLAB', 'ANSYS Fluent'],
  },
  {
    name: 'Business & Strategy',
    tracks: ['consulting', 'product', 'analytics'],
    items: ['Subscription & coin monetisation', 'Payment integrations (Razorpay, Play Billing)', 'Retention & push campaigns', 'Performance marketing & channel mix', 'Budget allocation', 'Market sizing (TAM/SAM/SOM)', 'Pricing models (CAPEX vs OPEX)', 'Unit economics', 'DCF & FCFF valuation', 'Financial & risk analysis', 'B2B lead generation & CRM'],
  },
]

/* ------------------------------------------------------------------ */
/* Education & certifications                                          */
/* ------------------------------------------------------------------ */

export const education = [
  {
    school: 'Birla Institute of Technology and Science (BITS), Pilani',
    degree: 'B.E. Mechanical Engineering, Minor in Finance',
    period: '2022 – 2026 (Graduated)',
  },
  {
    school: 'NextLeap',
    degree: 'Product Management Fellowship, Cohort 39',
    period: 'Jul – Nov 2025',
    fileKey: 'nextleap-pm-fellowship',
  },
  {
    school: 'Maharishi Arvind Public School',
    degree: 'Senior Secondary (CBSE)',
    period: '2021',
  },
  {
    school: 'Maharishi Arvind Public School',
    degree: 'Secondary (CBSE)',
    period: '2019',
  },
]

const cv = (code: string) => `https://coursera.org/verify/${code}`

export const certs: Cert[] = [
  { title: 'Product Manager Fellowship', issuer: 'NextLeap', date: 'Nov 2025', group: 'Product', fileKey: 'nextleap-pm-fellowship' },
  { title: 'Business Analysis & Process Management', issuer: 'Coursera Project Network', date: 'Jul 2025', group: 'Product', verify: cv('J6U3N8O57TKC'), fileKey: 'coursera-business-analysis' },
  { title: 'Introduction to Figma', issuer: 'Skillup (Simplilearn)', date: 'Oct 2025', group: 'Product', fileKey: 'skillup-figma' },

  { title: 'GenAI Basics: How LLMs Work', issuer: 'Duke University · Coursera', date: 'Jul 2025', group: 'AI', verify: cv('VDX3I9L6HSIC'), fileKey: 'coursera-genai-basics' },
  { title: 'Introduction to Machine Learning', issuer: 'Duke University · Coursera', date: 'Jul 2025', group: 'AI', verify: cv('IRPFNH5CCLP2'), fileKey: 'coursera-intro-ml' },
  { title: 'GenAI Powered Data Analytics Job Simulation', issuer: 'Tata · Forage', date: 'Jul 2026', group: 'AI', fileKey: 'forage-tata-genai' },
  { title: 'Introduction to Generative AI', issuer: 'upGrad', date: 'May 2026', group: 'AI', fileKey: 'upgrad-genai' },
  { title: 'AI for Marketing: SWOT Analysis', issuer: 'Kennesaw State University · Coursera', date: 'Aug 2025', group: 'AI', verify: cv('OCJJ0KQT1B1E'), fileKey: 'coursera-ai-marketing-swot' },

  { title: 'The Structured Query Language (SQL)', issuer: 'University of Colorado Boulder · Coursera', date: 'Jul 2026', group: 'Data & Analytics', verify: cv('VQACAWNZ68UP'), fileKey: 'coursera-sql' },
  { title: 'AI-Powered Data Analysis: A Practical Introduction', issuer: 'University of Michigan · Coursera', date: 'Jul 2025', group: 'Data & Analytics', verify: cv('EWC5OVLVI3R3'), fileKey: 'coursera-ai-data-analysis' },
  { title: 'Data Visualisation: Empowering Business with Effective Insights', issuer: 'Tata · Forage', date: 'Jul 2026', group: 'Data & Analytics', fileKey: 'forage-tata-dataviz' },
  { title: 'Data Analytics Job Simulation', issuer: 'Deloitte Australia · Forage', date: 'Jul 2026', group: 'Data & Analytics', fileKey: 'forage-deloitte' },
  { title: 'Introduction to Data Science Job Simulation', issuer: 'Commonwealth Bank · Forage', date: 'Jul 2026', group: 'Data & Analytics', fileKey: 'forage-cba-datascience' },
  { title: 'Understanding Data Topics', issuer: 'DataCamp', date: 'Nov 2025', group: 'Data & Analytics', fileKey: 'datacamp-data-topics' },
  { title: 'Data Analytics', issuer: 'Skillsetmaster', date: 'Dec 2025', group: 'Data & Analytics', fileKey: 'skillsetmaster-data-analytics' },
  { title: 'The Ultimate Job Ready Data Science Course', issuer: 'CodeWithHarry', date: 'Feb 2026', group: 'Data & Analytics', fileKey: 'codewithharry-data-science' },
  { title: 'Complete Python Bootcamp', issuer: 'CodeWithHarry', date: 'Feb 2026', group: 'Data & Analytics', fileKey: 'codewithharry-python' },
  { title: 'Getting Started with Microsoft Excel', issuer: 'Coursera Project Network', date: 'Jul 2025', group: 'Data & Analytics', verify: cv('LQM2JFBZQAI4'), fileKey: 'coursera-excel' },
  { title: 'Business Analyst Course', issuer: 'Analyst Club', date: 'Apr 2026', group: 'Data & Analytics', fileKey: 'analyst-club-business-analyst' },

  { title: 'Digital Transformation Job Simulation', issuer: 'BCG · Forage', date: 'Jul 2026', group: 'Consulting & Finance', fileKey: 'forage-bcg' },
  { title: 'Advisors & Consulting Services Job Simulation', issuer: 'Mastercard · Forage', date: 'Jul 2026', group: 'Consulting & Finance', fileKey: 'forage-mastercard' },
  { title: 'Management Consulting Leadership Program', issuer: 'Skilled Sapiens', date: 'Oct 2024', group: 'Consulting & Finance', fileKey: 'skilled-sapiens-mclp' },
  { title: 'Finance Leadership Program (Equity Research & Financial Modelling)', issuer: 'Skilled Sapiens', date: 'Oct 2024', group: 'Consulting & Finance', fileKey: 'skilled-sapiens-flp' },

  { title: 'Digital Technologies with CPS, IIoT & Cloud in Manufacturing', issuer: 'BITS Pilani × L&T EduTech', date: 'Dec 2023', group: 'Engineering', fileKey: 'lnt-cps-iiot-cloud' },
  { title: 'Explore Engineering Job Simulation', issuer: 'GE Aerospace · Forage', date: 'Jul 2026', group: 'Engineering', fileKey: 'forage-ge-aerospace' },
  { title: 'Engineering Job Simulation', issuer: 'British Airways · Forage', date: 'Jul 2026', group: 'Engineering', fileKey: 'forage-british-airways' },
  { title: 'MATLAB Onramp', issuer: 'MathWorks', date: 'Jun 2024', group: 'Engineering', fileKey: 'mathworks-matlab' },

  { title: 'Bloomberg Market Concepts', issuer: 'Bloomberg for Education', date: 'Nov 2023', group: 'Consulting & Finance', verify: 'https://portal.bloombergforeducation.com/certificates/vbdiEr3CFUqMJTnGJ1AJbDaQ', fileKey: 'bloomberg-bmc' },
  { title: 'Bloomberg Spreadsheet Analysis', issuer: 'Bloomberg for Education', date: '', group: 'Consulting & Finance' },
  { title: 'Environmental Social Governance (ESG)', issuer: 'Bloomberg for Education', date: '', group: 'Consulting & Finance' },

  { title: 'Collaborating with G Suite Apps', issuer: 'Coursera Project Network', date: 'Jul 2025', group: 'Other', verify: cv('I2YT7SAA4P5U'), fileKey: 'coursera-gsuite' },
  { title: 'Create a No-Code One-Page SMB Website with Carrd', issuer: 'Coursera Project Network', date: 'Jul 2025', group: 'Other', verify: cv('TJXFFPNUQWFK'), fileKey: 'coursera-carrd' },
  { title: 'Create a Profile and Network on LinkedIn', issuer: 'Coursera Project Network', date: 'Jul 2025', group: 'Other', verify: cv('2V9L5R1T0VTO'), fileKey: 'coursera-linkedin-profile' },
  { title: 'The Science of Well-Being for Teens', issuer: 'Yale University · Coursera', date: 'Jun 2026', group: 'Other', verify: cv('6M3TVFBY68H2'), fileKey: 'coursera-yale-wellbeing' },
  { title: 'Suicide Prevention', issuer: 'Wesleyan University · Coursera', date: 'Jun 2026', group: 'Other', verify: cv('30JMVJUMM9VE'), fileKey: 'coursera-wesleyan-suicide-prevention' },
  { title: 'Digital Wellness', issuer: 'Udemy', date: 'Mar 2025', group: 'Other', fileKey: 'udemy-digital-wellness' },
]

export const certGroupTracks: Record<Cert['group'], Track[]> = {
  Product: ['product'],
  AI: ['ai'],
  'Data & Analytics': ['analytics'],
  'Consulting & Finance': ['consulting'],
  Engineering: ['ai'],
  Other: [],
}

/* ------------------------------------------------------------------ */
/* v2 layout content (sources: LinkedIn Kuku role + resumes)           */
/* ------------------------------------------------------------------ */

/** Exactly 6 words: the CSS rotator timing assumes 6. */
export const heroWords = ['AI tutors', 'voice AI', 'LLM evals', 'growth loops', 'billing flows', 'product bets']
export const heroChips = ["BITS Pilani '26", 'FDE & AI Ops', 'LLM products', 'Growth & analytics']
export const ringText = 'PRODUCT • DATA • AI • FDE • GROWTH • STRATEGY • '
export const marqueeTopics = ['AI tutor', 'Voice AI', 'LLM evals', 'Guardrails', 'Billing', 'Growth', 'Analytics', 'Product', 'Strategy']
export const marqueeStack = ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Claude API', 'ElevenLabs', 'Azure Speech', 'Firebase', 'GA4', 'AppsFlyer', 'Razorpay', 'Play Billing']

/** Kept deliberately general: user-facing behaviour and Aryan's own part only. No internals. */
export const playUpdated = play.updated
export const nowStats: { value: string; label: string; live?: boolean }[] = [
  { value: play.coach.downloads, label: 'Coach downloads on Play', live: true },
  { value: `${play.coach.rating}★`, label: 'Coach rating on Play', live: true },
  { value: play.dicta.downloads, label: 'Dicta downloads on Play', live: true },
  { value: `${play.dicta.rating}★`, label: 'Dicta rating on Play', live: true },
  { value: '250+', label: 'commits in my first 3 months' },
]

export const dictaTones = ['Casual', 'Semi-formal', 'Formal', 'Hinglish', 'Hindi']

export type Built = { icon: string; app: 'Coach' | 'Dicta'; tag: string; title: string; sub: string; points: [string, string?][]; tools: string[] }
export const built: Built[] = [
  {
    icon: 'brain',
    app: 'Coach',
    tag: 'Lessons',
    title: 'AI tutor lessons',
    sub: 'Conversation-first English practice',
    points: [['Lessons as a conversation', 'Code picks the goal of each turn, the AI writes the words'], ['Placement first', 'Scored on the server: Beginner, Intermediate or Advanced'], ['Free first lesson', 'Starts the streak and unlocks a voice trial']],
    tools: ['Claude API', 'Prompt design'],
  },
  {
    icon: 'mic',
    app: 'Coach',
    tag: 'Voice',
    title: 'Voice practice calls',
    sub: 'Speak out loud, get feedback after',
    points: [['Timed practice calls with the tutor'], ['Feedback on grammar and pronunciation', 'Arrives as a report after the call'], ['Web and Android']],
    tools: ['ElevenLabs', 'Azure Speech'],
  },
  {
    icon: 'card',
    app: 'Coach',
    tag: 'Money paths',
    title: 'Subscriptions & coins',
    sub: 'A monthly plan, plus coins for practice',
    points: [['Subscriptions with UPI autopay and Play Billing'], ['Coins for voice practice', 'Billed by the minute, unused time refunded'], ['Access follows the payment', 'Confirmed on the server'], ['Tax invoices']],
    tools: ['Razorpay', 'Google Play Billing'],
  },
  {
    icon: 'chart',
    app: 'Coach',
    tag: 'Growth',
    title: 'Growth loop',
    sub: 'Measure the funnel, bring learners back',
    points: [['Funnel analytics on every surface', 'One shared event spec for web, Android and Dicta'], ['A/B tests'], ['Reminder pushes', 'Quiet hours, daily caps, control groups'], ['Ops dashboard', 'Campaign results and editable copy']],
    tools: ['Firebase', 'GA4', 'AppsFlyer', 'Meta Pixel'],
  },
  {
    icon: 'shield',
    app: 'Coach',
    tag: 'Quality · Trust',
    title: 'AI quality & safety',
    sub: 'A tutor that is safe, fast and affordable',
    points: [['Safety checks before every reply'], ['Personal details removed', 'Before anything is stored'], ['LLM evals and model benchmarks'], ['Latency measured step by step'], ['Prompt caching', 'Lower cost per lesson']],
    tools: ['LLM evals', 'Guardrails'],
  },
  {
    icon: 'spark',
    app: 'Coach',
    tag: 'Ship · Iterate',
    title: 'Shipped from feedback',
    sub: 'Learner feedback turned into features',
    points: [['Web app redesign'], ['Coach tools', 'Translate, email, photo or document help'], ['Speak-to-English bubble', 'Later became Dicta'], ['Home-screen widget and lesson-practice fixes']],
    tools: ['React', 'TypeScript', 'Android'],
  },
  {
    icon: 'wave',
    app: 'Dicta',
    tag: 'Voice to English',
    title: 'Dicta bubble',
    sub: 'Hindi or Hinglish in, clear English out',
    points: [['A floating bubble over any app'], ['Five tones to choose from'], ['Copy and paste', 'The user stays in control']],
    tools: ['Android', 'Speech-to-text', 'LLMs'],
  },
  {
    icon: 'shield',
    app: 'Dicta',
    tag: 'Shared backend',
    title: 'The engine behind Dicta',
    sub: 'Built for Coach first, now powering Dicta',
    points: [['Speech to text, then a rewrite in your tone'], ['Safety checks on every request'], ['Sign-in, daily limits and Premium', 'With UPI autopay'], ['Its own analytics stream']],
    tools: ['Django', 'PostgreSQL', 'Claude API'],
  },
  {
    icon: 'card',
    app: 'Dicta',
    tag: 'My part',
    title: 'Paywall & tone quality',
    sub: 'What I shipped on Dicta',
    points: [['Premium paywall layout'], ['Home and profile screen fixes'], ['Tone quality', 'Casual tone no longer adds things you never said'], ['Safety and analytics audits']],
    tools: ['Jetpack Compose', 'Prompt design'],
  },
]

/** "How I work" steps: their own banner section after Education & certificates. */
export const howIWork = [
  { icon: 'brain', title: 'Discover', text: 'Talk to users and the team, read the funnel, and find where time and drop-offs really go, and where AI actually earns its keep.' },
  { icon: 'spark', title: 'Build', text: 'Ship a working slice fast: real prompts, real data and real users on web and Android, not a demo.' },
  { icon: 'shield', title: 'Deploy', text: 'Roll it out safely: checks on the server, guardrails before every AI reply, access only after payment is confirmed.' },
  { icon: 'chart', title: 'Measure', text: 'Instrument every step, run A/B tests and control groups, and iterate on what the numbers say.' },
]
