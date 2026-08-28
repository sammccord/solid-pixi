import { spawn } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('.', import.meta.url))
const docs = join(root, 'src/content/docs')
const port = Number(process.env.PORT ?? 4399)
const out = process.argv[2]

function pages(dir = docs) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return pages(path)
    if (!entry.name.endsWith('.mdx')) return []
    const source = readFileSync(path, 'utf8')
    const example = source.match(/components\/([^/]+)\/index\.astro/)
    if (!example) return []
    const route = relative(docs, path)
      .replace(/\.mdx$/, '')
      .toLowerCase()
    return [{ example: example[1], url: `http://localhost:${port}/solid-pixi/${route}/` }]
  })
}

function decodePng(buffer) {
  let at = 8
  let width = 0
  let height = 0
  let channels = 4
  const idat = []
  while (at < buffer.length) {
    const length = buffer.readUInt32BE(at)
    const tag = buffer.toString('ascii', at + 4, at + 8)
    const body = buffer.subarray(at + 8, at + 8 + length)
    if (tag === 'IHDR') {
      width = body.readUInt32BE(0)
      height = body.readUInt32BE(4)
      if (body[8] !== 8 || (body[9] !== 6 && body[9] !== 2))
        throw new Error(`unsupported png ${body[8]}/${body[9]}`)
      channels = body[9] === 6 ? 4 : 3
    }
    if (tag === 'IDAT') idat.push(body)
    at += 12 + length
  }

  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const pixels = Buffer.alloc(height * stride)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[y * stride + x - channels] : 0
      const b = y > 0 ? pixels[(y - 1) * stride + x] : 0
      const c = x >= channels && y > 0 ? pixels[(y - 1) * stride + x - channels] : 0
      let value = line[x]
      if (filter === 1) value += a
      else if (filter === 2) value += b
      else if (filter === 3) value += (a + b) >> 1
      else if (filter === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      pixels[y * stride + x] = value & 0xff
    }
  }

  const colors = new Set()
  for (let i = 0; i + channels <= pixels.length; i += channels) {
    colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`)
  }
  return colors.size
}

const server = spawn('npx', ['astro', 'dev', '--port', String(port)], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe']
})
const serverLog = []
server.stdout.on('data', chunk => serverLog.push(String(chunk)))
server.stderr.on('data', chunk => serverLog.push(String(chunk)))

const stop = () => server.kill('SIGTERM')
process.on('exit', stop)

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const response = await fetch(`http://localhost:${port}/solid-pixi/`)
      if (response.ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  throw new Error(`astro dev never came up:\n${serverLog.join('').slice(-2000)}`)
}

await waitForServer()

const browser = await chromium.launch()
const results = []

try {
  for (const { example, url } of pages().sort((a, b) => a.example.localeCompare(b.example))) {
    const tab = await browser.newPage()
    const noise = []
    tab.on('console', m => m.type() === 'error' && noise.push(m.text().replace(/\s+/g, ' ')))
    tab.on('pageerror', e => noise.push(String(e).replace(/\s+/g, ' ')))

    let colors = 0
    try {
      await tab.goto(url, { waitUntil: 'load', timeout: 60000 })
      const canvas = await tab.waitForSelector('canvas#root', { timeout: 15000 })
      await tab.waitForTimeout(2500)
      colors = decodePng(await canvas.screenshot({ type: 'png' }))
    } catch (error) {
      noise.push(`harness: ${String(error).split('\n')[0]}`)
    }

    results.push({ example, url, colors, errors: noise.slice(0, 3) })
    await tab.close()
  }
} finally {
  await browser.close()
  stop()
}

if (out) writeFileSync(out, `${JSON.stringify(results, null, 2)}\n`)

let failed = 0
for (const { example, colors, errors } of results) {
  const ok = colors > 1 && errors.length === 0
  if (!ok) failed++
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${example.padEnd(24)} ${String(colors).padStart(6)} colors` +
      (errors.length ? `  ${errors[0].slice(0, 150)}` : '')
  )
}
console.log(`\n${results.length - failed}/${results.length} examples render`)
if (!results.length) console.log(serverLog.join('').slice(-2000))
process.exit(failed ? 1 : 0)
