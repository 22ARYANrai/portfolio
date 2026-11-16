import { useState } from 'react'
import { about, impact, profile, resumeForLens } from '../data/content'
import type { Lens } from '../data/types'
import { asset, resumeAssets } from '../lib/hooks'
import { ButtonLink, Icon } from './ui'

const links = [
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Skills', '#skills'],
  ['Credentials', '#credentials'],
  ['Contact', '#contact'],
] as const

export function Nav({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="display text-lg font-semibold tracking-tight">
          Aryan Rai<span className="text-accent">.</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="text-muted transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="size-[18px]" />
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </nav>
      {open && (
        <ul id="mobile-menu" className="border-t border-line px-4 pt-2 pb-4 md:hidden">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="display block py-2.5 text-2xl">
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export function Hero({ lens }: { lens: Lens }) {
  const r = resumeForLens[lens]
  const file = resumeAssets[r.key]
  return (
    <section id="top" aria-labelledby="hero-name" className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24">
      <div className="grid items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow reveal">Portfolio · {profile.location}</p>
          <h1 id="hero-name" className="display reveal mt-5 text-[3.4rem] leading-[0.92] font-medium sm:text-7xl lg:text-[6.5rem]">
            Aryan Rai
          </h1>
          <p className="display reveal mt-6 max-w-xl text-2xl leading-snug font-light text-ink sm:text-[1.9rem]">
            AI product builder: <em className="text-accent not-italic">product, data</em> and <em className="text-accent not-italic">forward-deployed engineering</em>.
          </p>
          <p className="reveal mt-4 text-muted">{profile.sub}</p>
          <div className="reveal mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="#work" icon="arrow">
              View work
            </ButtonLink>
            <ButtonLink href={asset(file.pdf)} variant="ghost" download="Aryan-Rai-Resume.pdf" icon="download">
              Download resume
            </ButtonLink>
          </div>
          <p className="reveal mt-2 text-xs text-muted">
            {r.label}. Other versions are in <a href="#contact" className="link">Contact</a>.
          </p>
          <ul className="reveal mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Profiles">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
                <Icon name="linkedin" /> LinkedIn<span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
                <Icon name="mail" /> {profile.email}
              </a>
            </li>
            {profile.github && (
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
                  <Icon name="github" /> GitHub<span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="reveal md:col-span-5">
          <figure className="relative mx-auto max-w-sm md:ml-auto">
            <div className="relative mr-3 md:mr-0">
            <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-[24px] border border-accent/70" />
            <picture className="relative block">
              <source srcSet={`${asset('assets/img/aryan-rai-480.webp')} 480w, ${asset('assets/img/aryan-rai.webp')} 960w`} sizes="(min-width: 768px) 384px, 90vw" type="image/webp" />
              <img
                src={asset('assets/img/aryan-rai.jpg')}
                alt="Portrait of Aryan Rai in a navy suit and blue-framed glasses"
                width={960}
                height={960}
                fetchPriority="high"
                className="aspect-square w-full rounded-[24px] object-cover shadow-[var(--shadow)]"
              />
            </picture>
            </div>
            <figcaption className="mt-5 flex items-start gap-2 text-sm text-muted">
              <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              Open to AI product, analytics, strategy and forward-deployed engineering roles.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

export function Impact() {
  return (
    <section aria-label="Impact highlights" className="border-y border-line bg-paper-2">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {impact.map((m, i) => (
          <div key={m.value} className="reveal bg-paper-2 px-4 py-8 sm:px-6" style={{ transitionDelay: `${i * 70}ms` }}>
            <dt className="sr-only">{m.label}</dt>
            <dd>
              <span className="num block text-4xl font-medium tracking-tight text-ink sm:text-5xl">{m.value}</span>
              <span className="mt-2 block text-sm leading-snug text-ink">{m.label}</span>
              <span className="mt-1 block text-xs text-muted">{m.context}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function About() {
  return (
    <section aria-labelledby="about-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 id="about-title" className="eyebrow reveal md:col-span-3 md:pt-2">
          About
        </h2>
        <p className="display reveal text-[1.45rem] leading-[1.45] font-light md:col-span-9 md:text-[1.75rem]">{about}</p>
      </div>
    </section>
  )
}
