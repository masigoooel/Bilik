import type { FontSpec, Template } from '../templates/types'

export function fontString(font: string, size: number, weight = 400, italic = false) {
  return `${italic ? 'italic ' : ''}${weight} ${size}px ${font}, sans-serif`
}

const loaded = new Map<string, Promise<unknown>>()
const cssLoaded = new Map<string, Promise<void>>()

type Parsed = { family: string; css: string; faces: string[] }

/**
 * Spesifikasi font template:
 * - 'Silkscreen'                → 400
 * - 'Space Mono:400,700'        → 400 & 700
 * - 'Instrument Serif:400,400i' → 400 tegak & 400 italic
 * - { family, css, faces }      → parameter css2 Google Fonts mentah (mis. sumbu opsz Bodoni Moda)
 */
function parse(spec: FontSpec): Parsed {
  if (typeof spec !== 'string') return { family: spec.family, css: spec.css, faces: spec.faces }
  const [family, list] = spec.split(':').map((s) => s.trim())
  const items = (list ?? '400').split(',').map((s) => s.trim())
  const faces = items.map((it) => (it.endsWith('i') ? `italic ${it.slice(0, -1)}` : it))
  const fam = family.replace(/ /g, '+')
  const hasItalic = items.some((it) => it.endsWith('i'))
  const onlyRegular = items.length === 1 && items[0] === '400'
  let css = fam
  if (hasItalic) {
    const tuples = items.map((it) => (it.endsWith('i') ? `1,${it.slice(0, -1)}` : `0,${it}`)).sort()
    css = `${fam}:ital,wght@${tuples.join(';')}`
  } else if (!onlyRegular) {
    css = `${fam}:wght@${items.map(Number).sort((a, b) => a - b).join(';')}`
  }
  return { family, css, faces }
}

/** muat CSS Google Fonts sekali per parameter */
function loadGoogleCss(css: string): Promise<void> {
  let p = cssLoaded.get(css)
  if (!p) {
    p = new Promise<void>((resolve) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${css}&display=swap`
      link.onload = () => resolve()
      // offline / diblokir: tetap lanjut dengan font cadangan
      link.onerror = () => resolve()
      document.head.appendChild(link)
      setTimeout(resolve, 4000)
    })
    cssLoaded.set(css, p)
  }
  return p
}

function loadFace(key: string) {
  let p = loaded.get(key)
  if (!p) {
    p = document.fonts.load(key).catch(() => undefined)
    loaded.set(key, p)
  }
  return p
}

/** pastikan semua font yang dipakai template sudah dimuat sebelum menggambar ke kanvas */
export async function ensureFonts(t: Template): Promise<unknown> {
  if (typeof document === 'undefined' || !document.fonts) return
  const keys = new Set<string>()
  for (const tx of t.texts ?? []) keys.add(fontString(tx.font, 40, tx.weight, tx.italic))
  for (const d of t.decor ?? []) if (d.type === 'text') keys.add(fontString(d.font, 40, d.weight, d.italic))
  const jobs: Promise<unknown>[] = [...keys].map(loadFace)
  for (const spec of t.fonts ?? []) {
    const { family, css, faces } = parse(spec)
    jobs.push(loadGoogleCss(css).then(() => Promise.all(faces.map((f) => loadFace(`${f} 40px "${family}"`)))))
  }
  return Promise.all(jobs)
}
