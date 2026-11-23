/* Diagrams used inside case-study pages. */
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
