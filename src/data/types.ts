export type Lens = 'all' | 'product' | 'analytics' | 'consulting' | 'ai'
export type Track = Exclude<Lens, 'all'>

export type OutcomeKind = 'shipped' | 'finding' | 'target'

export interface Outcome {
  value?: string
  label: string
  kind: OutcomeKind
}

export interface Project {
  slug: string
  title: string
  /** Company / programme / context, e.g. "NextLeap PM Fellowship" */
  context: string
  period?: string
  tier: 'flagship' | 'case' | 'more'
  tracks: Track[]
  oneLiner: string
  problem: string
  role: string
  approach: string[]
  tools: string[]
  outcomes: Outcome[]
  /** Optional closing note, e.g. the recommendation or decision */
  note?: string
  /** Key into assets.json -> work */
  evidenceKey?: string
  evidenceNote?: string
  /** Where each fact came from (shown in the case study footer) */
  source: string
}

export interface Role {
  org: string
  title: string
  period: string
  place?: string
  tracks: Track[]
  bullets: string[]
}

export interface Cert {
  title: string
  issuer: string
  date: string
  group: 'Product' | 'AI' | 'Data & Analytics' | 'Consulting & Finance' | 'Engineering'
  verify?: string
  fileKey?: string
}

export interface SkillGroup {
  name: string
  tracks: Track[]
  items: string[]
}
