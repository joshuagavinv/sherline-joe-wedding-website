import { chromium, devices } from 'playwright'

const iphone = devices['iPhone 13']
const browser = await chromium.launch()
const context = await browser.newContext({ ...iphone })
const page = await context.newPage()

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.mouse.click(iphone.viewport.width / 2, iphone.viewport.height / 2)
await page.waitForTimeout(2500)

// Locate the VenueScene container (the .relative.overflow-hidden with height 320)
const venueTop = await page.evaluate(() => {
  const divs = [...document.querySelectorAll('div.relative.overflow-hidden')]
  const venue = divs.find(d => Math.round(d.getBoundingClientRect().height) === 320)
  const y = venue.getBoundingClientRect().top + window.scrollY
  return y
})

const dir = '/private/tmp/claude-501/-Users-joshuagavinvalerie-personal-sherline-joe-wedding-website/ecafbef1-42e5-4884-ad99-da36280508b8/scratchpad'
const vh = iphone.viewport.height

// Capture as the VenueScene enters from the bottom and rises up — this is the
// parallax entry window (scrollYProgress 0 -> 0.5). Castle bottom is at venueTop+320.
const castleBottom = venueTop + 320
for (const [i, frac] of [0.15, 0.35, 0.55, 0.8].entries()) {
  // place castleBottom at a given fraction down the viewport
  const target = castleBottom - vh * frac
  await page.evaluate((t) => window.scrollTo(0, t), target)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${dir}/parallax_${i}.png` })
}
await browser.close()
console.log('done', { venueTop, castleBottom })
