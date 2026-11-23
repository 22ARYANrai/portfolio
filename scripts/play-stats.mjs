// Pulls public rating + download counts from the Google Play listings into src/data/play-stats.json.
// Runs before every build; on any failure it keeps the last good numbers so a build never breaks.
// ponytail: scrapes Play's HTML (no official public API); if Google changes markup, the old numbers stay.
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = new URL('../src/data/play-stats.json', import.meta.url)
const APPS = { coach: 'com.vlv.aravali.kukuaicoach', dicta: 'com.vlv.aravali.kukuflow' }

export function parse(html) {
  const rating = html.match(/Rated ([\d.]+) stars out of five/)?.[1]
  const downloads = html.match(/>([\d.,]+[KMB]?\+)<\/div><div[^>]*>Downloads</)?.[1]
  const reviews = html.match(/>([\d.,]+[KMB]?) reviews</)?.[1]
  return rating && downloads ? { rating, downloads, ...(reviews && { reviews }) } : null
}

const old = JSON.parse(readFileSync(FILE, 'utf8'))
const next = { ...old }
for (const [key, id] of Object.entries(APPS)) {
  try {
    const res = await fetch(`https://play.google.com/store/apps/details?id=${id}&hl=en_IN&gl=IN`, { headers: { 'accept-language': 'en-IN' } })
    const got = parse(await res.text())
    if (got) next[key] = got
    else console.warn(`play-stats: could not parse ${key}, keeping ${JSON.stringify(old[key])}`)
  } catch (e) {
    console.warn(`play-stats: fetch failed for ${key} (${e.message}), keeping old numbers`)
  }
}
next.updated = new Date().toISOString().slice(0, 10)
writeFileSync(FILE, JSON.stringify(next, null, 1) + '\n')
console.log('play-stats:', JSON.stringify(next))
