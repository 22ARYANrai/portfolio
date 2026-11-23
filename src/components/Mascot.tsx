/* Buddy, a little cartoon that blinks, follows the pointer with its eyes,
   naps when idle, and says something different in each section. Pure SVG + CSS, no animation library. */
import { useEffect, useRef, useState } from 'react'

const LINES: Record<string, string> = {
  top: 'Hi, I’m Buddy 👋',
  building: 'These two ship to real users!',
  experience: 'Scroll the timeline ↓',
  recommendations: 'Kind words 🥹',
  projects: 'Pick a case study!',
  playground: 'Drag or click projects into the terminal',
  skills: 'Tools I use daily',
  credentials: 'Graduated from BITS Pilani',
  certs: '36 certificates inside!',
  how: 'Discover → Build → Ship',
  contact: 'Let’s talk!',
}

export function Mascot() {
  const eyes = useRef<SVGGElement>(null)
  const shown = useRef(LINES.top)
  const [line, setLine] = useState(LINES.top)
  const [say, setSay] = useState(true)
  const [hop, setHop] = useState(0) // bumps on each click to replay the jump + sparkles
  const [sleep, setSleep] = useState(false)

  // eyes follow the pointer (or the last tap on phones); any activity wakes it up
  useEffect(() => {
    let idle = 0
    let asleep = false
    const wake = () => {
      clearTimeout(idle)
      idle = window.setTimeout(() => ((asleep = true), setSleep(true)), 12000)
      if (asleep) {
        asleep = false
        setSleep(false)
        setLine('Oh hi! 👀')
        setSay(true)
      }
    }
    const move = (e: PointerEvent) => {
      wake()
      const g = eyes.current
      if (!g) return
      const r = g.ownerSVGElement!.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.45)
      const d = Math.hypot(dx, dy) || 1
      g.style.transform = `translate(${(dx / d) * 2.6}px, ${(dy / d) * 2.2}px)`
    }
    wake()
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', move, { passive: true })
    addEventListener('scroll', wake, { passive: true })
    return () => {
      clearTimeout(idle)
      removeEventListener('pointermove', move)
      removeEventListener('pointerdown', move)
      removeEventListener('scroll', wake)
    }
  }, [])

  // a different line per section
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          const l = LINES[(e.target as HTMLElement).dataset.mascot || e.target.id]
          if (!l || l === shown.current) return // same section (or first load): nothing new to say
          shown.current = l
          setLine(l)
          setSay(true)
          }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('section[id], footer[id], [data-mascot]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const t = setTimeout(() => setSay(false), 3500)
    return () => clearTimeout(t)
  }, [line, say])

  const SKIN = '#c98b66'
  return (
    <div className={`mascot no-print ${sleep ? 'asleep' : ''}`}>
      <p className={`mascot-bubble ${say && !sleep ? 'on' : ''}`} aria-live="polite">
        {line}
      </p>
      <button
        type="button"
        aria-label="Say hi to Buddy"
        onClick={() => (setSay(true), setHop((h) => h + 1))}
        className="mascot-btn"
      >
        <svg key={hop} viewBox="-12 -14 144 144" className={`size-full overflow-visible ${hop ? 'm-hop' : ''}`} aria-hidden="true">
          <defs>
            <clipPath id="m-disc">
              <circle cx="60" cy="60" r="56" />
            </clipPath>
          </defs>
          {/* yellow disc with a hard shadow */}
          <circle cx="64" cy="64" r="57.5" fill="var(--sh, #000)" />
          <circle cx="60" cy="60" r="56" fill="var(--pop, #ffd60a)" stroke="#000" strokeWidth="3.5" />
          <g clipPath="url(#m-disc)">
            {/* suit + shirt + tie */}
            <path d="M18 124 Q20 88 60 86 Q100 88 102 124 Z" fill="#1c2a4a" stroke="#000" strokeWidth="3" />
            <path d="M50 87 L60 104 L70 87 Z" fill="#fff" stroke="#000" strokeWidth="2" />
            <path d="M57 92 L60 114 L63 92 Z" fill="#22356b" stroke="#000" strokeWidth="1.5" />
            <g className="m-head">
              <rect x="53" y="72" width="14" height="14" fill={SKIN} stroke="#000" strokeWidth="2.5" />
              <ellipse cx="35" cy="56" rx="4" ry="6" fill={SKIN} stroke="#000" strokeWidth="2.5" />
              <ellipse cx="85" cy="56" rx="4" ry="6" fill={SKIN} stroke="#000" strokeWidth="2.5" />
              <ellipse cx="60" cy="54" rx="25" ry="28" fill={SKIN} stroke="#000" strokeWidth="3" />
              {/* curly hair */}
              <path
                d="M34 50 Q30 30 42 24 Q44 14 56 17 Q62 10 70 16 Q82 14 84 26 Q92 32 86 50 Q84 38 76 36 Q70 30 62 33 Q52 28 46 35 Q38 38 34 50 Z"
                fill="#1a1412"
                stroke="#000"
                strokeWidth="2.5"
              />
              <circle cx="47" cy="22" r="3.5" fill="#1a1412" />
              <circle cx="66" cy="15" r="3.5" fill="#1a1412" />
              <circle cx="80" cy="23" r="3.5" fill="#1a1412" />
              {/* smile + blush */}
              <path d="M51 67 Q60 74 69 67" fill="#fff" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
              <ellipse cx="42" cy="63" rx="4" ry="2.4" fill="#ff7a7a" opacity="0.55" />
              <ellipse cx="78" cy="63" rx="4" ry="2.4" fill="#ff7a7a" opacity="0.55" />
              {/* brows lift while waving */}
              <g className="m-brows">
                <path d="M43 41 Q49 38 55 41" fill="none" stroke="#1a1412" strokeWidth="3" strokeLinecap="round" />
                <path d="M65 41 Q71 38 77 41" fill="none" stroke="#1a1412" strokeWidth="3" strokeLinecap="round" />
              </g>
              {/* eyes (with shine) + blinking / sleeping lids */}
              <g ref={eyes} className="m-eyes">
                <circle cx="50" cy="53" r="3.2" fill="#000" />
                <circle cx="70" cy="53" r="3.2" fill="#000" />
                <circle cx="51.2" cy="51.8" r="1" fill="#fff" />
                <circle cx="71.2" cy="51.8" r="1" fill="#fff" />
              </g>
              <g className="m-lids">
                <rect x="44" y="46" width="12" height="13" fill={SKIN} />
                <rect x="64" y="46" width="12" height="13" fill={SKIN} />
                <path d="M45 55 Q50 58 55 55 M65 55 Q70 58 75 55" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
              </g>
              {/* blue glasses with a glint */}
              <rect x="41" y="45" width="17" height="15" rx="4" fill="rgb(255 255 255 / 0.12)" stroke="#2342c4" strokeWidth="3" />
              <rect x="62" y="45" width="17" height="15" rx="4" fill="rgb(255 255 255 / 0.12)" stroke="#2342c4" strokeWidth="3" />
              <path d="M58 51 L62 51" stroke="#2342c4" strokeWidth="3" />
              <path className="m-glint" d="M44 48 L48 47" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>
          {/* click sparkles */}
          {hop > 0 && (
            <g className="m-spark" fill="var(--acid, #b8ff00)" stroke="#000" strokeWidth="1.5">
              <path d="M10 10 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
              <path d="M112 -4 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" />
              <path d="M-6 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" />
            </g>
          )}
          {/* sleeping zzz */}
          <g className="m-zzz" fill="currentColor" fontWeight="700">
            <text x="96" y="10" fontSize="14">z</text>
            <text x="108" y="-2" fontSize="10">z</text>
          </g>
        </svg>
      </button>
    </div>
  )
}
