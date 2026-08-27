import { chromium } from 'playwright'
import { createServer } from 'vite'

const checks = []
const check = (name, ok, detail) => checks.push({ name, ok, detail })

const server = await createServer({ configFile: new URL('../vite.config.mjs', import.meta.url).pathname, server: { port: 5199 } })
await server.listen()

const browser = await chromium.launch()
const page = await browser.newPage()
const consoleErrors = []
page.on('console', message => message.type() === 'error' && consoleErrors.push(message.text()))
page.on('pageerror', error => consoleErrors.push(String(error)))

await page.goto('http://localhost:5199/browser/', { waitUntil: 'load' })
await page.waitForFunction(() => window.verify !== undefined, null, { timeout: 20000 })
await page.evaluate(() => window.verify.ready)

const mounted = await page.evaluate(() => {
  const { app } = window.verify
  app.render()
  return {
    rendererType: app.renderer?.type ?? null,
    canvasIsOurs: app.canvas === document.getElementById('stage'),
    stage: app.stage.children.map(child => ({
      label: child.label,
      children: child.children.map(grandchild => grandchild.label)
    }))
  }
})

check('renderer initialized', mounted.rendererType !== null, mounted.rendererType)
check('mounted onto the canvas we passed', mounted.canvasIsOurs)
check(
  'Stage inserted the tree into app.stage',
  JSON.stringify(mounted.stage) ===
    JSON.stringify([
      { label: 'box', children: [] },
      { label: 'group', children: ['child'] }
    ]),
  JSON.stringify(mounted.stage)
)

const mountedEarly = await page.evaluate(() => window.mountedDuringFirstRender)
check('Loading held the children back through the first render pass', mountedEarly === false)

const readPixel = () =>
  page.evaluate(() => {
    const { app } = window.verify
    const { pixels } = app.renderer.extract.pixels(app.stage)
    return [pixels[0], pixels[1], pixels[2]]
  })

const red = await readPixel()
check('drew red pixels', red[0] > 200 && red[1] < 60 && red[2] < 60, `rgb(${red})`)

await page.evaluate(() => window.verify.setTint(0x0000ff))
const blue = await readPixel()
check('a signal write repainted the canvas blue', blue[2] > 200 && blue[0] < 60, `rgb(${blue})`)

check('no console or page errors', consoleErrors.length === 0, consoleErrors.join(' | '))

await browser.close()
await server.close()

let failed = false
for (const { name, ok, detail } of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
