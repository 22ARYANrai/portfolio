// One-off: download each organisation's favicon (by domain) into public/assets/logos/<domain>.png.
// Re-run after adding a name to src/data/logos.json. Unknown names fall back to initials on the site.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const map = JSON.parse(readFileSync('src/data/logos.json', 'utf8'))
for (const d of new Set(Object.values(map))) {
  const out = `public/assets/logos/${d}.png`
  if (existsSync(out)) continue
  const r = await fetch(`https://www.google.com/s2/favicons?domain=${d}&sz=128`)
  const buf = Buffer.from(await r.arrayBuffer())
  if (r.ok && buf.length > 300) writeFileSync(out, buf)
  console.log(d, r.status, buf.length)
}
