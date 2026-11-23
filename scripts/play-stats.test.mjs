import assert from 'node:assert/strict'
// Importing runs the fetch too; that is fine (it never throws). Here we only check the parser.
const { parse } = await import('./play-stats.mjs')
const html = '<div aria-label="Rated 4.3 stars out of five stars"></div><div class="x">50K+</div><div class="y">Downloads</div><div>111 reviews</div>'
assert.deepEqual(parse(html), { rating: '4.3', downloads: '50K+', reviews: '111' })
assert.equal(parse('<html>nothing</html>'), null)
console.log('play-stats parser ok')
