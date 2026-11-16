import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Writes sitemap.xml + robots.txt into dist using VITE_SITE_URL.
function seoFiles(site: string): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    closeBundle() {
      const url = site.replace(/\/$/, '')
      const out = resolve(process.cwd(), 'dist')
      writeFileSync(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`)
      writeFileSync(
        resolve(out, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><changefreq>monthly</changefreq></url>\n</urlset>\n`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // BASE_PATH=/repo-name/ for a GitHub Pages project site; "/" for Vercel or a custom domain.
    base: env.BASE_PATH || '/',
    build: { assetsDir: '_app' },
    plugins: [react(), tailwindcss(), seoFiles(env.VITE_SITE_URL || 'https://example.com')],
  }
})
