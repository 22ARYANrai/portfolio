import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  built,
  certs,
  education,
  experience,
  heroChips,
  heroWords,
  howIWork,
  leadership,
  marqueeStack,
  marqueeTopics,
  nowStats,
  playUpdated,
  playLinks,
  profile,
  projects,
  ringText,
  skills,
} from '../data/content'
import type { Cert, Project } from '../data/types'
import { asset, certAssets, fmtSize, openCase, RESUME_URL, useResume, workAssets } from '../lib/hooks'
import { Icon, type IconName } from './ui'
import { FaceSwitch, HoodView, StageBadge, StatusSticker } from './V2'
import recsJson from '../data/recommendations.json'
import logoJson from '../data/logos.json'

const recs: { name: string; role: string; relation: string; text: string }[] = recsJson

const pad = (n: number) => String(n).padStart(2, '0')

/* ---------- Shared bits ---------- */

function Pill({
  href,
  children,
  solid,
  download,
  onClick,
  external,
}: {
  href: string
  children: ReactNode
  solid?: boolean
  download?: string
  onClick?: (e: React.MouseEvent) => void
  external?: boolean
}) {
  return (
    <a
      href={href}
      download={download}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[0.95rem] font-bold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
        solid ? 'btn-solid bg-acc text-on-accent shadow-[0_10px_30px_-10px_var(--acc)]' : 'btn-ghost border border-line bg-paper-2/60 text-ink hover:border-acc'
      }`}
    >
      {children}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}

function Chip({ children, mono }: { children: ReactNode; mono?: boolean }) {
  return (
    <span className={`tag inline-flex items-center rounded-full border border-line px-3 py-1 ${mono ? 'num text-[0.72rem] text-muted' : 'text-[0.8rem] font-semibold'}`}>
      {children}
    </span>
  )
}

function SectionTitle({ n, plain, color, id }: { n?: string; plain: string; color: string; id: string }) {
  return (
    <header className="reveal relative isolate mb-8 sm:mb-12">
      {n && (
        <span aria-hidden="true" className="sec-num display pointer-events-none absolute -top-6 right-0 -z-10 text-[7rem] leading-none sm:-top-10 sm:text-[11rem] lg:text-[13rem]">
          {n}
        </span>
      )}
      <p className="kicker eyebrow !text-acc">{n ? `${n} · Section` : color}</p>
      <h2 id={id} className="display mt-3 text-[2.6rem] leading-[0.95] uppercase sm:text-6xl lg:text-7xl">
        {plain} <span className="text-acc">{color}</span>
      </h2>
    </header>
  )
}

function Marquee({ items, sep, className, reverse, speed }: { items: string[]; sep: string; className: string; reverse?: boolean; speed?: string }) {
  const row = (
    <>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-8 pr-8">
          <span>{t}</span>
          <span aria-hidden="true">{sep}</span>
        </span>
      ))}
    </>
  )
  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div className={`marquee ${reverse ? 'rev' : ''}`} style={{ ['--speed' as string]: speed }}>
        {row}
        {row}
      </div>
    </div>
  )
}

// Organisation logo (favicon saved by scripts/logos.mjs); initials when there is none.
const LOGOS: Record<string, string> = logoJson
function Logo({ name, className = 'size-11' }: { name: string; className?: string }) {
  const d = LOGOS[name] ?? LOGOS[name.split(' · ')[0]]
  const [bad, setBad] = useState(false)
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line ${d && !bad ? 'bg-white' : 'bg-acc text-on-accent'} ${className}`}>
      {d && !bad ? <img src={asset(`assets/logos/${d}.png`)} alt="" loading="lazy" onError={() => setBad(true)} className="size-[68%] object-contain" /> : <span className="text-[0.8em] font-bold">{initials}</span>}
    </span>
  )
}

/* ---------- Nav ---------- */

const NAV = [
  ['Work', '#building'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
]

export function Nav({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const menu = useRef<HTMLDialogElement>(null)
  const resume = useResume()
  const close = () => menu.current?.close()
  const item = 'block border-b border-line py-4 text-2xl font-bold hover:text-acc'
  // Scroll-spy: whichever section crosses the middle of the screen is "current".
  const [here, setHere] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setHere('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('main > section[id], main > div[id], footer[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return (
    <header className="no-print fixed inset-x-0 top-3 z-40 px-3">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-line bg-paper/75 pr-2 pl-5 backdrop-blur-md">
        <a href="#top" className="serif-i text-xl">
          Aryan Rai
        </a>
        <div className="flex items-center gap-1 text-sm font-semibold">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} aria-current={here === h ? 'location' : undefined} className="nav-link hidden rounded-full px-3 py-2 text-muted hover:text-ink md:inline">
              {l}
            </a>
          ))}
          <button
            type="button"
            onClick={() => menu.current?.showModal()}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="grid size-10 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink md:hidden"
          >
            <Icon name="menu" className="size-5" />
          </button>
          <dialog ref={menu} aria-label="Menu" className="side-menu acc-coral" onClick={(e) => e.target === menu.current && close()}>
            <div className="flex h-full flex-col px-6 pt-5 pb-8">
              <button type="button" onClick={close} aria-label="Close menu" className="grid size-10 place-items-center self-end rounded-full text-muted hover:bg-paper-2 hover:text-ink">
                <Icon name="close" className="size-5" />
              </button>
              <ul className="mt-6">
                {[...NAV, ['Contact', '#contact']].map(([l, h], i) => (
                  <li key={h} style={{ ['--i' as string]: i }}>
                    <a
                      href={h}
                      onClick={(e) => {
                        close()
                        // Contact is the last section: land at the very bottom so nothing is cut off
                        if (h === '#contact') (e.preventDefault(), window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }))
                      }}
                      aria-current={here === h ? 'location' : undefined} className={`${item} ${here === h ? 'text-acc' : ''}`}>
                      {here === h && <span aria-hidden="true">● </span>}
                      {l}
                    </a>
                  </li>
                ))}
                {resume && <li style={{ ['--i' as string]: 5 }}>
                  <a href={RESUME_URL} download="Aryan-Rai-Resume.pdf" onClick={close} className={item}>
                    Resume <Icon name="download" className="inline size-5 text-acc" />
                  </a>
                </li>}
                <li style={{ ['--i' as string]: 6 }}>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={close} className={item}>
                    LinkedIn <Icon name="external" className="inline size-5 text-acc" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
          </dialog>
          {resume && (
            <a href={RESUME_URL} download="Aryan-Rai-Resume.pdf" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink md:inline">
              Resume
            </a>
          )}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="theme-btn grid size-10 place-items-center"
          >
            <Icon key={theme} name={theme === 'dark' ? 'sun' : 'moon'} className="theme-icon size-[18px]" />
          </button>
        </div>
      </nav>
    </header>
  )
}

/* ---------- Hero ---------- */

export function Hero() {
  const resume = useResume()
  return (
    <section id="top" aria-labelledby="hero-name" className="acc-coral relative isolate grid min-h-svh grid-cols-[minmax(0,1fr)] grid-rows-[minmax(6rem,1fr)_auto_auto] overflow-hidden pt-[4.75rem] pb-3 sm:pt-24 lg:flex lg:flex-col lg:pt-20 lg:pb-4">
      <div aria-hidden="true" className="smoke absolute -inset-20 -z-10" />
      <div className="contents lg:mx-auto lg:my-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-[1.4fr_1fr] lg:items-center xl:grid-cols-[1.1fr_1fr] lg:gap-14 lg:px-8">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between">
            <p className="eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-acc" aria-hidden="true" /> Hello, I&rsquo;m
            </p>
            {/* Phone: social links ride on the greeting line so the hero fits one screen */}
            <div className="flex gap-2.5 lg:hidden">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="social-btn grid size-11 place-items-center">
                <Icon name="linkedin" className="size-5" />
              </a>
              <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className="social-btn grid size-11 place-items-center">
                <Icon name="mail" className="size-5" />
              </a>
              {resume && (
                <a href={RESUME_URL} download="Aryan-Rai-Resume.pdf" aria-label="Download resume (PDF)" className="social-btn grid size-11 place-items-center">
                  <Icon name="download" className="size-5" />
                </a>
              )}
            </div>
          </div>
          <h1 id="hero-name" aria-label="Aryan Rai" className="display mt-3 text-[2.9rem] leading-[0.86] font-black uppercase max-[380px]:text-[2.5rem] sm:mt-4 sm:text-[7rem] lg:text-[min(8.5rem,15svh)]">
            <SplitWord word="Aryan" className="hn-solid" start={0} />
            <SplitWord word="Rai" className="hn-outline outline-text" start={5} />
          </h1>
          <p style={{ ['--d' as string]: 1 }} className="load-in mt-3 text-xl font-bold max-[380px]:mt-2 sm:mt-5 sm:text-3xl lg:mt-4">
            I build{' '}
            <span className="sr-only">{heroWords.join(', ')}</span>
            <span aria-hidden="true" className="rotator serif-i text-acc">
              {heroWords.map((w, i) => (
                <span key={w} style={{ ['--i' as string]: i, ['--n' as string]: `${heroWords.length * 2.2}s` }}>
                  {w}
                </span>
              ))}
            </span>
          </p>
          <p style={{ ['--d' as string]: 2 }} className="hero-ship load-in mt-2 max-w-lg text-lg leading-snug font-bold">
            I ship <mark className="v2-mark">0→1 AI products</mark> that move retention and revenue.
          </p>
          <p style={{ ['--d' as string]: 2 }} className="load-in mt-2 max-w-lg text-[0.9rem] leading-relaxed text-muted max-[380px]:text-[0.85rem] max-[380px]:leading-normal sm:mt-4 sm:text-base lg:mt-3">
            Graduate Management Trainee in FDE &amp; AI Operations at <strong className="text-ink">Kuku</strong>. I build{' '}
            <strong className="text-ink">Kuku AI Coach</strong>, an AI spoken-English tutor for Hindi speakers, and work on{' '}<strong className="text-ink">Dicta</strong>, which turns Hinglish speech into clear English.
          </p>
          <ul style={{ ['--d' as string]: 3 }} tabIndex={0} className="load-in hero-chips no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:mt-4 sm:flex-wrap sm:overflow-visible sm:px-0" aria-label="Highlights">
            {heroChips.map((c) => (
              <li key={c} className="shrink-0 whitespace-nowrap">
                <Chip>{c}</Chip>
              </li>
            ))}
          </ul>
          <div style={{ ['--d' as string]: 4 }} className="load-in mt-4 flex flex-wrap items-center gap-3 sm:mt-6 lg:mt-5">
            <Pill href="#building" solid>
              See what I&rsquo;m building <Icon name="arrow" />
            </Pill>
            {resume && (
              <Pill href={RESUME_URL} download="Aryan-Rai-Resume.pdf">
                Resume
              </Pill>
            )}
            <div className="ml-1 hidden items-center gap-3 lg:flex">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="social-btn grid size-12 place-items-center">
              <Icon name="linkedin" className="size-6" />
            </a>
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="grid size-12 place-items-center rounded-full hover:bg-paper-2">
                <Icon name="github" className="size-6" />
              </a>
            )}
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className="social-btn grid size-12 place-items-center">
              <Icon name="mail" className="size-6" />
            </a>
            </div>
          </div>
        </div>

        <div style={{ ['--d' as string]: 0 }} className="load-in load-pop order-first flex min-h-0 items-center justify-center px-5 pb-3 lg:order-none lg:block lg:p-0">
        <div className="relative aspect-square h-full max-h-[min(26rem,84vw)] lg:mx-auto lg:h-auto lg:max-h-none lg:w-full lg:max-w-[min(34rem,64svh)]">
          <StatusSticker />
          <svg viewBox="0 0 400 400" className="spin absolute inset-0 size-full text-acc" aria-hidden="true">
            <defs>
              <path id="ring" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
            </defs>
            <text className="num" fontSize="19" fill="currentColor">
              <textPath href="#ring" textLength="1100" lengthAdjust="spacing">{ringText}</textPath>
            </text>
          </svg>
          <picture>
            <source srcSet={`${asset('assets/img/aryan-rai-480.webp')} 480w, ${asset('assets/img/aryan-rai.webp')} 960w`} sizes="(min-width: 1024px) 320px, 70vw" type="image/webp" />
            <img
              src={asset('assets/img/aryan-rai.jpg')}
              alt="Portrait of Aryan Rai in a navy suit and blue-framed glasses"
              width={960}
              height={960}
              fetchPriority="high"
              className="absolute inset-[12%] size-[76%] lg:inset-[15%] lg:size-[70%] rounded-full border-4 border-acc/40 object-cover shadow-[0_0_80px_-20px_var(--acc)]"
            />
          </picture>
        </div>
        </div>
      </div>
      <a href="#building" style={{ ['--d' as string]: 6 }} className="load-in eyebrow mx-auto mt-3 flex w-fit items-center gap-3 !text-[0.65rem] hover:!text-ink">
        Scroll to explore
        <span aria-hidden="true" className="relative flex h-9 w-6 justify-center rounded-full border-2 border-acc/70 pt-2">
          <span className="scroll-wheel h-2 w-1 rounded-full bg-acc" />
        </span>
        <span aria-hidden="true" className="scroll-chevs -mt-1 hidden flex-col items-center text-acc lg:flex">
          {[0, 1, 2].map((i) => (
            <svg key={i} viewBox="0 0 12 6" className="scroll-chev -mt-0.5 h-1.5 w-3" style={{ ['--i' as string]: i }}>
              <path d="M1 1l5 4 5-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ))}
        </span>
      </a>
    </section>
  )
}

/** Counts "50K+", "4.3★", "250+" up from 0 the first time it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const m = value.match(/^([\d.]+)(.*)$/)
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const el = ref.current
    if (!m || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const end = parseFloat(m[1])
    const dp = m[1].split('.')[1]?.length ?? 0
    const fmt = (n: number) => n.toFixed(dp) + m[2]
    setShown(fmt(0))
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 1400)
          setShown(fmt(end * (1 - Math.pow(1 - k, 3)))) // ease-out
          if (k < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {shown}
      </span>
    </span>
  )
}

/** One line of the hero name, split into masked letters (CSS does the motion). */
function SplitWord({ word, className, start }: { word: string; className: string; start: number }) {
  const jelly = (e: React.SyntheticEvent<HTMLSpanElement>) => e.currentTarget.classList.add('jelly')
  return (
    <span aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {[...word].map((c, i) => (
        <span key={i} className="hn-mask" onMouseEnter={jelly} onTouchStart={jelly} onAnimationEnd={(e) => e.animationName === 'hnJelly' && e.currentTarget.classList.remove('jelly')}>
          <span className="hn-l" data-c={c} style={{ ['--i' as string]: start + i }}>
            {c}
          </span>
        </span>
      ))}
    </span>
  )
}

export function Bands() {
  return (
    <div className="acc-coral relative overflow-hidden py-10 sm:py-16">
      <Marquee
        items={marqueeTopics.map((t) => t.toUpperCase())}
        sep="✦"
        className="-mx-4 -rotate-2 bg-acc py-4 text-2xl font-black text-on-accent sm:text-4xl"
      />
      <Marquee
        items={marqueeStack.map((t) => t.toUpperCase())}
        sep="+"
        reverse
        speed="55s"
        className="-mx-4 mt-3 rotate-1 border-y border-line bg-paper-2 py-3 text-xl font-black text-acc sm:text-3xl"
      />
    </div>
  )
}

/* ---------- 01 Now building ---------- */

/** Real Play Store screenshots, fanned; cycles every 3.2 s (paused for reduced motion). */
function ScreenFan({ slug, name, play }: { slug: string; name: string; play: string }) {
  const a = workAssets[slug]
  const n = a.slides.length
  const [k, setK] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setK((x) => (x + 1) % n), 3200)
    return () => clearInterval(t)
  }, [n])
  return (
    <figure className="mx-auto w-full max-w-[26rem] overflow-x-clip lg:overflow-x-visible">
      <div className="relative mx-auto aspect-[9/16] w-[72%]">
        <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-acc/30 blur-3xl" />
        {a.slides.map((sl, i) => {
          const d = (i - k + n) % n
          const pos =
            d === 0
              ? 'z-20 scale-100 opacity-100'
              : d === 1
                ? 'z-10 translate-x-[40%] rotate-6 scale-[0.85] opacity-55'
                : d === n - 1
                  ? 'z-10 -translate-x-[40%] -rotate-6 scale-[0.85] opacity-55'
                  : 'z-0 scale-75 opacity-0'
          return (
            <img
              key={sl.src}
              src={asset(sl.src)}
              alt={d === 0 ? `${name} on Google Play, screen ${i + 1} of ${n}` : ''}
              aria-hidden={d !== 0}
              loading="lazy"
              className={`absolute inset-0 size-full rounded-[1.6rem] border border-line object-cover shadow-[var(--shadow)] transition-all duration-700 ease-out ${pos}`}
            />
          )
        })}
      </div>
      <figcaption className="mt-7 flex items-center justify-center gap-3">
        <img src={asset(a.icon!)} alt="" className="size-10 rounded-xl" />
        <a
          href={play}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost inline-flex min-h-11 items-center gap-2 rounded-full border border-acc/60 px-4 text-sm font-bold text-acc hover:bg-acc hover:text-on-accent"
        >
          <Icon name="external" /> Get it on Google Play<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  )
}

function Spotlight({
  eyebrow,
  period,
  name,
  headline,
  children,
  chips,
  cta,
  mock,
  flip,
}: {
  eyebrow: string
  period: string
  name: string
  headline: ReactNode
  children: ReactNode
  chips: string[]
  cta: ReactNode
  mock: ReactNode
  flip?: boolean
}) {
  return (
    <article className="mt-6">
      <p className="eyebrow flex items-center gap-2 !text-acc">
        <span className="size-1.5 rounded-full bg-acc" aria-hidden="true" /> {eyebrow}
      </p>
      <p className="num mt-1 text-xs text-muted">{period}</p>
      <h3 className="display glow-text mt-4 text-[3.4rem] leading-[0.9] font-black text-acc uppercase sm:text-8xl">{name}</h3>
      <div className={`mt-10 grid items-center gap-12 lg:mt-8 lg:items-start lg:grid-cols-[1.25fr_1fr] ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <p className="text-2xl leading-snug font-bold sm:text-3xl">{headline}</p>
          {children}
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Highlights">
            {chips.map((c) => (
              <li key={c}>
                <Chip>{c}</Chip>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">{cta}</div>
        </div>
        {mock}
      </div>
    </article>
  )
}

// Decorative mirror of the card list (aria-hidden): hover an icon to preview it, click to jump to its card,
// and the whole ring tilts toward the cursor.
function Orbit({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const n = built.length
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? active
  const b = built[shown]
  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -14}deg`)
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`)
  }
  return (
    <div
      className={`orbit relative mx-auto aspect-square w-full max-w-[24rem] ${b.app === 'Dicta' ? 'acc-dicta' : ''}`}
      aria-hidden="true"
      onMouseMove={tilt}
      onMouseLeave={(e) => (e.currentTarget.style.setProperty('--rx', '0deg'), e.currentTarget.style.setProperty('--ry', '0deg'))}
    >
      <div className="orbit-glow absolute inset-[18%] rounded-full shadow-[inset_0_0_80px_-30px_var(--acc)]" />
      <div className="orbit-sweep absolute inset-[18%] rounded-full" />
      <div className="orbit-dash absolute inset-[18%] rounded-full border border-dashed border-acc/40" />
      <div className="absolute inset-[6%] rounded-full border border-line" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--acc)" strokeWidth="0.6" strokeLinecap="round" pathLength={n} strokeDasharray={`${active + 1} ${n}`} className="transition-[stroke-dasharray] duration-700" />
      </svg>
      <div className="orbit-fast absolute inset-0">
        <span className="absolute top-[6%] left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acc shadow-[0_0_14px_3px_var(--acc)]" />
      </div>
      <div className="orbit-spin absolute inset-0">
        {built.map((x, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2
          const on = i === active
          return (
            <span key={x.title} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + 44 * Math.cos(a)}%`, top: `${50 + 44 * Math.sin(a)}%` }}>
              <span className="orbit-icon relative block">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => onPick(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className={`relative grid cursor-pointer place-items-center rounded-full border transition-all duration-300 hover:scale-125 hover:border-acc hover:text-acc ${
                    on ? 'size-16 border-acc bg-acc text-on-accent shadow-[0_0_40px_-5px_var(--acc)] hover:text-on-accent' : 'size-11 border-line bg-card text-muted'
                  }`}
                >
                  {on && <span className="absolute inset-0 animate-ping rounded-full bg-acc/40" />}
                  <Icon name={x.icon as IconName} className={`relative ${on ? 'size-6' : 'size-4'}`} />
                </button>
              </span>
            </span>
          )
        })}
      </div>
      <div key={shown} className="orbit-title pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="num text-xs tracking-widest text-acc">
            {pad(shown + 1)} / {pad(n)} · {b.app}
          </p>
          <p className="display mt-1 max-w-[11rem] text-2xl leading-tight uppercase">{b.title}</p>
          <p className="num mt-2 text-[0.6rem] tracking-widest text-muted uppercase">{hover === null ? 'Hover · click an icon' : 'Click to open'}</p>
        </div>
      </div>
    </div>
  )
}

export function NowBuilding() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])
  const caseLink = (slug: string, label: string) => (
    <Pill href={`#/work/${slug}`} onClick={(e) => (e.preventDefault(), openCase(slug))}>
      {label}
    </Pill>
  )

  return (
    <section id="building" aria-labelledby="building-title" className="acc-coach mx-auto max-w-7xl overflow-x-clip px-5 py-14 sm:px-8 sm:py-20">
      <SectionTitle n="01" plain="Now" color="Building" id="building-title" />
      <p className="max-w-2xl text-muted">
        Two AI products at <strong className="text-ink">Kuku</strong>, where I&rsquo;m a Graduate Management Trainee in FDE &amp; AI Operations (Aug 2026 – present, Bengaluru).
      </p>

      <Spotlight
        eyebrow="Product 01 · AI English tutor"
        period="Aug 2026 – present · Web + Android"
        name="Kuku AI Coach"
        headline={
          <>
            An AI spoken-English tutor for Hindi speakers. <span className="serif-i text-acc">One product</span> across web and Android.
          </>
        }
        chips={['Web', 'Android', 'Voice calls', 'Placement', 'Subscriptions']}
        cta={
          <>
            <Pill href="#built" solid>
              How I built it <Icon name="arrow" className="size-4 rotate-90" />
            </Pill>
            {caseLink('kuku-ai-coach', 'Case study')}
          </>
        }
        mock={<ScreenFan slug="kuku-ai-coach" name="Kuku AI Coach" play={playLinks.coach} />}
      >
        <p className="mt-5 leading-relaxed text-muted">
          Learners are placed at the right level, start with a free first lesson, then practise in conversation with an AI tutor and on voice calls. It has{' '}
          <strong className="text-ink">{nowStats[0].value} downloads on Google Play</strong>.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          I work across the product: lessons and prompts, voice practice, learner flows, billing, analytics, and the quality and safety work that keeps the tutor good and affordable.
        </p>
      </Spotlight>

      <div className="acc-dicta mt-28">
        <Spotlight
          flip
          eyebrow="Product 02 · Voice to English"
          period="Nov 2026 – present · Android"
          name="Dicta"
          headline={
            <>
              Speak Hindi or Hinglish over <span className="serif-i text-acc">any app</span>. Get clear English back.
            </>
          }
          chips={['Floating bubble', '5 tones', 'Copy & paste', 'Privacy-first']}
          cta={
            <>
              <Pill href="#built-dicta" solid>
                What I shipped <Icon name="arrow" className="size-4 rotate-90" />
              </Pill>
              {caseLink('dicta', 'Case study')}
            </>
          }
          mock={<ScreenFan slug="dicta" name="Dicta" play={playLinks.dicta} />}
        >
          <p className="mt-5 leading-relaxed text-muted">
            Tap a floating bubble over any app, speak the way you think, and get polished English in the tone you pick: casual, semi-formal, formal, Hinglish or Hindi. You copy it and
            paste it yourself. It never reads other apps and doesn&rsquo;t keep your audio.
          </p>
          <p className="mt-4 leading-relaxed text-muted">I worked on the Premium paywall, the home and profile screens, and the quality of the tone rewrites.</p>
        </Spotlight>
      </div>

      <h3 className="kicker eyebrow mt-24 !text-acc">By the numbers</h3>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {nowStats.map((s, i) => (
          <div key={s.label} className={`stat-card reveal ${i === nowStats.length - 1 ? 'col-span-2 sm:col-span-1' : ''} flex flex-col-reverse justify-end rounded-2xl border border-line bg-card p-5 ${s.label.includes('Dicta') ? 'acc-dicta' : ''}`}>
            <dt className="num mt-2 text-[0.68rem] tracking-[0.12em] text-muted uppercase">{s.label}</dt>
            <dd className="display text-4xl text-acc">
              <CountUp value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="num mt-3 flex items-center gap-2 text-[0.7rem] text-muted">
        <span className="size-1.5 animate-pulse rounded-full bg-acc" aria-hidden="true" /> Play Store figures refresh automatically from Google Play · last updated {playUpdated}
      </p>

      <h3 id="built" className="kicker eyebrow mt-24 !text-acc">
        What I built
      </h3>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-32">
            <Orbit active={active} onPick={(i) => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
          </div>
        </div>
        <ol className="space-y-6">
          {built.map((b, i) => {
            const on = i === active
            const firstDicta = b.app === 'Dicta' && built.findIndex((x) => x.app === 'Dicta') === i
            return (
              <li
                key={b.title}
                id={firstDicta ? 'built-dicta' : undefined}
                ref={(el) => {
                  refs.current[i] = el
                }}
                data-i={i}
                style={{ ['--r' as string]: i % 2 ? '4deg' : '-4deg' }}
                className={`built-card ${b.app === 'Dicta' ? 'acc-dicta' : ''} rounded-3xl border bg-card p-6 transition-[border-color,box-shadow] duration-300 sm:p-7 ${on ? 'border-acc shadow-[0_0_60px_-30px_var(--acc)]' : 'border-line'}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${on ? 'bg-acc text-on-accent' : 'bg-paper-2 text-acc'}`}>
                    <Icon name={b.icon as IconName} className="size-5" />
                  </span>
                  <div>
                    <p className="num text-[0.68rem] tracking-[0.14em] text-acc uppercase">
                      {pad(i + 1)} / {pad(built.length)} · {b.app} · {b.tag}
                    </p>
                    <h4 className="display mt-1 text-2xl sm:text-3xl">{b.title}</h4>
                  </div>
                </div>
                <p className="serif-i mt-3 text-muted">{b.sub}</p>
                <ul className="mt-4 space-y-2.5">
                  {b.points.map(([t, s]) => (
                    <li key={t} className="grid grid-cols-[1.25rem_1fr]">
                      <span className="mt-2.5 h-0.5 w-2.5 bg-acc" aria-hidden="true" />
                      <span>
                        <span className="font-bold">{t}</span>
                        {s && <span className="block text-sm text-muted">{s}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools">
                  {b.tools.map((t) => (
                    <li key={t}>
                      <Chip mono>{t}</Chip>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export function StackBand() {
  return (
    <Marquee
      items={marqueeStack.map((t) => t.toUpperCase())}
      sep="◆"
      speed="50s"
      className="acc-coach stack-band border-y-4 border-ink bg-ink py-5 text-2xl font-black text-paper sm:text-3xl [&_[aria-hidden]]:text-[var(--pop)]"
    />
  )
}

/* ---------- 02 Experience ---------- */

// **keyword** in content → bold; numbers (50K+, 4×, 12–15%) are bolded automatically.
const NUM = /(\d[\d,.]*(?:[–-]\d[\d,.]*)?(?:K\+|%|\+|×)?)/
export function Rich({ text }: { text: string }) {
  return text.split('**').map((seg, i) =>
    i % 2 ? (
      <strong key={i} className="font-bold text-ink">
        {seg}
      </strong>
    ) : (
      seg.split(NUM).map((s, j) =>
        j % 2 ? (
          <strong key={`${i}-${j}`} className="font-bold text-ink">
            {s}
          </strong>
        ) : (
          s
        ),
      )
    ),
  )
}

export function Experience() {
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const spark = useRef<HTMLSpanElement>(null)

  // Scroll drives the spine: fill grows to a line 60% down the viewport; nodes above it light up.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const ol = list.current
      if (!ol || !fill.current || !spark.current) return
      const r = ol.getBoundingClientRect()
      const line = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height))
      fill.current.style.transform = `scaleY(${p})`
      spark.current.style.transform = `translate(-50%, ${p * r.height}px)`
      spark.current.style.opacity = p > 0 && p < 1 ? '1' : '0'
      ol.querySelectorAll<HTMLElement>(':scope > li').forEach((li) => {
        const node = li.querySelector<HTMLElement>('.xp-node')!.getBoundingClientRect()
        li.toggleAttribute('data-lit', node.top + node.height / 2 < line)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="experience" aria-labelledby="exp-title" className="acc-gold mx-auto max-w-7xl overflow-x-clip px-5 py-16 sm:px-8 sm:py-24">
      <SectionTitle n="02" plain="Work" color="Experience" id="exp-title" />
      <ol ref={list} className="relative flex flex-col gap-12 lg:gap-10 lg:[&>li+li]:-mt-32">
        <span aria-hidden="true" className="absolute top-8 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 rounded bg-gradient-to-b from-line from-80% to-transparent lg:block">
          <span ref={fill} className="xp-fill absolute inset-0 rounded" />
          <span ref={spark} className="xp-spark absolute top-[-5px] left-1/2 size-2.5 rounded-full bg-ink opacity-0 transition-opacity" />
        </span>
        {experience.map((r, i) => {
          const right = i % 2 === 1
          const last = i === experience.length - 1
          const cert = r.org === 'NextLeap' ? certAssets['nextleap-pm-fellowship'] : undefined
          // Phone: a zigzag. Even cards sit right (line on the left), odd cards sit left (line on the right);
          // a horizontal rung joins each side's line to the next one.
          return (
            <li key={r.org + r.title} className={`relative grid gap-x-4 lg:grid-cols-[1fr_88px_1fr] lg:gap-x-0 ${right ? 'grid-cols-[1fr_28px]' : 'grid-cols-[28px_1fr]'}`}>
              <span aria-hidden="true" className={`xp-seg absolute w-0.5 -translate-x-1/2 lg:hidden ${right ? 'left-[calc(100%-14px)]' : 'left-[14px]'} ${i ? '-top-6' : 'top-9'} ${last ? 'h-[61px]' : '-bottom-6'}`} />
              {!last && <span aria-hidden="true" className="xp-seg absolute right-[14px] -bottom-6 left-[14px] h-0.5 -translate-y-1/2 lg:hidden" />}
              <span aria-hidden="true" className={`xp-node relative z-10 row-start-1 mt-7 size-[18px] justify-self-center rounded-full border-2 border-line bg-paper lg:col-start-2 ${right ? 'col-start-2' : 'col-start-1'}`} />
              <article
                className={`xp-card ${right ? 'slide-r xp-m-l col-start-1 lg:col-start-3' : 'slide-l xp-m-r col-start-2 lg:col-start-1'} row-start-1 rounded-3xl border border-line bg-card px-6 py-7 shadow-[var(--shadow)] transition-colors duration-500 sm:px-8 sm:py-8`}
              >
                <p className="num flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] text-acc uppercase">
                  {r.period}
                  {i === 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-acc px-2.5 py-0.5 text-[0.62rem] font-bold text-on-accent">
                      <span className="size-1.5 animate-pulse rounded-full bg-on-accent" aria-hidden="true" /> Now
                    </span>
                  )}
                </p>
                <h3 className="display mt-4 flex items-start gap-3 text-[1.7rem] leading-tight sm:items-center sm:text-3xl">
                  <Logo name={r.org} className="size-11 text-base" />
                  {r.org}
                </h3>
                <p className="mt-2 text-base leading-snug font-semibold sm:text-lg">{r.title}</p>
                {r.place && <p className="num mt-1 text-xs tracking-wide text-muted">{r.place}</p>}
                <ul className="mt-6 space-y-3 border-t border-line pt-5">
                  {r.bullets.map((b) => (
                    <li key={b} className="grid grid-cols-[1.25rem_1fr] text-[0.95rem] leading-relaxed text-muted">
                      <span className="mt-3 h-0.5 w-2.5 bg-acc" aria-hidden="true" />
                      <span>
                        <Rich text={b} />
                      </span>
                    </li>
                  ))}
                </ul>
                {(i === 0 || cert) && (
                  <div className="mt-6 flex justify-end">
                    {i === 0 && (
                      <a href="#building" className="num rounded-full border border-acc/60 px-4 py-2 text-xs tracking-widest text-acc uppercase hover:bg-acc hover:text-on-accent">
                        Deep dive ↑
                      </a>
                    )}
                    {cert && (
                      <a
                        href={asset(cert.pdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="num rounded-full border border-acc/60 px-4 py-2 text-xs tracking-widest text-acc uppercase hover:bg-acc hover:text-on-accent"
                      >
                        Certificate ↗<span className="sr-only"> (PDF, opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                )}
              </article>
            </li>
          )
        })}
      </ol>

      <h3 className="kicker eyebrow mt-14 !text-acc sm:mt-20">Leadership</h3>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {leadership.map((l) => (
          <li key={l.org} className="lead-card reveal rounded-3xl border border-line bg-card px-6 py-7 shadow-[var(--shadow)] sm:px-8 sm:py-8">
            <p className="num text-xs tracking-[0.14em] text-acc uppercase">{l.period}</p>
            <h4 className="display mt-4 flex items-center gap-3 text-[1.5rem] leading-tight sm:text-[1.75rem]">
              <Logo name={l.org.split(', ')[0]} className="size-11 text-base" />
              {l.org.split(', ')[0]}
            </h4>
            <p className="mt-2 text-base leading-snug font-semibold sm:text-lg">{l.title}</p>
            <p className="num mt-1 text-xs tracking-wide text-muted">{l.org.split(', ')[1]}</p>
            <p className="mt-6 grid grid-cols-[1.25rem_1fr] border-t border-line pt-5 text-[0.95rem] leading-relaxed text-muted">
              <span className="mt-3 h-0.5 w-2.5 bg-acc" aria-hidden="true" />
              <span>
                <Rich text={l.text} />
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- 03 Projects ---------- */

const open = (slug: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  openCase(slug)
}

function ProjectCard({ p }: { p: Project }) {
  const a = p.evidenceKey ? workAssets[p.evidenceKey] : undefined
  const o = p.outcomes.find((x) => x.value)
  const [hood, setHood] = useState(false)
  return (
    <article className="group flex w-[84vw] max-w-[25rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-acc hover:shadow-[0_24px_60px_-30px_var(--acc)] sm:w-[25rem]">
      <a href={`#/work/${p.slug}`} onClick={open(p.slug)} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/9] overflow-hidden border-b border-line bg-paper-2">
        <span className="absolute top-3 left-3 z-10">
          <StageBadge p={p} />
        </span>
        {a ? (
          <img src={asset(a.thumb)} alt="" loading="lazy" className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid size-full place-items-center p-6 text-center text-muted">{p.title}</div>
        )}
      </a>
      <div className="flex flex-1 flex-col p-5">
        <p className="num text-[0.66rem] tracking-[0.14em] text-acc uppercase">{p.context}</p>
        <h3 className="display mt-2 text-2xl leading-tight">{p.title}</h3>
        <div className="mt-3">
          <FaceSwitch hood={hood} onFlip={() => setHood((h) => !h)} />
        </div>
        {hood ? (
          <HoodView p={p} />
        ) : (
          <>
        <p className="mt-2 text-[0.95rem] leading-snug text-muted">{p.oneLiner}</p>
        {o && (
          <p className="mt-4 flex items-baseline gap-2">
            <span className="display text-3xl whitespace-nowrap text-acc">{o.value}</span>
            <span className="text-xs leading-snug text-muted">
              {o.kind === 'target' ? 'Target: ' : ''}
              {o.label}
            </span>
          </p>
        )}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
          {p.tools.slice(0, 4).map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>
          </>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <a href={`#/work/${p.slug}`} onClick={open(p.slug)} className="btn-solid inline-flex min-h-11 items-center gap-2 rounded-full bg-acc px-4 text-sm font-bold text-on-accent">
            Case study <Icon name="arrow" />
          </a>
          {a?.pdf && (
            <a href={asset(a.pdf)} download className="btn-ghost inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-bold hover:border-acc">
              <Icon name="file" /> Deck · {fmtSize(a.pdfKB)}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const fit = useRef<HTMLDivElement>(null)
  const shift = useRef(0)
  const scale = useRef(1)
  const [pin, setPin] = useState(false)
  const [more, setMore] = useState(false)
  const [at, setAt] = useState(1)
  const cases = projects.filter((p) => p.tier === 'case')
  const rest = projects.filter((p) => p.tier === 'more')
  // p = 0..1 along the row. Same value twice does not re-render, so this is cheap per frame.
  const showAt = (p: number) => setAt(p > 0.92 ? 0 : Math.min(cases.length, Math.floor(p * cases.length) + 1))
  const openMore = () => {
    setMore(true)
    setTimeout(() => document.getElementById('more-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  // Pinned mode: the section sticks and vertical scroll slides the cards sideways
  // (down = left-to-right through the list, up = back). Falls back to a swipeable
  // carousel for reduced motion or very short screens.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    const move = () => {
      raf = 0
      const o = outer.current, t = track.current
      if (!o || !t || !shift.current) return
      const p = Math.min(1, Math.max(0, -o.getBoundingClientRect().top / (shift.current * scale.current)))
      t.style.transform = `translate3d(${-p * shift.current}px,0,0)`
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      showAt(p)
    }
    const measure = () => {
      const o = outer.current, t = track.current, f = fit.current
      if (!o || !t || !f) return
      f.style.cssText = ''
      scale.current = 1
      // Pinned panel needs its content height plus 96px (pt-20 + pb-4). Short screens scale it down to fit;
      // if that would go below 75% (tiny text and buttons), use the swipe carousel instead.
      const cs = getComputedStyle(f)
      const need = f.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) + 96
      const s = Math.min(1, window.innerHeight / need)
      const on = !reduce.matches && s >= 0.75
      setPin(on)
      if (!on) {
        shift.current = 0
        o.style.height = ''
        t.style.transform = ''
        return
      }
      scale.current = s
      f.style.cssText = `transform:scale(${s});transform-origin:0 0;width:${100 / s}vw;margin-top:${(window.innerHeight - need * s) / 2}px`
      shift.current = Math.max(0, t.scrollWidth - window.innerWidth / s)
      o.style.height = `${window.innerHeight + shift.current * s}px`
      move()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(move)
    }
    measure()
    requestAnimationFrame(measure) // re-measure once pinned classes have applied
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    reduce.addEventListener('change', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      reduce.removeEventListener('change', measure)
      cancelAnimationFrame(raf)
    }
  }, [])

  const step = () => ((track.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 380) + 20
  const scroll = (d: number) => (pin ? window.scrollBy({ top: d * step() * scale.current, behavior: 'smooth' }) : track.current?.scrollBy({ left: d * step(), behavior: 'smooth' }))
  // Keyboard users: tabbing to an off-screen card scrolls the page so it slides into view.
  const onFocus = (e: React.FocusEvent) => {
    const card = (e.target as HTMLElement).closest('article')
    const o = outer.current
    if (!pin || !card || !o) return
    const x = Math.min(shift.current, Math.max(0, card.offsetLeft - 32))
    window.scrollTo({ top: o.getBoundingClientRect().top + window.scrollY + x * scale.current })
  }

  const pad = 'px-5 sm:px-8 xl:px-[max(2rem,calc((100vw-80rem)/2+2rem))]'
  return (
    <section id="projects" aria-labelledby="proj-title" className="acc-gold pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle n="03" plain="Featured" color="Projects" id="proj-title" />
      </div>
      <div ref={outer} className="relative -mt-4">
        <div className={pin ? 'sticky top-0 h-svh overflow-hidden' : ''}>
          <div ref={fit} className={pin ? 'pt-20 pb-4' : 'pb-8'}>
            <div
              ref={track}
              role="region"
              aria-label={pin ? 'Featured projects. Scroll down to move through them.' : 'Featured projects, scroll sideways'}
              tabIndex={pin ? undefined : 0}
              onFocusCapture={onFocus}
              onScroll={(e) => {
                const t = e.currentTarget
                if (!pin) showAt(t.scrollLeft / Math.max(1, t.scrollWidth - t.clientWidth))
              }}
              className={pin ? `flex w-max gap-5 will-change-transform ${pad}` : `no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pt-4 pb-4 ${pad} scroll-px-5 sm:scroll-px-8 xl:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))]`}
            >
              {cases.map((p) => (
                <ProjectCard key={p.slug} p={p} />
              ))}
              <article className="flex w-[70vw] max-w-[18rem] shrink-0 snap-start flex-col justify-center gap-4 rounded-2xl border-2 border-dashed border-line p-6 sm:w-[18rem]">
                <p className="display text-5xl text-acc">+{rest.length}</p>
                <p className="display text-xl leading-tight">more projects</p>
                <p className="text-sm text-muted">Then Skills, Education &amp; Contact below.</p>
                <button type="button" onClick={openMore} className="btn-solid mt-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-acc px-4 text-sm font-bold text-on-accent">
                  View all {cases.length + rest.length} <Icon name="arrow" className="size-4 rotate-90" />
                </button>
              </article>
            </div>
            <div className="mx-auto mt-5 w-full max-w-7xl px-5 sm:px-8">
              {pin && (
                <div className="h-0.5 overflow-hidden rounded bg-line" aria-hidden="true">
                  <span ref={bar} className="block h-full origin-left scale-x-0 bg-acc" />
                </div>
              )}
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="num flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] tracking-[0.14em] text-muted uppercase" aria-hidden="true">
                  <span className="text-ink">
                    Project {at || cases.length} / {cases.length + rest.length}
                  </span>
                  <span className="hidden sm:inline">· {pin ? 'keep scrolling' : 'swipe'}</span>
                  <span className="nudge-x text-acc">→</span>
                  <span className="hidden h-3 w-px bg-line sm:mx-1 sm:inline-block" />
                  <span className="basis-full sm:hidden" />
                  <span className={at ? '' : 'text-ink'}>Up next</span> · Skills, Education &amp; Contact
                  <span className="nudge-y text-acc">↓</span>
                </p>
                <div className="hidden shrink-0 gap-2 sm:flex">
                  <button type="button" onClick={() => scroll(-1)} aria-label="Previous projects" className="grid size-12 place-items-center rounded-full border border-line hover:border-acc hover:text-acc">
                    <Icon name="left" className="size-5" />
                  </button>
                  <button type="button" onClick={() => scroll(1)} aria-label="Next projects" className="grid size-12 place-items-center rounded-full border border-line hover:border-acc hover:text-acc">
                    <Icon name="right" className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-24 lg:pb-12">
        <div className="mt-12 flex items-center gap-4 lg:mt-8">
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setMore((m) => !m)}
            aria-expanded={more}
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line bg-card px-5 text-sm font-semibold transition-colors hover:border-acc hover:text-acc"
          >
            {more ? 'Show fewer projects' : 'View all projects'}
            {!more && <span className="num rounded-full bg-paper-2 px-2 py-0.5 text-[0.7rem] text-muted group-hover:text-acc">+{rest.length}</span>}
            <Icon name="right" className={`size-4 transition-transform ${more ? '-rotate-90' : 'rotate-90'}`} />
          </button>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>
        {more && (
          <ul id="more-projects" className="mt-8 scroll-mt-28 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <li key={p.slug}>
                <a href={`#/work/${p.slug}`} onClick={open(p.slug)} className="block h-full rounded-3xl border border-line bg-card p-5 hover:border-acc">
                  <p className="num text-[0.66rem] tracking-[0.14em] text-acc uppercase">{p.period ?? p.context}</p>
                  <p className="display mt-2 text-lg leading-tight">{p.title}</p>
                  <p className="mt-2 text-sm text-muted">{p.oneLiner}</p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/* ---------- Skills ---------- */

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="acc-rose mx-auto max-w-7xl overflow-x-clip px-5 pt-8 pb-14 sm:px-8 sm:pb-24">
      <h2 id="skills-title" className="kicker display reveal mb-10 text-4xl uppercase">
        Skills
      </h2>
      <div className="gap-4 sm:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {skills.map((g) => (
          <div key={g.name} className="skill-card reveal relative rounded-3xl border border-line bg-card p-6">
            <span className="absolute -top-px left-6 h-0.5 w-10 bg-acc" aria-hidden="true" />
            <h3 className="display text-xl uppercase">{g.name}</h3>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li key={s}>
                  <Chip>{s}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowIWork() {
  return (
    <section id="how" aria-labelledby="how-title" className="acc-rose mx-auto max-w-7xl overflow-x-clip px-5 pb-14 sm:px-8 sm:pb-24">
    <div className="reveal rounded-3xl border border-line bg-card p-5 sm:p-10">
      <p className="kicker eyebrow !text-acc">How I work</p>
      <h2 id="how-title" className="display mt-3 text-3xl leading-tight sm:text-5xl">
        {howIWork.map((h, i) => (
          <span key={h.title}>
            {h.title}
            {i < howIWork.length - 1 ? <span className="mx-2 text-acc">→</span> : <span className="text-acc">.</span>}{' '}
          </span>
        ))}
      </h2>
      <ol className="how relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <span aria-hidden="true" className="how-line pointer-events-none absolute top-0 right-4 left-4 z-10 hidden h-px lg:block">
          <span className="how-dot absolute -top-[3px] size-[7px] rounded-full bg-acc shadow-[0_0_12px_2px_var(--acc)]" />
        </span>
        {howIWork.map((h, i) => (
          <li
            key={h.title}
            className="how-step group relative rounded-2xl border border-line bg-paper-2 p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-acc hover:shadow-[0_20px_40px_-25px_var(--acc)]"
            style={{ ['--i' as string]: i }}
          >
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-xl border border-acc/40 bg-card text-acc transition-colors group-hover:bg-acc group-hover:text-on-accent">
                <Icon name={h.icon as IconName} className="size-5" />
              </span>
              <span className="display outline-text text-4xl text-acc/80">{pad(i + 1)}</span>
            </div>
            <h3 className="display mt-4 text-xl">{h.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{h.text}</p>
          </li>
        ))}
      </ol>
    </div>
    </section>
  )
}

/* ---------- 04 Education & certificates ---------- */

const certBtn = 'inline-flex min-h-9 items-center rounded-full border border-acc/40 px-3 text-xs font-bold text-acc transition-colors hover:bg-acc hover:text-on-accent'

const groups: Cert['group'][] = ['AI', 'Product', 'Data & Analytics', 'Consulting & Finance', 'Engineering', 'Other']

export function Credentials() {
  return (
    <section id="credentials" aria-labelledby="cred-title" className="acc-rose mx-auto max-w-7xl overflow-x-clip px-5 pb-14 sm:px-8 sm:pb-24">
      <SectionTitle n="04" plain="Education &" color="Certificates" id="cred-title" />
      <div className="grid gap-4 md:grid-cols-2">
        {education.map((e) => (
          <div key={e.school} className="edu-card reveal rounded-3xl border border-line bg-card p-6">
            <p className="num text-xs tracking-[0.14em] text-acc uppercase">{e.period}</p>
            <h3 className="display mt-3 flex items-center gap-3 text-xl leading-snug">
              <Logo name={e.school} className="size-10 text-sm" />
              {e.school}
            </h3>
            <p className="mt-1 text-muted">{e.degree}</p>
          </div>
        ))}
      </div>
      <details data-mascot="certs" className="group mt-6 rounded-3xl border border-line bg-card p-4 sm:p-6">
        <summary className="cert-toggle flex cursor-pointer list-none flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl px-4 py-4 text-center sm:flex-nowrap sm:justify-between sm:text-left">
          <span className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            {/* a peek at who issued them */}
            <span className="flex -space-x-3" aria-hidden="true">
              {['Coursera Project Network', 'BCG', 'Bloomberg for Education', 'MathWorks', 'Mastercard'].map((n) => (
                <Logo key={n} name={n} className="size-10 border-2 border-ink text-xs" />
              ))}
            </span>
            <span>
              <span className="display block text-2xl leading-none sm:text-3xl">
                {certs.length} certifications
              </span>
              <span className="num mt-1.5 block text-[0.68rem] tracking-[0.12em] text-muted uppercase">Coursera · Forage · Bloomberg · MathWorks &amp; more · with PDFs &amp; verify links</span>
            </span>
          </span>
          <span className="cert-cta inline-flex min-h-11 shrink-0 items-center gap-2 px-5 text-sm font-bold">
            <span className="group-open:hidden">View all certificates</span>
            <span className="hidden group-open:inline">Hide certificates</span>
            <Icon name="right" className="size-4 rotate-90 transition-transform group-open:-rotate-90" />
          </span>
        </summary>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g}>
              <h3 className="num text-xs tracking-[0.14em] text-acc uppercase">{g}</h3>
              <ul className="mt-2">
                {certs
                  .filter((c) => c.group === g)
                  .map((c) => {
                    const f = c.fileKey ? certAssets[c.fileKey] : undefined
                    return (
                      <li key={c.title} className="flex gap-3 border-b border-line py-3">
                        <Logo name={c.issuer} className="mt-0.5 size-8 text-xs" />
                        <div>
                        <p className="leading-snug font-semibold">{c.title}</p>
                        <p className="text-sm text-muted">
                          {c.issuer}
                          {c.date && ` · ${c.date}`}
                        </p>
                        {(c.verify || f) && (
                          <p className="mt-2 flex gap-2">
                            {c.verify && (
                              <a href={c.verify} target="_blank" rel="noopener noreferrer" className={certBtn}>
                                Verify ↗<span className="sr-only"> {c.title} (opens in a new tab)</span>
                              </a>
                            )}
                            {f && (
                              <a href={asset(f.pdf)} target="_blank" rel="noopener noreferrer" className={certBtn}>
                                PDF ↗<span className="sr-only"> certificate for {c.title} (opens in a new tab)</span>
                              </a>
                            )}
                          </p>
                        )}
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  )
}

/* ---------- Contact / footer ---------- */

export function Contact() {
  const resume = useResume()
  return (
    <footer id="contact" aria-labelledby="contact-title" className="acc-coral relative isolate scroll-mt-0 overflow-hidden border-t border-line">
      <div aria-hidden="true" className="smoke absolute -inset-20 -z-10 opacity-70" />
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-6 sm:px-8 sm:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_25rem]">
        <div>
        <h2 id="contact-title" className="display max-w-4xl text-[2.8rem] leading-[0.95] sm:text-7xl">
          Hiring for product, AI or data roles? <span className="serif-i text-acc">Let&rsquo;s talk.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          I&rsquo;m open to new roles in AI product, product management, analytics and forward-deployed engineering, and always happy to chat about building with AI. My inbox is open.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Pill href={`mailto:${profile.email}`} solid>
            <Icon name="mail" /> {profile.email}
          </Pill>
          <Pill href={profile.linkedin} external>
            <Icon name="linkedin" /> LinkedIn
          </Pill>
          {profile.github && (
            <Pill href={profile.github} external>
              <Icon name="github" /> GitHub
            </Pill>
          )}
          {resume && (
            <Pill href={RESUME_URL} download="Aryan-Rai-Resume.pdf">
              <Icon name="download" /> Resume
            </Pill>
          )}
        </div>
        </div>
        <ContactChat />
        </div>
        <p className="mt-12 flex flex-col gap-2 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Aryan Rai, with help from Claude Code</span>
          <a href="#top" className="hover:text-ink">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  )
}

/* Decorative chat thread beside the contact CTA (laptop+). Plays once in view, then loops. */
const CHAT: { me?: boolean; text: string; mail?: boolean }[] = [
  { text: 'Hey Aryan 👋 just went through your portfolio.' },
  { text: 'Open to chatting about a role on our team?' },
  { me: true, text: 'Always! Product, AI or data. Let’s talk.' },
  { me: true, mail: true, text: profile.email },
]
// opens a new Gmail message to Aryan (web or app); the plain mailto button sits beside it
const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`
function ContactChat() {
  const box = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0) // bubbles shown; odd half-steps show "typing…"
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setStep(CHAT.length * 2)
    let t = 0
    const io = new IntersectionObserver(([e]) => {
      clearInterval(t)
      if (!e.isIntersecting) return
      t = window.setInterval(() => setStep((s) => (s >= CHAT.length * 2 ? (clearInterval(t), s) : s + 1)), 900)
    })
    if (box.current) io.observe(box.current)
    return () => (io.disconnect(), clearInterval(t))
  }, [])
  const shown = Math.min(CHAT.length, Math.floor(step / 2))
  const typing = step % 2 === 1 && shown < CHAT.length ? CHAT[shown] : null
  return (
    <div ref={box} className="relative hidden lg:block">
      <span aria-hidden="true" className="sticker chat-sticker absolute -top-10 -right-6 z-10 grid size-28 place-items-center">
        <svg viewBox="0 0 100 100" className="sticker-ring absolute inset-0 size-full">
          <defs>
            <path id="chatring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <text className="num" fontSize="8.4" fontWeight="700" fill="currentColor">
            <textPath href="#chatring" textLength="236" lengthAdjust="spacing">
              OPEN TO ROLES · HAPPY TO CHAT ·
            </textPath>
          </text>
        </svg>
        <span className="text-3xl">💬</span>
      </span>
      <div className="chat-window rotate-2 border-[3px] border-ink bg-card">
        <div className="flex items-center gap-3 border-b-[3px] border-ink bg-[var(--pop)] px-4 py-3 text-black">
          <img src={asset('assets/img/aryan-avatar.webp')} alt="" width={40} height={40} loading="lazy" className="size-10 rounded-full border-2 border-black object-cover" />
          <span>
            <span className="block text-sm leading-tight font-bold">Aryan Rai</span>
            <span className="num flex items-center gap-1.5 text-[0.65rem] uppercase">
              <span className="size-2 animate-pulse rounded-full bg-[#1a9a3c]" /> online
            </span>
          </span>
        </div>
        <ul aria-label="Example chat" className="flex min-h-[20rem] flex-col justify-end gap-3 p-4">
          {CHAT.slice(0, shown).map((m) =>
            m.mail ? (
              <li key={m.text} className="self-end">
                <a href={GMAIL} target="_blank" rel="noopener noreferrer" className="chat-mail">
                  <Icon name="mail" className="size-4 shrink-0" />
                  <span>{m.text}</span>
                  <span className="sr-only">(write to me in Gmail, opens in a new tab)</span>
                </a>
                <span className="num mt-1.5 block text-right text-[0.62rem] text-muted uppercase">tap to write in Gmail ↗</span>
              </li>
            ) : (
              <li key={m.text} className={`chat-bubble ${m.me ? 'me self-end' : 'self-start'}`}>
                {m.text}
              </li>
            ),
          )}
          {typing && (
            <li aria-hidden="true" className={`chat-bubble typing ${typing.me ? 'me self-end' : 'self-start'}`}>
              <span />
              <span />
              <span />
            </li>
          )}
          {shown === CHAT.length && <li className="num self-end text-[0.65rem] text-muted uppercase">Seen ✓✓</li>}
        </ul>
      </div>
    </div>
  )
}

/* ---------- Recommendations (from LinkedIn, pasted into src/data/recommendations.json) ---------- */

export function Recommendations() {
  const [open, setOpen] = useState<string[]>([])
  const sec = useRef<HTMLElement>(null)
  // Expanded quotes fold back once the reader scrolls on to another section.
  useEffect(() => {
    if (!sec.current) return
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && setOpen([]))
    io.observe(sec.current)
    return () => io.disconnect()
  }, [])
  if (!recs.length) return null
  return (
    <section ref={sec} id="recommendations" aria-labelledby="recs-title" className="acc-coral mx-auto max-w-7xl overflow-x-clip px-5 pb-8 sm:px-8">
      <header className="reveal mb-12">
        <p className="kicker eyebrow !text-acc">Kind words</p>
        <h2 id="recs-title" className="display mt-3 text-[2.6rem] leading-[0.95] uppercase sm:text-6xl lg:text-7xl">
          What people <span className="text-acc">say</span>
        </h2>
      </header>
      <ul className="grid items-start gap-6 md:grid-cols-2">
        {recs.map((r) => (
          <li key={r.name} className="rec-card reveal">
            <figure className="flex h-full flex-col rounded-2xl border-2 border-ink bg-card p-7 shadow-[6px_6px_0_var(--ink)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--acc)] sm:p-9">
              <span aria-hidden="true" className="display text-6xl leading-none text-acc">
                &ldquo;
              </span>
              <blockquote id={`rec-${r.name.replace(/\W+/g, '-')}`} className="mt-2 flex-1 space-y-4 text-[1.02rem] leading-relaxed text-ink/90">
                {(open.includes(r.name) ? r.text.split('\n') : [r.text.split('\n')[0]]).map((t) => (
                  <p key={t} className={open.includes(r.name) ? 'rec-in' : 'line-clamp-4'}>
                    {t}
                  </p>
                ))}
                <button
                  type="button"
                  aria-expanded={open.includes(r.name)}
                  aria-controls={`rec-${r.name.replace(/\W+/g, '-')}`}
                  onClick={() => setOpen((o) => (o.includes(r.name) ? o.filter((x) => x !== r.name) : [...o, r.name]))}
                  className="font-bold text-acc hover:underline"
                >
                  {open.includes(r.name) ? 'Show less' : '…read more'}
                </button>
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-acc font-bold text-on-accent">
                  {r.name
                    .split(' ')
                    .filter((w) => !w.endsWith('.'))
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <span>
                  <span className="block font-bold uppercase">{r.name}</span>
                  <span className="num block text-[0.7rem] tracking-[0.14em] text-muted uppercase">{r.role}</span>
                  <span className="mt-1 block text-xs text-acc">{r.relation}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <a href={`${profile.linkedin}details/recommendations/`} target="_blank" rel="noopener noreferrer" className="font-bold text-acc hover:underline">
          See all recommendations on LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  )
}

/* ---------- Reading progress ---------- */

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={bar} className="read-progress no-print" aria-hidden="true" />
}
