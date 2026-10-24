// Alat bantu memindahkan desain ke kode (jalankan dari folder bilik/).
// Butuh Chrome: set CHROME=path/ke/chrome bila bukan lokasi default Windows.
// cetak pohon elemen desain: posisi (relatif kanvas desain) + gaya penting
import puppeteer from 'puppeteer-core'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// pakai: node scripts/design/dump.mjs <kategori> <file.html>
const category = process.argv[2]
const file = process.argv[3]
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1300, height: 1900 })
await page.goto(pathToFileURL(path.resolve('design-reference', category, file)).href, { waitUntil: 'networkidle0' })
await page.waitForFunction(() => document.documentElement.dataset.ready === '1').then((h) => h.dispose())
await page.evaluate(() => document.fonts.ready)
const out = await page.evaluate(() => {
  const root = document.querySelector('x-dc > div')
  const R = root.getBoundingClientRect()
  const lines = []
  const short = (v) => v.replace(/rgba?\(([^)]+)\)/g, (m, a) => {
    const p = a.split(',').map((s) => s.trim())
    const hex = '#' + p.slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('')
    return p[3] !== undefined && p[3] !== '1' ? `${hex}/${p[3]}` : hex
  })
  const walk = (el, depth) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const isSlot = [...el.children].some((c) => /^(FOTO|STILL|DEPAN|SAMPING|LOOK|ADEGAN|PLAT|SPESIMEN|POTRET)/i.test(c.textContent.trim()) && !c.children.length) && [...el.children].some((c) => c.tagName === 'svg')
    const parts = [`${el.tagName.toLowerCase()} [${(r.left - R.left).toFixed(1)},${(r.top - R.top).toFixed(1)} ${r.width.toFixed(1)}x${r.height.toFixed(1)}]`]
    if (el.offsetWidth && (Math.abs(el.offsetWidth - r.width) > 0.5)) parts.push(`own ${el.offsetWidth}x${el.offsetHeight}`)
    if (cs.backgroundImage !== 'none') parts.push('bgi=' + short(cs.backgroundImage).slice(0, 220))
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') parts.push('bg=' + short(cs.backgroundColor))
    if (cs.borderTopWidth !== '0px' || cs.borderLeftWidth !== '0px' || cs.borderBottomWidth !== '0px' || cs.borderRightWidth !== '0px')
      parts.push(
        'border=' +
          ['Top', 'Right', 'Bottom', 'Left']
            .map((d) => (cs[`border${d}Width`] === '0px' || cs[`border${d}Style`] === 'none' ? '0' : `${cs[`border${d}Width`]} ${cs[`border${d}Style`]} ${short(cs[`border${d}Color`])}`))
            .join(' / '),
      )
    if (cs.borderRadius !== '0px') parts.push('r=' + cs.borderRadius)
    if (cs.boxShadow !== 'none') parts.push('sh=' + short(cs.boxShadow))
    if (cs.transform !== 'none') parts.push('tf=' + cs.transform)
    if (cs.opacity !== '1') parts.push('op=' + cs.opacity)
    if (cs.outlineStyle !== 'none') parts.push(`outline=${cs.outlineWidth} ${cs.outlineStyle} ${short(cs.outlineColor)} off=${cs.outlineOffset}`)
    if (cs.filter !== 'none') parts.push('filter=' + cs.filter)
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('').trim()
    if (own) parts.push(`"${own}" ${cs.fontFamily.split(',')[0]} ${cs.fontSize} ${cs.fontWeight}${cs.fontStyle === 'italic' ? ' italic' : ''} ${short(cs.color)}${cs.letterSpacing !== 'normal' ? ' ls=' + cs.letterSpacing : ''}${cs.textTransform !== 'none' ? ' tt=' + cs.textTransform : ''}`)
    lines.push('  '.repeat(depth) + parts.join(' | ') + (isSlot ? '  <<SLOT>>' : ''))
    if (isSlot || el.tagName === 'svg') return
    for (const c of el.children) walk(c, depth + 1)
  }
  walk(root, 0)
  return lines.join('\n')
})
console.log(out)
await browser.close()
