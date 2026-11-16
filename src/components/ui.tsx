import type { ReactNode } from 'react'
import type { OutcomeKind, Track } from '../data/types'

type IconName = 'arrow' | 'arrowUp' | 'download' | 'linkedin' | 'mail' | 'github' | 'sun' | 'moon' | 'close' | 'left' | 'right' | 'check' | 'external' | 'menu'

const paths: Record<IconName, ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M7 17 17 7M8 7h9v9" />,
  download: <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  github: <path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.3c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.6 0C5.8 1.6 4.7 1.9 4.7 1.9a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 3.2 9c0 5.2 3.1 6.4 6.1 6.7a3 3 0 0 0-.9 2.3V22" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  left: <path d="m15 6-6 6 6 6" />,
  right: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
}

export function Icon({ name, className = 'size-4' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  )
}

export const trackLabel: Record<Track, string> = {
  product: 'Product',
  analytics: 'Analytics',
  consulting: 'Consulting',
  ai: 'AI & FDE',
}

export function Tag({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.72rem] leading-5 ${
        active ? 'border-accent bg-accent-soft text-ink' : 'border-line text-muted'
      }`}
    >
      {children}
    </span>
  )
}

const kindLabel: Record<OutcomeKind, string> = { shipped: 'Result', finding: 'Finding', target: 'Target' }
export function KindBadge({ kind }: { kind: OutcomeKind }) {
  const style =
    kind === 'shipped'
      ? 'bg-accent text-on-accent'
      : kind === 'finding'
        ? 'bg-paper-2 text-ink border border-line'
        : 'border border-dashed border-muted text-muted'
  return <span className={`num inline-block rounded px-1.5 py-px text-[0.62rem] uppercase tracking-[0.12em] ${style}`}>{kindLabel[kind]}</span>
}

export function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="reveal mb-10 grid gap-4 md:mb-14 md:grid-cols-12">
      <p className="eyebrow md:col-span-3 md:pt-3">{eyebrow}</p>
      <div className="md:col-span-9">
        <h2 id={id} className="display text-[2.1rem] leading-[1.05] font-medium sm:text-5xl">
          {title}
        </h2>
        {children && <div className="mt-4 max-w-2xl text-muted">{children}</div>}
      </div>
    </div>
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'solid',
  download,
  external,
  onClick,
  icon,
}: {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
  download?: boolean | string
  external?: boolean
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  icon?: IconName
}) {
  const base = 'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-[background,color,transform] duration-200 active:scale-[0.98]'
  const v = variant === 'solid' ? 'bg-ink text-paper hover:bg-accent hover:text-on-accent' : 'border border-ink/80 text-ink hover:bg-ink hover:text-paper'
  return (
    <a
      href={href}
      className={`${base} ${v}`}
      download={download === true ? '' : download || undefined}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {icon && <Icon name={icon} />}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}
