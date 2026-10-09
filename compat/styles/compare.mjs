// Serves the two builds and compares the computed style of every element of
// every case, in the light and the dark theme. Usage: node compare.mjs <dir>
import http from 'http'
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright-core'

const work = path.resolve(process.argv[2])
// 'Image' decides between its skeleton and the image by the time the file
// loads, so its element count changes between runs.
const SKIP = new Set(['Image'])

const serve = (dir) =>
  new Promise((resolve) => {
    const types = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css'
    }
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://x').pathname
      const file = path.join(dir, url === '/' ? 'index.html' : url)
      if (
        !file.startsWith(dir) ||
        !fs.existsSync(file) ||
        fs.statSync(file).isDirectory()
      ) {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, {
        'content-type': types[path.extname(file)] || 'application/octet-stream'
      })
      fs.createReadStream(file).pipe(res)
    })
    server.listen(0, () => resolve({ server, port: server.address().port }))
  })

const grab = async (browser, port, theme) => {
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 900 } })
  ).newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message.slice(0, 120)))
  await page.goto(`http://localhost:${port}/?theme=${theme}`)
  // no animation, so a frame in the middle of one is not a difference
  await page.addStyleTag({
    content:
      '*, *::before, *::after { animation: none !important; transition: none !important; }'
  })
  await page.waitForTimeout(800)
  const data = await page.evaluate(() => {
    const out = {}
    for (const section of document.querySelectorAll('section[data-case]')) {
      const rows = []
      const walk = (element, trail) => {
        const style = getComputedStyle(element)
        const props = {}
        for (const name of style) props[name] = style.getPropertyValue(name)
        rows.push([`${trail}>${element.tagName}`, props])
        Array.from(element.children).forEach((child, i) =>
          walk(child, `${trail}>${element.tagName}${i}`)
        )
      }
      Array.from(section.children).forEach((child, i) => walk(child, String(i)))
      out[section.dataset.case] = rows
    }
    return out
  })
  await page.close()
  return { data, errors }
}

const layered = await serve(path.join(work, 'dist-layered'))
const source = await serve(path.join(work, 'dist-source'))
const browser = await chromium.launch({ channel: 'chrome' })
let failed = 0

for (const theme of ['light', 'dark']) {
  const a = await grab(browser, layered.port, theme)
  const b = await grab(browser, source.port, theme)
  const cases = Object.keys(b.data).filter((name) => !SKIP.has(name))
  const diffs = []
  for (const name of cases) {
    const x = a.data[name] || []
    const y = b.data[name]
    if (x.length !== y.length) {
      diffs.push(
        `${name}: ${x.length} elements in the package, ${y.length} in the source`
      )
      continue
    }
    const list = []
    y.forEach(([trail, props], i) => {
      for (const prop of Object.keys(props))
        if (x[i][1][prop] !== props[prop])
          list.push(
            `${trail.split('>').pop()} ${prop}: package=${x[i][1][prop]} source=${props[prop]}`
          )
    })
    if (list.length)
      diffs.push(`${name} (${list.length}): ${list.slice(0, 3).join(' | ')}`)
  }
  const errors = [...a.errors, ...b.errors]
  console.log(
    `${theme}: ${cases.length} cases, ${diffs.length} with differences, ${errors.length} page errors`
  )
  diffs.forEach((line) => console.log(`  ${line}`))
  errors.forEach((line) => console.log(`  error: ${line}`))
  failed += diffs.length + errors.length
}

await browser.close()
layered.server.close()
source.server.close()
process.exit(failed ? 1 : 0)
