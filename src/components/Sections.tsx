import { useState } from 'react'
import { allResumes, certGroupTracks, certs, education, experience, leadership, profile, skills } from '../data/content'
import type { Cert, Lens } from '../data/types'
import { asset, certAssets, fmtSize, resumeAssets } from '../lib/hooks'
import { matches } from './Work'
import { ButtonLink, Icon, SectionHead, Tag, trackLabel } from './ui'

/* ---------- Experience ---------- */

export function Experience({ lens }: { lens: Lens }) {
  return (
    <section id="experience" aria-labelledby="exp-title" className="border-t border-line bg-paper-2/50">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHead id="exp-title" eyebrow="Experience" title="Where I've done the work." />
        <ol className="relative">
          {experience.map((r, i) => {
            const first = i === 0
            return (
              <li key={r.org + r.title} className={`reveal grid gap-3 border-t border-line py-8 md:grid-cols-12 md:gap-6 ${matches(r, lens) ? '' : 'dimmed'}`}>
                <div className="md:col-span-3">
                  <p className="num text-sm text-ink">{r.period}</p>
                  {r.place && <p className="mt-1 text-xs text-muted">{r.place}</p>}
                </div>
                <div className="md:col-span-9">
                  <h3 className={`display font-medium ${first ? 'text-3xl' : 'text-2xl'}`}>{r.title}</h3>
                  <p className="mt-1 text-muted">
                    {r.org}
                    {first && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 align-middle text-[0.65rem] font-medium tracking-wide text-on-accent uppercase">
                        <span className="size-1.5 rounded-full bg-on-accent" aria-hidden="true" /> Current
                      </span>
                    )}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {r.bullets.map((b) => (
                      <li key={b} className="grid grid-cols-[1rem_1fr] leading-relaxed">
                        <span className="mt-[0.7em] h-px w-2.5 bg-accent" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {r.tracks.map((t) => (
                      <Tag key={t} active={t === lens}>
                        {trackLabel[t]}
                      </Tag>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <h3 className="eyebrow mt-16 mb-4">Leadership</h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          {leadership.map((l) => (
            <li key={l.org} className="reveal rounded-2xl border border-line bg-card p-5">
              <p className="num text-xs text-muted">{l.period}</p>
              <p className="display mt-2 text-lg font-medium">
                {l.title}, {l.org}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{l.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Skills ---------- */

export function Skills({ lens }: { lens: Lens }) {
  const groups = lens === 'all' ? skills : [...skills].sort((a, b) => Number(matches(b, lens)) - Number(matches(a, lens)))
  return (
    <section id="skills" aria-labelledby="skills-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHead id="skills-title" eyebrow="Skills" title="Grouped by the track they serve." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => {
          const on = lens !== 'all' && matches(g, lens)
          return (
            <div key={g.name} className={`reveal rounded-2xl border p-6 ${on ? 'border-accent bg-accent-soft' : 'border-line bg-card'} ${matches(g, lens) ? '' : 'dimmed'}`} style={{ transitionDelay: `${i * 50}ms` }}>
              <h3 className="display text-2xl font-medium">{g.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${g.name} skills`}>
                {g.items.map((s) => (
                  <li key={s} className="rounded-full border border-line bg-paper px-3 py-1 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Credentials ---------- */

const groupOrder: Cert['group'][] = ['AI', 'Product', 'Data & Analytics', 'Consulting & Finance', 'Engineering']

function CertRow({ c }: { c: Cert }) {
  const f = c.fileKey ? certAssets[c.fileKey] : undefined
  return (
    <li className="grid gap-2 border-b border-line py-4 sm:grid-cols-12 sm:items-center sm:gap-4">
      <div className="sm:col-span-7">
        <p className="leading-snug font-medium">{c.title}</p>
        <p className="mt-0.5 text-sm text-muted">{c.issuer}</p>
      </div>
      <p className="num text-xs text-muted sm:col-span-2">{c.date}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:col-span-3 sm:justify-end">
        {c.verify && (
          <a href={c.verify} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1 sm:min-h-0">
            Verify <Icon name="external" className="size-3.5" />
            <span className="sr-only">{c.title} on Coursera (opens in a new tab)</span>
          </a>
        )}
        {f && (
          <a href={asset(f.pdf)} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1 sm:min-h-0">
            Certificate <span className="sr-only">for {c.title}, PDF, opens in a new tab</span>
            <span className="num text-xs text-muted" aria-hidden="true">
              PDF
            </span>
          </a>
        )}
      </div>
    </li>
  )
}

export function Credentials({ lens }: { lens: Lens }) {
  const [showAll, setShowAll] = useState(false)
  const ordered = lens === 'all' ? groupOrder : [...groupOrder].sort((a, b) => Number(certGroupTracks[b].includes(lens as never)) - Number(certGroupTracks[a].includes(lens as never)))
  const visibleGroups = showAll ? ordered : ordered.slice(0, 2)
  return (
    <section id="credentials" aria-labelledby="cred-title" className="border-t border-line bg-paper-2/50">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHead id="cred-title" eyebrow="Education & credentials" title="Where I trained." />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((e) => (
            <div key={e.school} className="reveal rounded-2xl border border-line bg-card p-6">
              <p className="num text-xs text-muted">{e.period}</p>
              <h3 className="display mt-2 text-xl leading-snug font-medium">{e.school}</h3>
              <p className="mt-1 text-muted">{e.degree}</p>
              {e.fileKey && certAssets[e.fileKey] && (
                <a href={asset(certAssets[e.fileKey].pdf)} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex min-h-11 items-center text-sm">
                  View certificate<span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-12">
          {visibleGroups.map((g) => {
            const list = certs.filter((c) => c.group === g)
            return (
              <div key={g} className="reveal">
                <h3 className="eyebrow mb-1 flex items-center gap-3">
                  {g} <span className="num text-muted">({list.length})</span>
                </h3>
                <ul className="border-t border-line">
                  {list.map((c) => (
                    <CertRow key={c.title} c={c} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          aria-expanded={showAll}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/80 px-5 text-sm font-medium hover:bg-ink hover:text-paper"
        >
          {showAll ? 'Show fewer' : `Show all ${certs.length} certifications`}
        </button>
      </div>
    </section>
  )
}

/* ---------- Contact ---------- */

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <p className="eyebrow reveal">Contact</p>
      <h2 id="contact-title" className="display reveal mt-5 max-w-4xl text-[2.6rem] leading-[1] font-medium sm:text-7xl">
        Let&rsquo;s build something people <span className="text-accent italic">actually use</span>.
      </h2>
      <div className="reveal mt-10 flex flex-wrap items-center gap-3">
        <ButtonLink href={`mailto:${profile.email}`} icon="mail">
          {profile.email}
        </ButtonLink>
        <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-paper-2 hover:text-ink">
          <Icon name={copied ? 'check' : 'arrowUp'} /> <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
        </button>
        <ButtonLink href={profile.linkedin} variant="ghost" external icon="linkedin">
          LinkedIn
        </ButtonLink>
        {profile.github && (
          <ButtonLink href={profile.github} variant="ghost" external icon="github">
            GitHub
          </ButtonLink>
        )}
      </div>

      <div className="reveal mt-16 rounded-2xl border border-line bg-card p-6">
        <h3 className="eyebrow">Resume, tailored by role</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {allResumes.map((r) => {
            const f = resumeAssets[r.key]
            return (
              <li key={r.key}>
                <a
                  href={asset(f.pdf)}
                  download={`Aryan-Rai-Resume-${r.label.replace(/[^A-Za-z]+/g, '-')}.pdf`}
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm hover:border-ink"
                >
                  <span>
                    {r.label}
                    <span className="num block text-xs text-muted">PDF · {fmtSize(f.kb)}</span>
                  </span>
                  <Icon name="download" className="size-4 shrink-0 text-muted group-hover:text-ink" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Aryan Rai · Bengaluru</p>
        <p>
          <a href="#top" className="hover:text-ink">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  )
}
