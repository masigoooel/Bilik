// Cetak hasil di kertas 4R (4×6 inci, ukuran foto standar & printer photobox).
// strip 2×6 → dua strip berdampingan (tinggal digunting, seperti photobox klasik); 4r → penuh; 4:5 → di tengah.
import type { Format } from '../templates/layouts'

const PAPER = { w: 4, h: 6 }

function layout(format: Format, url: string) {
  if (format === 'strip') {
    const img = `<img src="${url}" style="width:2in;height:6in;display:block" />`
    return `<div style="display:flex;width:4in;height:6in">${img}${img}</div>`
  }
  if (format === '4r') return `<img src="${url}" style="width:4in;height:6in;display:block" />`
  // 4:5 (1080×1350) → 4×5 inci di tengah kertas 4×6
  return `<div style="width:4in;height:6in;display:flex;align-items:center;justify-content:center"><img src="${url}" style="width:4in;height:5in;display:block" /></div>`
}

/** buka dialog cetak browser untuk hasil (url gambar) dengan tata letak sesuai format template */
export function printResult(url: string, format: Format): Promise<void> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'
    document.body.append(frame)
    const doc = frame.contentDocument!
    doc.open()
    doc.write(`<!doctype html><html><head><title>bilik</title><style>
      @page { size: ${PAPER.w}in ${PAPER.h}in; margin: 0 }
      html, body { margin: 0; padding: 0; background: #fff }
      img { image-rendering: auto }
    </style></head><body>${layout(format, url)}</body></html>`)
    doc.close()
    const done = () => {
      setTimeout(() => frame.remove(), 1000)
      resolve()
    }
    const imgs = [...doc.images]
    Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => (i.onload = i.onerror = r))))).then(() => {
      const w = frame.contentWindow!
      w.addEventListener('afterprint', done, { once: true })
      w.focus()
      w.print()
      // sebagian browser (iOS) tidak mengirim afterprint
      setTimeout(done, 60000)
    })
  })
}
