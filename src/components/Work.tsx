import { lensOrder, lenses, projects } from '../data/content'
import type { Lens, Project } from '../data/types'
import { asset, openCase, workAssets } from '../lib/hooks'
import { Icon, KindBadge, SectionHead, Tag, trackLabel } from './ui'

export const matches = (p: { tracks: string[] }, lens: Lens) => lens === 'all' || p.tracks.includes(lens)

export function sortForLens(list: Project[], lens: Lens) {
  if (lens === 'all') return list
  const order = lensOrder[lens]
  const rank = (p: Project) => {
    const i = order.indexOf(p.slug)
    return i === -1 ? 100 + projects.indexOf(p) : i
  }
  return [...list].sort((a, b) => rank(a) - rank(b))
}

export function LensBar({ lens, setLens }: { lens: Lens; setLens: (l: Lens) => void }) {
  const current = lenses.find((l) => l.id === lens)!
  return (
    <div className="no-print sticky top-16 z-30 -mx-4 mb-12 border-y border-line bg-paper/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="View work through a role lens" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
          {lenses.map((l) => {
            const on = l.id === lens
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={on}
                onClick={() => setLens(l.id)}
                className={`min-h-10 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors ${
                  on ? 'bg-ink text-paper' : 'text-muted hover:bg-paper-2 hover:text-ink'
                }`}
              >
                {l.label}
              </button>
            )
          })}
        </div>
        <p className="px-2 text-xs text-muted sm:text-right" aria-live="polite">
          <span className="eyebrow mr-2 !text-[0.65rem]">Lens</span>
          {current.blurb}
        </p>
      </div>
    </div>
  )
}

function topOutcome(p: Project) {
  return p.outcomes.find((o) => o.value && o.kind === 'shipped') ?? p.outcomes.find((o) => o.value)
}

function openHandler(slug: string) {
  return (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    openCase(slug)
  }
}

/* ---------- Kuku system map (used on card + case study) ---------- */

export function KukuSystemMap({ compact = false }: { compact?: boolean }) {
  const blocks: { title: string; items: string[]; strong?: boolean }[] = [
    { title: 'Learner', items: ['Web', 'Android', 'Home-screen widget'] },
    { title: 'Lesson engine', items: ['Claude API', 'Prompt design', 'Placement'], strong: true },
    { title: 'Voice practice', items: ['ElevenLabs', 'Azure Speech'] },
    { title: 'AI quality', items: ['LLM evals', 'Guardrails', 'Latency', 'Prompt caching'] },
    { title: 'Monetisation', items: ['Razorpay', 'Google Play', 'Subscriptions + coins'] },
    { title: 'Growth loop', items: ['Firebase', 'GA4', 'AppsFlyer', 'Meta Pixel', 'Push'] },
  ]
  return (
    <figure aria-label="Kuku AI Coach system map: what I work on" className="w-full">
      <ol className={`grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {blocks.map((b, i) => (
          <li key={b.title} className={`rounded-xl border p-3 ${b.strong ? 'border-accent bg-accent-soft' : 'border-line bg-card'}`}>
            <p className="num text-[0.65rem] tracking-[0.12em] text-muted uppercase">
              {String(i + 1).padStart(2, '0')} · {b.title}
            </p>
            <p className="mt-1.5 text-[0.8rem] leading-snug text-ink">{b.items.join(' · ')}</p>
          </li>
        ))}
      </ol>
      {!compact && <figcaption className="mt-3 text-xs text-muted">The parts of Kuku AI Coach I work across: stack from LinkedIn and resume. Not an internal architecture diagram.</figcaption>}
    </figure>
  )
}

export function DictaFlow() {
  return (
    <figure aria-label="Dicta: mixed-language speech in, clear English out" className="mt-6 rounded-2xl border border-line bg-paper-2 p-4">
      <ol className="flex flex-col gap-2 text-sm">
        <li className="rounded-xl border border-line bg-card px-3 py-2.5">
          <span className="num block text-[0.65rem] tracking-[0.12em] text-muted uppercase">In</span>
          Mixed-language speech
        </li>
        <li aria-hidden="true" className="pl-4 text-accent">
          ↓
        </li>
        <li className="rounded-xl border border-accent bg-accent-soft px-3 py-2.5">
          <span className="num block text-[0.65rem] tracking-[0.12em] text-muted uppercase">Out</span>
          Clear English text
        </li>
      </ol>
    </figure>
  )
}

/* ---------- Cards ---------- */

function FlagshipCard({ p, lens, big }: { p: Project; lens: Lens; big: boolean }) {
  const o = topOutcome(p)
  return (
    <article className={`reveal group relative flex flex-col rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-8 ${big ? 'lg:col-span-8' : 'lg:col-span-4'} ${matches(p, lens) ? '' : 'dimmed'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Flagship · {p.context.split('·')[0].trim()}</p>
        <span className="num text-xs text-muted">{p.period}</span>
      </div>
      <h3 className="display mt-4 text-3xl font-medium sm:text-4xl">
        <a href={`#/work/${p.slug}`} onClick={openHandler(p.slug)} className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none">
          {p.title}
        </a>
      </h3>
      <p className="mt-3 max-w-xl text-muted">{p.oneLiner}</p>
      {o && (
        <p className="mt-6 flex items-baseline gap-3">
          <span className="num text-5xl font-medium text-accent sm:text-6xl">{o.value}</span>
          <span className="text-sm text-ink">{o.label}</span>
        </p>
      )}
      {big && (
        <div className="mt-6">
          <KukuSystemMap compact />
        </div>
      )}
      {p.slug === 'dicta' && <DictaFlow />}
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <div className="flex flex-wrap gap-1.5">
          {p.tools.slice(0, big ? 6 : 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent">
          Read <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}

function CaseCard({ p, lens, index }: { p: Project; lens: Lens; index: number }) {
  const a = p.evidenceKey ? workAssets[p.evidenceKey] : undefined
  const o = topOutcome(p)
  const tall = a && a.slides[0] && a.slides[0].h > a.slides[0].w
  return (
    <article
      className={`reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] ${matches(p, lens) ? '' : 'dimmed'}`}
      style={{ transitionDelay: `${(index % 3) * 60}ms` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-paper-2">
        {a ? (
          <img
            src={asset(a.thumb)}
            alt=""
            loading="lazy"
            decoding="async"
            className={`size-full transition-transform duration-500 group-hover:scale-[1.03] ${tall ? 'object-cover object-top' : 'object-cover'}`}
          />
        ) : (
          <div className="grid size-full place-items-center p-6 text-center">
            <p className="display text-xl text-muted">{p.title}</p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow !text-[0.66rem]">{p.context}</p>
        <h3 className="display mt-2 text-xl leading-tight font-medium">
          <a href={`#/work/${p.slug}`} onClick={openHandler(p.slug)} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
            {p.title}
          </a>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.oneLiner}</p>
        {o && (
          <div className="mt-4 flex items-start gap-3 border-t border-line pt-4">
            <span className="num shrink-0 text-xl font-medium whitespace-nowrap text-ink">{o.value}</span>
            <span className="text-xs leading-snug text-muted">
              <KindBadge kind={o.kind} /> <span className="ml-1">{o.label}</span>
            </span>
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {p.tracks.map((t) => (
            <Tag key={t} active={t === lens}>
              {trackLabel[t]}
            </Tag>
          ))}
        </div>
      </div>
    </article>
  )
}

export function Work({ lens, setLens }: { lens: Lens; setLens: (l: Lens) => void }) {
  const flagship = sortForLens(projects.filter((p) => p.tier === 'flagship'), lens)
  const cases = sortForLens(projects.filter((p) => p.tier === 'case'), lens)
  const more = sortForLens(projects.filter((p) => p.tier === 'more'), lens)
  const relevant = lens === 'all' ? cases : cases.filter((p) => matches(p, lens))
  const rest = lens === 'all' ? [] : cases.filter((p) => !matches(p, lens))

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <SectionHead id="work-title" eyebrow="Selected work" title={<>Things I&rsquo;ve shipped, researched and pitched.</>}>
        Two products I build at Kuku, then case studies with the research and decks behind them. Pick a lens to put the most relevant work first.
      </SectionHead>

      <LensBar lens={lens} setLens={setLens} />

      <div className="grid gap-5 lg:grid-cols-12">
        {flagship.map((p) => (
          <FlagshipCard key={p.slug} p={p} lens={lens} big={p.slug === 'kuku-ai-coach'} />
        ))}
      </div>

      <h3 className="eyebrow mt-20 mb-6">{lens === 'all' ? 'Case studies' : `Most relevant · ${lenses.find((l) => l.id === lens)!.label}`}</h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {relevant.map((p, i) => (
          <CaseCard key={p.slug} p={p} lens={lens} index={i} />
        ))}
      </div>
      {rest.length > 0 && (
        <>
          <h3 className="eyebrow mt-14 mb-6">Other case studies</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <CaseCard key={p.slug} p={p} lens={lens} index={i} />
            ))}
          </div>
        </>
      )}

      <h3 className="eyebrow mt-20 mb-4">More projects</h3>
      <ul className="border-t border-line">
        {more.map((p) => (
          <li key={p.slug} className={`reveal group relative border-b border-line ${matches(p, lens) ? '' : 'dimmed'}`}>
            <div className="grid gap-1 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-4">
              <p className="num text-xs text-muted sm:col-span-2">{p.period ?? ''}</p>
              <h4 className="display text-lg font-medium sm:col-span-4">
                <a href={`#/work/${p.slug}`} onClick={openHandler(p.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
                  {p.title}
                </a>
              </h4>
              <p className="text-sm text-muted sm:col-span-5">{p.oneLiner}</p>
              <span className="hidden justify-self-end text-accent sm:col-span-1 sm:inline-flex" aria-hidden="true">
                <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
