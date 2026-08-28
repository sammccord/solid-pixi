import { chromium } from 'playwright'
import { createServer } from 'vite'

const checks = []
const check = (name, ok, detail) => checks.push({ name, ok, detail })

const server = await createServer({
  configFile: new URL('../vite.config.mjs', import.meta.url).pathname,
  server: { port: 5199 }
})
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
    stage: app.stage.children
      .filter(child => child.label)
      .map(child => ({
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

const stageChild = await page.evaluate(() => {
  const labels = () => window.verify.app.stage.children.map(child => child.label)
  const before = labels()
  window.verify.setExtra(true)
  const shown = labels()
  window.verify.setExtra(false)
  const hidden = labels()
  return { before, shown, hidden }
})
check(
  'a conditional child directly under Stage mounts on its signal',
  !stageChild.before.includes('extra') && stageChild.shown.includes('extra'),
  JSON.stringify(stageChild)
)
check(
  'the conditional child unmounts when the signal flips back',
  !stageChild.hidden.includes('extra'),
  JSON.stringify(stageChild.hidden)
)

const stageText = await page.evaluate(() => {
  const node = () => window.verify.app.stage.children.find(child => 'text' in child)
  const first = node()?.text ?? null
  window.verify.setMessage(' second')
  const second = node()?.text ?? null
  return { first, second }
})
check(
  'a text expression directly under Stage renders',
  stageText.first === ' first',
  JSON.stringify(stageText)
)
check(
  'the text expression updates on its signal',
  stageText.second === ' second',
  JSON.stringify(stageText)
)

check('no console or page errors', consoleErrors.length === 0, consoleErrors.join(' | '))

// --- asset hooks and Application stability, on a second page ---

const assets = await browser.newPage()
const assetNoise = []
assets.on(
  'console',
  m => ['error', 'warning'].includes(m.type()) && assetNoise.push(`${m.type()}: ${m.text()}`)
)
assets.on('pageerror', e => assetNoise.push(String(e)))

await assets.goto('http://localhost:5199/browser/assets.html', { waitUntil: 'load' })
await assets.waitForFunction(() => window.assets !== undefined, null, { timeout: 20000 })
await assets.evaluate(() => window.assets.ready)
await assets
  .waitForFunction(() => window.assets.app.stage.children.length === 1, null, { timeout: 20000 })
  .catch(() => {})

const loaded = await assets.evaluate(() => {
  const { app } = window.assets
  app.render()
  const { pixels } = app.renderer.extract.pixels(app.stage)
  return {
    progress: window.assets.progressWhileLoading,
    spriteEarly: window.assets.spriteMountedDuringFirstRender,
    labels: app.stage.children.map(child => child.label),
    pixel: [pixels[0], pixels[1], pixels[2]]
  }
})

check('useAsset suspended the sprite through the first render pass', loaded.spriteEarly === false)
check(
  'progress reached 1 by the time the sprite mounted',
  loaded.progress.at(-1) === 1,
  JSON.stringify(loaded.progress)
)
check(
  'the loaded texture drew green pixels',
  loaded.pixel[1] > 150 && loaded.pixel[0] < 120,
  `rgb(${loaded.pixel})`
)

const stable = await assets.evaluate(() => {
  const before = { renderer: window.assets.app.renderer, stage: window.assets.app.stage }
  window.assets.setBackground('#123456')
  return {
    sameRenderer: window.assets.app.renderer === before.renderer,
    sameStage: window.assets.app.stage === before.stage,
    stillOneChild: window.assets.app.stage.children.length === 1
  }
})

check(
  'an option change does not re-initialize the Application',
  stable.sameRenderer && stable.sameStage && stable.stillOneChild,
  JSON.stringify(stable)
)
check(
  'no owned-write or other console noise from the hooks',
  assetNoise.length === 0,
  assetNoise.join(' | ')
)

// --- a failing asset lands in Errored instead of halting the graph ---

const errors = await browser.newPage()
const halted = []
errors.on('console', m => m.text().includes('REACTIVITY_HALTED') && halted.push(m.text()))

await errors.goto('http://localhost:5199/browser/errors.html', { waitUntil: 'load' })
await errors.waitForFunction(() => window.errors !== undefined, null, { timeout: 20000 })
await errors.evaluate(() => window.errors.ready)
await errors
  .waitForFunction(
    () => window.errors.app.stage.children.some(child => child.label === 'failed'),
    null,
    { timeout: 20000 }
  )
  .catch(() => {})

const recovered = await errors.evaluate(() =>
  window.errors.app.stage.children.map(child => child.label)
)

check(
  'a failing asset renders the Errored fallback',
  recovered.includes('failed'),
  JSON.stringify(recovered)
)
check('a failing asset does not halt the reactive system', halted.length === 0, halted.join(' | '))

await browser.close()
await server.close()

let failed = false
for (const { name, ok, detail } of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
