/* ==================================================================
   Neo-brutalist "AI-native product engineer" pieces: sticker, playground, card switch.
   Everything the playground says is assembled from this site's own
   content (src/data/content.ts). No live model, no invented facts.
   ================================================================== */
import { useEffect, useRef, useState } from 'react'
import { experience, nowStats, projects, skills } from '../data/content'
import { RESUME_URL, useResume } from '../lib/hooks'
import type { Project } from '../data/types'

/* ---------- Badge: SHIPPED / CASE STUDY / R&D, derived from the data ---------- */
export function stageOf(p: Project): 'SHIPPED' | 'R&D' | 'CASE STUDY' {
  // shipped = a real product people use (the Kuku apps, own builds); a GTM or PM case study is not
  if (p.tier === 'flagship' || /product build|personal build/i.test(p.context)) return 'SHIPPED'
  if (/practice school|dsir|design project|research/i.test(p.context)) return 'R&D'
  return 'CASE STUDY'
}
export function StageBadge({ p }: { p: Project }) {
  const s = stageOf(p)
  const bg = s === 'SHIPPED' ? 'bg-[var(--acid)]' : s === 'R&D' ? 'bg-[var(--safety)]' : 'bg-[var(--pop)]'
  return <span className={`brut-badge num ${bg}`}>{s}</span>
}

/* ---------- Product UI vs Under-the-hood switch for a project card ---------- */
export function FaceSwitch({ hood, onFlip }: { hood: boolean; onFlip: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={hood} onClick={onFlip} className="face-switch num" aria-label="Show under the hood">
      <span className={hood ? '' : 'on'}>Product</span>
      <span className={hood ? 'on' : ''}>Under the hood</span>
    </button>
  )
}
export function HoodView({ p }: { p: Project }) {
  return (
    <div className="mt-3 space-y-3 text-sm">
      <div>
        <p className="num text-[0.66rem] tracking-[0.14em] uppercase">Stack</p>
        <p className="num mt-1 leading-relaxed">{p.tools.join(' · ')}</p>
      </div>
      <div>
        <p className="num text-[0.66rem] tracking-[0.14em] uppercase">Key decisions</p>
        <ul className="mt-1 space-y-1.5">
          {p.approach.slice(0, 3).map((a) => (
            <li key={a} className="grid grid-cols-[0.9rem_1fr] leading-snug text-muted">
              <span aria-hidden="true">▸</span>
              <span className="line-clamp-3">{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ---------- Hero sticker ---------- */
export function StatusSticker() {
  return (
    <button
      type="button"
      // contact is the last section: go to the very bottom so its last line is never cut off
      onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
      className="sticker absolute -top-2 -right-2 z-10 grid size-24 place-items-center sm:size-32 lg:-top-4 lg:-right-4"
      aria-label="AI sprints, 0 to 1 builds. Let’s talk: jump to contact."
    >
      <svg viewBox="0 0 100 100" className="sticker-ring absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path id="stk" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="num" fontSize="8.2" fontWeight="700" fill="currentColor">
          <textPath href="#stk" textLength="236" lengthAdjust="spacing">
            AI SPRINTS · 0→1 BUILDS · LET’S TALK ·
          </textPath>
        </text>
      </svg>
      <span className="relative grid size-9 place-items-center rounded-full border-2 border-black bg-[var(--acid)] text-black sm:size-11">
        <span className="size-2.5 animate-ping rounded-full bg-black" aria-hidden="true" />
      </span>
    </button>
  )
}

/* ---------- Drag-to-context playground ---------- */
// short desk labels so all 19 items fit on one screen
const SHORT: Record<string, string> = {
  'wilp-diffusion': 'Diffusion & GANs',
  'solar-distillation': 'Solar distillation',
  'igcar-water-hammer': 'Water hammer',
  'iot-dashboard': 'IoT dashboard',
  'torrent-valuation': 'Torrent valuation',
  'ai-support-bot': 'AI support bot',
  'linkedin-creators': 'LinkedIn creators',
}
type Item = { id: string; label: string; kind: 'project' | 'resume'; p?: Project }
const DESK: Item[] = [
  { id: 'resume', label: 'Resume', kind: 'resume' },
  ...projects.map((p) => ({ id: p.slug, label: SHORT[p.slug] ?? p.title.split(':')[0], kind: 'project' as const, p })),
]
const PROMPTS = [
  { id: 'build', label: 'What did you build?' },
  { id: 'stack', label: 'Architecture & stack' },
  { id: 'impact', label: 'Impact & metrics' },
  { id: 'role', label: 'Your role' },
] as const
type PromptId = (typeof PROMPTS)[number]['id']
const strip = (t: string) => t.replace(/\*\*/g, '')

function answer(items: Item[], q: PromptId): string {
  if (!items.length) return 'Context window is empty. Drag a project card or the Resume pill in here first (or tap it).'
  return items
    .map((it) => {
      if (it.kind === 'resume') {
        const k = experience[0]
        if (q === 'build') return `## Resume\n${experience.slice(0, 4).map((r) => `- ${r.org}: ${r.title} (${r.period})`).join('\n')}`
        if (q === 'stack') return `## Resume · skills\n${skills.filter((g) => g.items.length).map((g) => `- ${g.name}: ${g.items.slice(0, 5).join(', ')}`).join('\n')}`
        if (q === 'impact') return `## Resume · numbers\n${nowStats.map((s) => `- ${s.value} ${s.label}`).join('\n')}`
        return `## Resume · current role\n${k.title} at ${k.org}, ${k.place}.\n${strip(k.bullets[0])}`
      }
      const p = it.p!
      if (q === 'build') return `## ${p.title}\n${p.oneLiner}\n${p.problem}`
      if (q === 'stack') return `## ${p.title} · under the hood\nStack: ${p.tools.join(', ')}\n${p.approach.slice(0, 3).map((a) => `- ${a}`).join('\n')}`
      if (q === 'impact') {
        const o = p.outcomes.filter((x) => x.value)
        return `## ${p.title} · impact\n${o.length ? o.map((x) => `- ${x.value} ${x.label}${x.kind === 'target' ? ' (target)' : ''}`).join('\n') : '- No published metric. See the case study for findings.'}`
      }
      return `## ${p.title} · my role\n${p.role}`
    })
    .join('\n\n')
}
const tokens = (items: Item[]) =>
  Math.round(items.reduce((n, it) => n + (it.p ? JSON.stringify(it.p).length : JSON.stringify(experience).length), 0) / 4)

export function Playground() {
  const [ctx, setCtx] = useState<string[]>(['kuku-ai-coach'])
  const [over, setOver] = useState(false)
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)
  const resume = useResume()
  const timer = useRef(0)
  const items = DESK.filter((d) => ctx.includes(d.id))
  const toggle = (id: string) => setCtx((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const ask = (q: PromptId) => {
    clearInterval(timer.current)
    const full = `> ${PROMPTS.find((p) => p.id === q)!.label}\n> context: [${items.map((i) => i.label).join(', ') || 'empty'}]\n\n${answer(items, q)}`
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setOut(full)
    let n = 0
    setBusy(true)
    timer.current = window.setInterval(() => {
      n += 6
      setOut(full.slice(0, n))
      if (n >= full.length) {
        clearInterval(timer.current)
        setBusy(false)
      }
    }, 16)
  }
  useEffect(() => () => clearInterval(timer.current), [])

  return (
    <section id="playground" aria-labelledby="pg-title" className="acc-lime mx-auto max-w-7xl px-5 pt-12 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:pt-12">
      <header className="reveal mb-6">
        <p className="kicker eyebrow !text-acc">AI playground · simulated</p>
        <h2 id="pg-title" className="display mt-3 text-[2.6rem] leading-[0.95] uppercase sm:text-6xl lg:text-7xl">
          Query my <span className="text-acc">work</span>
        </h2>
        <p className="mt-3 max-w-3xl text-muted">
          Drag or click project cards or my resume into the context window, then pick a prompt. Answers are assembled from this site&rsquo;s own case-study data, no live model.
        </p>
      </header>
      {/* desk sets the row height; the terminal fills that height beside it (no inner scrolling on the desk) */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,36rem)_1fr]">
        <div className="brut bg-card p-3 sm:p-4">
          <p className="num text-[0.68rem] tracking-[0.14em] uppercase">Desk · {DESK.length} items</p>
          <ul aria-label="Projects and resume" className="mt-3 grid grid-cols-2 gap-2 pr-1.5 pb-1.5 sm:grid-cols-3">
            {DESK.map((d) => (
              <li key={d.id} className={d.kind === 'resume' ? 'col-span-full' : ''}>
                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', d.id)}
                  onClick={() => toggle(d.id)}
                  aria-pressed={ctx.includes(d.id)}
                  title={d.p?.title}
                  className={`press brut-chip desk-chip w-full text-left ${ctx.includes(d.id) ? 'bg-[var(--acid)] text-black' : 'bg-card'} ${d.kind === 'resume' ? 'justify-center rounded-full' : ''}`}
                >
                  <span aria-hidden="true">{d.kind === 'resume' ? '📄' : '▦'}</span>
                  <span className="leading-tight sm:truncate">{d.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[30rem] lg:h-auto">
        <div
          onDragOver={(e) => (e.preventDefault(), setOver(true))}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            const id = e.dataTransfer.getData('text/plain')
            if (id && !ctx.includes(id)) setCtx((c) => [...c, id])
          }}
          className={`brut flex h-full flex-col bg-[#0d0d0d] lg:absolute lg:inset-0 text-[#f4f4f0] ${over ? 'outline-4 outline-offset-4 outline-[var(--acid)] outline-dashed' : ''}`}
        >
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#f4f4f0] px-4 py-2.5">
            <span className="num flex items-center gap-2 text-xs">
              <span className="size-3 rounded-full bg-[var(--safety)]" />
              <span className="size-3 rounded-full bg-[var(--pop)]" />
              <span className="size-3 rounded-full bg-[var(--acid)]" />
              <span className="ml-2">context_window.sh</span>
            </span>
            <span className="num text-[0.7rem] text-[#c8c8be]">
              {items.length} {items.length === 1 ? 'item' : 'items'} · ~{tokens(items).toLocaleString('en-IN')} tokens
            </span>
          </div>
          <ul className="flex min-h-12 flex-wrap gap-2 border-b-2 border-dashed border-[#555] px-4 py-3" aria-label="In context">
            {items.length ? (
              items.map((i) => (
                <li key={i.id}>
                  <button type="button" onClick={() => toggle(i.id)} className="num rounded border-2 border-[#f4f4f0] bg-[var(--acid)] px-2 py-0.5 text-xs font-bold text-black" aria-label={`Remove ${i.label} from context`}>
                    {i.label} ×
                  </button>
                </li>
              ))
            ) : (
              <li className="num text-xs text-[#9a9a90]">Drop items here…</li>
            )}
          </ul>
          <pre aria-live="polite" aria-busy={busy} tabIndex={0} className="num min-h-0 flex-1 overflow-auto px-4 py-4 text-[0.8rem] leading-relaxed whitespace-pre-wrap">
            {out || '$ pick a prompt below to run it against the context'}
            {busy && <span className="caret" aria-hidden="true" />}
          </pre>
          {resume && ctx.includes('resume') && (
            <a href={RESUME_URL} download="Aryan-Rai-Resume.pdf" className="num border-t-2 border-dashed border-[#555] px-4 py-2 text-xs font-bold text-[var(--acid)] underline">
              ↓ Download full resume (PDF)
            </a>
          )}
          <div className="grid grid-cols-2 gap-2 border-t-2 border-[#f4f4f0] p-2.5 sm:flex sm:flex-wrap">
            {PROMPTS.map((p) => (
              <button key={p.id} type="button" onClick={() => ask(p.id)} className="press brut-chip desk-chip justify-center bg-[var(--pop)] text-center text-black">
                {p.label}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
