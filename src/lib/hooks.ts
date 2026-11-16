import { useCallback, useEffect, useState } from 'react'
import type { Lens } from '../data/types'
import manifest from '../data/assets.json'

/* ---------- Assets ---------- */

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`

type Slide = { src: string; w: number; h: number }
type WorkAsset = { slides: Slide[]; thumb: string; pdf?: string; pdfKB?: number; pages?: number }
export const workAssets = manifest.work as Record<string, WorkAsset>
export const resumeAssets = manifest.resumes as Record<string, { pdf: string; kb: number }>
export const certAssets = manifest.certs as Record<string, { pdf: string; kb: number }>

export const fmtSize = (kb?: number) => (!kb ? '' : kb > 1000 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`)

/* ---------- Safe storage ---------- */

const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v)
    } catch {
      /* private mode etc. */
    }
  },
}

/* ---------- Theme ---------- */

export function useTheme() {
  const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const s = store.get('theme')
    return s === 'light' || s === 'dark' ? s : systemDark() ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111114' : '#F6F3EC')
  }, [theme])
  const toggle = useCallback(() => {
    setTheme((t) => {
      const n = t === 'dark' ? 'light' : 'dark'
      store.set('theme', n)
      return n
    })
  }, [])
  return { theme, toggle }
}

/* ---------- Lens (synced to ?lens=) ---------- */

const LENSES: Lens[] = ['all', 'product', 'analytics', 'consulting', 'ai']

export function useLens() {
  const read = (): Lens => {
    const q = new URLSearchParams(window.location.search).get('lens') as Lens | null
    if (q && LENSES.includes(q)) return q
    const s = store.get('lens') as Lens | null
    return s && LENSES.includes(s) ? s : 'all'
  }
  const [lens, setLensState] = useState<Lens>(read)
  const setLens = useCallback((l: Lens) => {
    setLensState(l)
    store.set('lens', l)
    const url = new URL(window.location.href)
    if (l === 'all') url.searchParams.delete('lens')
    else url.searchParams.set('lens', l)
    window.history.replaceState(null, '', url)
  }, [])
  return { lens, setLens }
}

/* ---------- Hash route for case studies: #/work/<slug> ---------- */

export function useCaseRoute() {
  const parse = () => {
    const m = window.location.hash.match(/^#\/work\/([\w-]+)/)
    return m ? m[1] : null
  }
  const [slug, setSlug] = useState<string | null>(parse)
  useEffect(() => {
    const on = () => setSlug(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const close = useCallback(() => {
    if (window.history.state?.fromSite) window.history.back()
    else {
      const url = new URL(window.location.href)
      url.hash = 'work'
      window.history.replaceState(null, '', url)
      setSlug(null)
    }
  }, [])
  return { slug, close }
}

export function openCase(slug: string) {
  // Moving between case studies replaces the entry, so "Close" always returns to the page.
  const inCase = /^#\/work\//.test(window.location.hash)
  const state = { fromSite: inCase ? !!window.history.state?.fromSite : true }
  if (inCase) window.history.replaceState(state, '', `#/work/${slug}`)
  else window.history.pushState(state, '', `#/work/${slug}`)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
