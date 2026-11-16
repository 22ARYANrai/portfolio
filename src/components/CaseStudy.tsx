import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/content'
import type { Project } from '../data/types'
import { asset, fmtSize, openCase, workAssets } from '../lib/hooks'
import { DictaFlow, KukuSystemMap } from './Work'
import { Icon, KindBadge, Tag } from './ui'

function SlideViewer({ p }: { p: Project }) {
  const a = workAssets[p.evidenceKey!]
  const [i, setI] = useState(0)
  const n = a.slides.length
  const go = (d: number) => setI((x) => (x + d + n) % n)
  const s = a.slides[i]
  const thumbs = useRef<HTMLDivElement>(null)

  useEffect(() => {
    thumbs.current?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [i])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${p.title}: evidence, ${n} ${n === 1 ? 'page' : 'slides'}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          go(1)
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          go(-1)
        }
      }}
      className="rounded-2xl border border-line bg-paper-2 p-2 sm:p-3"
    >
      <div className="relative overflow-hidden rounded-xl bg-card" style={{ aspectRatio: `${s.w} / ${Math.min(s.h, s.w * 1.3)}` }}>
        <a href={asset(s.src)} target="_blank" rel="noopener noreferrer" className="block size-full" aria-label={`Open slide ${i + 1} full size in a new tab`}>
          <img
            key={s.src}
            src={asset(s.src)}
            alt={`${p.title}, ${n === 1 ? 'page' : `slide ${i + 1} of ${n}`}`}
            className={`size-full ${s.h > s.w * 1.3 ? 'object-cover object-top' : 'object-contain'}`}
            decoding="async"
          />
        </a>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink shadow-[var(--shadow)] hover:bg-ink hover:text-paper">
              <Icon name="left" className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink shadow-[var(--shadow)] hover:bg-ink hover:text-paper">
              <Icon name="right" className="size-5" />
            </button>
          </>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="num text-xs text-muted" aria-live="polite">
          {n > 1 ? `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')} · ← → to browse` : 'Preview'}
        </p>
        {a.pdf && (
          <a href={asset(a.pdf)} download className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/80 px-4 text-sm font-medium hover:bg-ink hover:text-paper">
            <Icon name="download" /> Download PDF
            <span className="num text-xs opacity-70">
              {a.pages ? `${a.pages} pp · ` : ''}
              {fmtSize(a.pdfKB)}
            </span>
          </a>
        )}
      </div>
      {n > 1 && (
        <div ref={thumbs} className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
          {a.slides.map((t, k) => (
            <button
              key={t.src}
              data-i={k}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Go to slide ${k + 1}`}
              aria-current={k === i}
              className={`h-14 shrink-0 overflow-hidden rounded-md border-2 transition-opacity ${k === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
              style={{ aspectRatio: `${t.w} / ${Math.min(t.h, t.w * 1.3)}` }}
            >
              <img src={asset(t.src)} alt="" loading="lazy" className="size-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function CaseStudy({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const p = projects.find((x) => x.slug === slug)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (p && !d.open) {
      d.showModal()
      document.body.style.overflow = 'hidden'
    }
    if (!p && d.open) d.close()
    if (p) {
      d.scrollTop = 0
      d.querySelector<HTMLElement>('[data-autofocus]')?.focus()
      document.title = `${p.title} · Aryan Rai`
    } else {
      document.body.style.overflow = ''
      document.title = 'Aryan Rai · AI Product Builder'
    }
  }, [p])

  const idx = p ? projects.indexOf(p) : -1
  const prev = idx > 0 ? projects[idx - 1] : null
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null

  return (
    <dialog
      ref={ref}
      className="case"
      aria-labelledby="case-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClose={() => {
        document.body.style.overflow = ''
      }}
    >
      {p && (
        <div className="min-h-full">
          <div className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
              <p className="eyebrow truncate pr-4">{p.tier === 'flagship' ? 'Flagship' : 'Case study'} · {p.context.replace(/^Product case study · /, '')}</p>
              <button type="button" data-autofocus onClick={onClose} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm hover:bg-ink hover:text-paper">
                <Icon name="close" /> Close <span className="sr-only">case study</span>
              </button>
            </div>
          </div>

          <article className="mx-auto max-w-5xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
            <header>
              <h1 id="case-title" className="display text-4xl leading-[1.02] font-medium sm:text-6xl">
                {p.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-muted sm:text-xl">{p.oneLiner}</p>
              <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                <div className="bg-card p-4">
                  <dt className="eyebrow !text-[0.65rem]">My role</dt>
                  <dd className="mt-1.5 text-sm">{p.role}</dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="eyebrow !text-[0.65rem]">Context</dt>
                  <dd className="mt-1.5 text-sm">
                    {p.context}
                    {p.period && <span className="num block text-xs text-muted">{p.period}</span>}
                  </dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="eyebrow !text-[0.65rem]">Tools</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {p.tools.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </dd>
                </div>
              </dl>
            </header>

            <section aria-labelledby="c-problem" className="mt-14 grid gap-4 md:grid-cols-12 [&>*]:min-w-0">
              <h2 id="c-problem" className="eyebrow md:col-span-3 md:pt-1.5">
                {p.tier === 'flagship' ? 'The product' : 'Problem'}
              </h2>
              <p className="display text-xl leading-relaxed font-light md:col-span-9 sm:text-2xl">{p.problem}</p>
            </section>

            {p.approach.length > 0 && (
              <section aria-labelledby="c-approach" className="mt-14 grid gap-4 md:grid-cols-12 [&>*]:min-w-0">
                <h2 id="c-approach" className="eyebrow md:col-span-3 md:pt-1">
                  Approach
                </h2>
                <ol className="space-y-4 md:col-span-9">
                  {p.approach.map((s, k) => (
                    <li key={k} className="grid grid-cols-[2.25rem_1fr] gap-2 border-t border-line pt-4">
                      <span className="num text-sm text-accent">{String(k + 1).padStart(2, '0')}</span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {p.outcomes.length > 0 && (
              <section aria-labelledby="c-outcome" className="mt-14 grid gap-4 md:grid-cols-12 [&>*]:min-w-0">
                <div className="md:col-span-3">
                  <h2 id="c-outcome" className="eyebrow md:pt-1">
                    Outcome
                  </h2>
                  <p className="mt-3 hidden text-xs leading-relaxed text-muted md:block">
                    <KindBadge kind="shipped" /> measured result
                    <br />
                    <KindBadge kind="finding" /> research finding
                    <br />
                    <KindBadge kind="target" /> projected in the proposal
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 md:col-span-9">
                  {p.outcomes.map((o, k) => (
                    <li key={k} className={`rounded-xl border p-4 ${o.kind === 'shipped' ? 'border-accent bg-accent-soft' : 'border-line bg-card'}`}>
                      <KindBadge kind={o.kind} />
                      {o.value && <p className="num mt-2 text-3xl font-medium whitespace-nowrap">{o.value}</p>}
                      <p className="mt-1 text-sm leading-snug text-muted">{o.label}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {p.note && (
              <p className="mt-8 border-l-2 border-accent pl-4 md:ml-[25%]">
                <span className="text-muted">{p.note}</span>
              </p>
            )}

            <section aria-labelledby="c-evidence" className="mt-14 grid gap-4 md:grid-cols-12 [&>*]:min-w-0">
              <h2 id="c-evidence" className="eyebrow md:col-span-3 md:pt-1">
                Evidence
              </h2>
              <div className="md:col-span-9">
                {p.slug === 'kuku-ai-coach' && <KukuSystemMap />}
                {p.slug === 'dicta' && <div className="max-w-sm [&>figure]:mt-0"><DictaFlow /></div>}
                {p.evidenceKey && <SlideViewer key={p.slug} p={p} />}
                {p.evidenceNote && <p className={`text-sm text-muted ${p.evidenceKey || p.slug === 'kuku-ai-coach' || p.slug === 'dicta' ? 'mt-3' : ''}`}>{p.evidenceNote}</p>}
                <p className="mt-4 text-xs text-muted">Source: {p.source}</p>
              </div>
            </section>

            <nav aria-label="More case studies" className="mt-20 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? (
                <a href={`#/work/${prev.slug}`} onClick={(e) => (e.preventDefault(), openCase(prev.slug))} className="group rounded-xl p-3 hover:bg-paper-2">
                  <span className="eyebrow inline-flex items-center gap-1">
                    <Icon name="left" className="size-3" /> Previous
                  </span>
                  <span className="display mt-1 block text-lg">{prev.title}</span>
                </a>
              ) : (
                <span />
              )}
              {next && (
                <a href={`#/work/${next.slug}`} onClick={(e) => (e.preventDefault(), openCase(next.slug))} className="group rounded-xl p-3 text-right hover:bg-paper-2">
                  <span className="eyebrow inline-flex items-center gap-1">
                    Next <Icon name="right" className="size-3" />
                  </span>
                  <span className="display mt-1 block text-lg">{next.title}</span>
                </a>
              )}
            </nav>
          </article>
        </div>
      )}
    </dialog>
  )
}
