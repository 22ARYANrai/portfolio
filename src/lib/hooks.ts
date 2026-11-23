import { useCallback, useEffect, useState } from 'react'
import manifest from '../data/assets.json'

/* ---------- Assets ---------- */

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`

type Slide = { src: string; w: number; h: number }
type WorkAsset = { slides: Slide[]; thumb: string; icon?: string; pdf?: string; pdfKB?: number; pages?: number }
export const workAssets = manifest.work as Record<string, WorkAsset>
export const certAssets = manifest.certs as Record<string, { pdf: string; kb: number }>

/** The one resume the site links to. Drop the PDF at public/resume/Aryan-Rai-Resume.pdf.
 *  Until that file exists every Resume button stays hidden (checked once per page load). */
export const RESUME_URL = asset('resume/Aryan-Rai-Resume.pdf')
let resumeCheck: Promise<boolean> | undefined
export function useResume() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    // dev/preview servers answer missing files with index.html, so require a PDF content type
    resumeCheck ??= fetch(RESUME_URL, { method: 'HEAD' })
      .then((r) => r.ok && (r.headers.get('content-type') ?? '').includes('pdf'))
      .catch(() => false)
    resumeCheck.then(setOk)
  }, [])
  return ok
}

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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const s = store.get('theme')
    return s === 'dark' ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c0c0c' : '#f4f4f0')
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
      url.hash = 'projects'
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
