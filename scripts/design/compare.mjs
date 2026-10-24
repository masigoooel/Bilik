// Alat bantu memindahkan desain ke kode (jalankan dari folder bilik/).
// Butuh Chrome: set CHROME=path/ke/chrome bila bukan lokasi default Windows.
// bandingkan render canvas template vs screenshot desain:
// - di luar area slot foto (mengikuti radius slot), ambang beda 40
// - di dalam slot: slot diisi "foto" polos sewarna placeholder, ikon/label di tengah slot ditutup, ambang beda 8
//   (supaya bayangan inset / lapisan halus di atas foto ikut teruji)
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

// pakai (dev server di :5179, sesudah measure.mjs <folder>): node scripts/design/compare.mjs <kategori, mis. klasik> [filter-id]
import path from 'node:path'
const CAT = process.argv[2] ?? 'y2k'
const only = process.argv[3]


// protocolTimeout 0: satu kategori penuh bisa lebih dari 3 menit
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 0 })
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('ERR', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.setViewport({ width: 1400, height: 1000 })
await page.goto('http://localhost:5179/', { waitUntil: 'networkidle0' })

// hanya modul kategori ini yang dimuat, jadi kategori lain yang sedang error tidak ikut menggagalkan uji
const folder = await page.evaluate(async (id) => (await import(`/src/templates/${id}/index.ts`)).CATEGORY?.folder, CAT)
if (!folder) throw new Error(`kategori ${CAT} tidak ada`)
const REF = path.resolve('design-reference', folder, '_ref') + '/'
const OUT = REF + 'compare/'
fs.mkdirSync(OUT, { recursive: true })
const refs = Object.fromEntries(fs.readdirSync(REF).filter((f) => f.endsWith('.png')).map((f) => [f.replace('.png', ''), 'data:image/png;base64,' + fs.readFileSync(REF + f).toString('base64')]))

const results = await page.evaluate(async (refs, only, CAT) => {
  const cat = (await import(`/src/templates/${CAT}/index.ts`)).CATEGORY
  const { renderTemplate } = await import('/src/render/renderTemplate.ts')
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src })
  const out = []
  for (const t of cat.templates) {
    if (only && !t.id.includes(only)) continue
    if (!refs[cat.reference[t.id]]) { out.push({ id: t.id, error: 'acuan _ref tidak ada, jalankan measure.mjs' }); continue }
    const ref = await load(refs[cat.reference[t.id]])
    const c = await renderTemplate(t, { texts: cat.sampleTexts[t.id] ?? {} })
    const W = t.width, H = t.height
    const get = (src) => { const k = document.createElement('canvas'); k.width = W; k.height = H; const x = k.getContext('2d'); x.drawImage(src, 0, 0, W, H); return x.getImageData(0, 0, W, H) }
    const a = get(c), b = get(ref)
    const mask = document.createElement('canvas'); mask.width = W; mask.height = H
    const mx = mask.getContext('2d'); mx.fillStyle = '#000'
    for (const s of t.slots) { mx.save(); mx.translate(s.x + s.w / 2, s.y + s.h / 2); mx.rotate(((s.rotate ?? 0) * Math.PI) / 180); const r = s.radius ?? 0; mx.beginPath(); mx.roundRect(-s.w / 2 - 2, -s.h / 2 - 2, s.w + 4, s.h + 4, (Array.isArray(r) ? r : [r, r, r, r]).map((v) => (v ? v + 2 : 0))); mx.fill(); mx.restore() }
    const m = mx.getImageData(0, 0, W, H).data
    // dalam slot: foto polos sewarna placeholder, tutup 60%×70% tengah slot (ikon kamera + label FOTO di desain)
    const flat = document.createElement('canvas'); flat.width = flat.height = 8
    const fx = flat.getContext('2d'); fx.fillStyle = t.placeholder ?? '#E2E0DA'; fx.fillRect(0, 0, 8, 8)
    const cs = await renderTemplate(t, { texts: cat.sampleTexts[t.id] ?? {}, photos: t.slots.map(() => ({ source: flat, width: 8, height: 8 })) })
    const as = get(cs)
    const inner = document.createElement('canvas'); inner.width = W; inner.height = H
    const ix = inner.getContext('2d')
    for (const s of t.slots) {
      ix.save(); ix.translate(s.x + s.w / 2, s.y + s.h / 2); ix.rotate(((s.rotate ?? 0) * Math.PI) / 180)
      const r = s.radius ?? 0
      ix.fillStyle = '#000'; ix.beginPath(); ix.roundRect(-s.w / 2, -s.h / 2, s.w, s.h, Array.isArray(r) ? r : [r, r, r, r]); ix.fill()
      ix.globalCompositeOperation = 'destination-out'; ix.fillRect(-s.w * 0.3, -s.h * 0.35, s.w * 0.6, s.h * 0.7)
      ix.restore()
    }
    const im = ix.getImageData(0, 0, W, H).data
    let sBad = 0, sTotal = 0
    for (let i = 0; i < as.data.length; i += 4) {
      if (!im[i + 3]) continue
      sTotal++
      const d = (Math.abs(as.data[i] - b.data[i]) + Math.abs(as.data[i + 1] - b.data[i + 1]) + Math.abs(as.data[i + 2] - b.data[i + 2])) / 3
      if (d > 8) sBad++
    }
    const diff = new ImageData(W, H)
    let bad = 0, total = 0, sum = 0
    for (let i = 0; i < a.data.length; i += 4) {
      if (m[i + 3]) {
        // area slot: abu gelap; selisih dalam slot (lihat di atas) digambar biru
        const ds = im[i + 3] ? (Math.abs(as.data[i] - b.data[i]) + Math.abs(as.data[i + 1] - b.data[i + 1]) + Math.abs(as.data[i + 2] - b.data[i + 2])) / 3 : 0
        const v = Math.min(215, ds * 6)
        diff.data[i] = diff.data[i + 1] = 40; diff.data[i + 2] = 40 + v; diff.data[i + 3] = 255
        continue
      }
      total++
      const d = (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2])) / 3
      sum += d
      if (d > 40) bad++
      const v = Math.min(255, d * 3)
      diff.data[i] = 255; diff.data[i + 1] = 255 - v; diff.data[i + 2] = 255 - v; diff.data[i + 3] = 255
    }
    const dc = document.createElement('canvas'); dc.width = W; dc.height = H; dc.getContext('2d').putImageData(diff, 0, 0)
    // berdampingan: desain | render | selisih (merah = luar slot, biru = dalam slot)
    const sheet = document.createElement('canvas'); sheet.width = W * 3 + 40; sheet.height = H
    const sx = sheet.getContext('2d'); sx.fillStyle = '#888'; sx.fillRect(0, 0, sheet.width, H)
    sx.drawImage(ref, 0, 0, W, H); sx.drawImage(c, W + 20, 0); sx.drawImage(dc, 2 * W + 40, 0)
    out.push({ id: t.id, badPct: total ? (bad / total) * 100 : NaN, mean: total ? sum / total : NaN, slotPct: sTotal ? (sBad / sTotal) * 100 : NaN, sheet: sheet.toDataURL('image/png') })
  }
  return out
}, refs, only, CAT)

for (const r of results) {
  if (r.error) { console.log(`${r.id.padEnd(26)} ${r.error}`); continue }
  fs.writeFileSync(OUT + r.id + '.png', Buffer.from(r.sheet.split(',')[1], 'base64'))
  if (r.badPct == null || Number.isNaN(r.badPct)) { console.log(`${r.id.padEnd(26)} slot menutup seluruh kanvas: tidak ada piksel untuk dibandingkan, lihat gambarnya`); continue }
  console.log(`${r.id.padEnd(26)} piksel beda (>40/255): ${r.badPct.toFixed(2)}%  rata-rata selisih: ${r.mean.toFixed(2)}  dalam slot (>8/255): ${Number.isNaN(r.slotPct) ? '-' : r.slotPct.toFixed(2) + '%'}`)
}
await browser.close()
