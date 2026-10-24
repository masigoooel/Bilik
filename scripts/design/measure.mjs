// Alat bantu memindahkan desain ke kode (jalankan dari folder bilik/).
// Butuh Chrome: set CHROME=path/ke/chrome bila bukan lokasi default Windows.
// ukur file desain: slot foto + semua teks (posisi relatif kanvas desain), plus screenshot acuan
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// pakai: node scripts/design/measure.mjs <kategori> [awalan-file]
const DIR = path.resolve('design-reference', process.argv[2] ?? 'y2k-aesthetic')
const OUT = path.join(DIR, '_ref')
fs.mkdirSync(OUT, { recursive: true })
const only = process.argv[3]
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.html') && (!only || f.startsWith(only)))

const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
const all = {}
for (const f of files) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1300, height: 1900 })
  await page.goto(pathToFileURL(path.join(DIR, f)).href, { waitUntil: 'networkidle0' })
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1').then((h) => h.dispose())
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 400))
  const data = await page.evaluate(() => {
    const root = document.querySelector('x-dc > div')
    const R = root.getBoundingClientRect()
    const rel = (r) => ({ x: +(r.left - R.left).toFixed(1), y: +(r.top - R.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) })
    const slots = []
    for (const el of root.querySelectorAll('div')) {
      const label = [...el.children].find((c) => c.tagName === 'DIV' && /^(FOTO|STILL|DEPAN|SAMPING|LOOK|ADEGAN|PLAT|SPESIMEN|POTRET)/i.test(c.textContent.trim()) && !c.children.length)
      const hasSvg = [...el.children].some((c) => c.tagName.toLowerCase() === 'svg')
      if (!label || !hasSvg) continue
      const b = el.getBoundingClientRect()
      const cx = b.left + b.width / 2 - R.left
      const cy = b.top + b.height / 2 - R.top
      // transform elemen & induknya (scale/rotate): ukuran tampil = ukuran layout × skala, sudut dicatat terpisah
      let m = new DOMMatrix()
      for (let e = el; e && e !== root.parentElement; e = e.parentElement) {
        const t = getComputedStyle(e).transform
        if (t && t !== 'none') m = new DOMMatrix(t).multiply(m)
      }
      const scale = Math.hypot(m.a, m.b)
      const rotate = +((Math.atan2(m.b, m.a) * 180) / Math.PI).toFixed(2)
      const w = +(el.offsetWidth * scale).toFixed(1)
      const h = +(el.offsetHeight * scale).toFixed(1)
      const cs = getComputedStyle(el)
      slots.push({ label: label.textContent.trim(), x: +(cx - w / 2).toFixed(1), y: +(cy - h / 2).toFixed(1), w, h, radius: cs.borderRadius, bboxW: +b.width.toFixed(1), ...(rotate ? { rotate } : {}), ...(Math.abs(scale - 1) > 1e-3 ? { scale: +scale.toFixed(4) } : {}) })
    }
    const texts = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let n
    while ((n = walker.nextNode())) {
      const t = n.textContent.replace(/\s+/g, ' ').trim()
      if (!t) continue
      const el = n.parentElement
      if (el.closest('svg')) continue
      const range = document.createRange()
      range.selectNodeContents(n)
      const r = range.getBoundingClientRect()
      const cs = getComputedStyle(el)
      texts.push({ t, ...rel(r), font: cs.fontFamily.split(',')[0].replace(/['"]/g, ''), size: cs.fontSize, weight: cs.fontWeight, italic: cs.fontStyle === 'italic', color: cs.color, ls: cs.letterSpacing, lh: cs.lineHeight })
    }
    return { W: R.width, H: R.height, slots, texts }
  })
  const root = await page.$('x-dc > div')
  await root.screenshot({ path: path.join(OUT, f.replace('.html', '.png')) })
  await root.dispose()
  all[f] = data
  await page.close()
}
fs.writeFileSync(path.join(OUT, 'measure.json'), JSON.stringify(all, null, 1))
for (const [f, d] of Object.entries(all)) {
  console.log(`\n### ${f} ${d.W}x${d.H}`)
  for (const s of d.slots) console.log(`SLOT ${s.label}: x=${s.x} y=${s.y} w=${s.w} h=${s.h} r=${s.radius}${s.rotate ? ` rot=${s.rotate}°` : ''}${s.scale ? ` skala=${s.scale} (radius belum diskala)` : ''}${s.bboxW !== s.w ? ` (bbox ${s.bboxW})` : ''}`)
  for (const t of d.texts) console.log(`T "${t.t}" ${t.x},${t.y} ${t.w}x${t.h} ${t.font} ${t.size} ${t.weight}${t.italic ? ' italic' : ''} ${t.color}${t.ls !== 'normal' ? ' ls=' + t.ls : ''}`)
}
await browser.close()
