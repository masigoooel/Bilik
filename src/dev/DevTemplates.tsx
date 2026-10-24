// Halaman uji /dev/templates (hanya dev server): render template hasil desain vs file desain aslinya.
import { useEffect, useMemo, useRef, useState } from 'react'
import { renderTemplate, type PhotoSource } from '../render/renderTemplate'
import { FORMATS, fieldsOf } from '../templates'
import { DESIGN_CATEGORIES } from '../templates/designs'
import type { DesignCategory, DesignTemplate } from '../templates/designs/define'
import type { TextValues } from '../templates/types'

type Mode = 'samping' | 'tumpuk' | 'selisih'
type PhotoMode = 'contoh' | 'kosong'
type TextMode = 'desain' | 'contoh' | 'kosong'

const CUSTOM_TEXTS: Partial<TextValues> = { nama: 'igul', nama2: 'jerico', tempat: 'bandung', tanggal: '19 okt 2026', catatan: 'hari yang baik' }

/** foto contoh sintetis (potret), beda warna per slot */
function samplePhotos(): PhotoSource[] {
  return [12, 200, 140, 300, 40, 260].map((hue, i) => {
    const c = document.createElement('canvas')
    c.width = 900
    c.height = 1100
    const x = c.getContext('2d')!
    const g = x.createLinearGradient(0, 0, 900, 1100)
    g.addColorStop(0, `hsl(${hue},55%,72%)`)
    g.addColorStop(1, `hsl(${hue + 40},45%,42%)`)
    x.fillStyle = g
    x.fillRect(0, 0, 900, 1100)
    x.fillStyle = `hsl(${25 + i * 3},45%,${70 - i * 3}%)`
    x.beginPath()
    x.ellipse(450, 470, 190, 230, 0, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = '#2b2b2b'
    x.beginPath()
    x.ellipse(450, 1180, 420, 420, 0, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = '#222'
    x.beginPath()
    x.arc(385, 450, 18, 0, Math.PI * 2)
    x.arc(515, 450, 18, 0, Math.PI * 2)
    x.fill()
    x.strokeStyle = '#a33'
    x.lineWidth = 10
    x.beginPath()
    x.arc(450, 540, 70, 0.2, Math.PI - 0.2)
    x.stroke()
    return { source: c, width: 900, height: 1100 }
  })
}

function Render({ t, photos, texts, width }: { t: DesignTemplate; photos: PhotoSource[] | null; texts: Partial<TextValues>; width: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [ms, setMs] = useState<number | null>(null)
  useEffect(() => {
    let alive = true
    const t0 = performance.now()
    renderTemplate(t, { photos: photos ?? undefined, texts, scale: Math.min(2, (width * (window.devicePixelRatio || 1)) / t.width) }).then((c) => {
      if (!alive || !ref.current) return
      const dst = ref.current
      dst.width = c.width
      dst.height = c.height
      dst.getContext('2d')!.drawImage(c, 0, 0)
      setMs(performance.now() - t0)
    })
    return () => {
      alive = false
    }
  }, [t, photos, texts, width])
  return (
    <div className="relative">
      <canvas ref={ref} style={{ width, height: (width * t.height) / t.width, display: 'block' }} />
      {ms !== null && <span className="label-mono absolute right-1 bottom-1 rounded bg-black/60 px-1 text-[10px] text-white">{ms.toFixed(0)} ms</span>}
    </div>
  )
}

function Design({ t, cat, width }: { t: DesignTemplate; cat: DesignCategory; width: number }) {
  const k = width / t.width
  return (
    <div style={{ width, height: t.height * k, overflow: 'hidden', position: 'relative', background: '#fff' }}>
      <iframe
        title={`desain ${t.name}`}
        src={`/design-reference/${cat.folder}/${cat.reference[t.id]}.html`}
        style={{ width: t.width, height: t.height, border: 0, transform: `scale(${k})`, transformOrigin: '0 0', pointerEvents: 'none' }}
      />
    </div>
  )
}

export default function DevTemplates() {
  const [catId, setCatId] = useState(() => new URLSearchParams(location.search).get('c') ?? DESIGN_CATEGORIES.find((c) => c.templates.length)?.id ?? 'y2k')
  const cat = DESIGN_CATEGORIES.find((c) => c.id === catId) ?? DESIGN_CATEGORIES[0]
  const pick = (id: string) => {
    setCatId(id)
    history.replaceState(null, '', `?c=${id}`)
  }
  const [mode, setMode] = useState<Mode>('samping')
  const [photoMode, setPhotoMode] = useState<PhotoMode>('contoh')
  const [textMode, setTextMode] = useState<TextMode>('desain')
  const [opacity, setOpacity] = useState(50)
  const [width, setWidth] = useState(360)
  const photos = useMemo(() => (photoMode === 'contoh' ? samplePhotos() : null), [photoMode])

  const seg = <T extends string>(value: T, set: (v: T) => void, opts: T[]) => (
    <div className="inline-flex rounded-full border border-line bg-white p-1">
      {opts.map((o) => (
        <button key={o} onClick={() => set(o)} className={`h-8 rounded-full px-3 text-[13px] ${value === o ? 'bg-ink text-white' : 'hover:bg-ivory'}`}>
          {o}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-dvh bg-ivory p-6 text-ink">
      <h1 className="heading text-[32px] font-extrabold">uji template · {cat.folder}</h1>
      <p className="mt-1 text-[14px] text-muted">
        kiri: file desain (design-reference/{cat.folder}). kanan: render canvas dari src/templates/{cat.id}. {cat.templates.length} template
        {cat.complete ? ' · sudah dipakai aplikasi' : ' · belum dipakai aplikasi (kategori belum lengkap)'}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {DESIGN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => pick(c.id)}
            className={`h-9 rounded-full border px-3 text-[13px] ${c.id === cat.id ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:bg-ivory'}`}
          >
            {c.folder} <span className="opacity-60">{c.templates.length}{c.complete ? ' ✓' : ''}</span>
          </button>
        ))}
      </div>
      <div className="sticky top-0 z-10 mt-4 flex flex-wrap items-center gap-3 bg-ivory/95 py-3 backdrop-blur">
        {seg(mode, setMode, ['samping', 'tumpuk', 'selisih'])}
        {seg(photoMode, setPhotoMode, ['contoh', 'kosong'])}
        {seg(textMode, setTextMode, ['desain', 'contoh', 'kosong'])}
        {mode === 'tumpuk' && (
          <label className="label-mono flex items-center gap-2">
            render <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} /> {opacity}%
          </label>
        )}
        <label className="label-mono flex items-center gap-2">
          lebar <input type="range" min={200} max={700} value={width} onChange={(e) => setWidth(+e.target.value)} /> {width}px
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-10">
        {cat.templates.length === 0 && <p className="text-[14px] text-muted">belum ada template di kategori ini.</p>}
        {cat.templates.map((t) => {
          const texts = textMode === 'desain' ? (cat.sampleTexts[t.id] ?? {}) : textMode === 'contoh' ? CUSTOM_TEXTS : {}
          const fields = fieldsOf(t)
          return (
            <section key={t.id} className="rounded-[20px] border border-line bg-white p-5">
              <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="heading text-[22px] font-bold">{t.name}</h2>
                <span className="label-mono text-muted">
                  {t.id} · {t.photoCount} foto · {FORMATS[t.format].label} {t.width}×{t.height} · filter {t.filter} · field {fields.length ? fields.join(', ') : '—'}
                </span>
              </div>
              {mode === 'samping' ? (
                <div className="flex flex-wrap gap-6">
                  <figure>
                    <Design t={t} cat={cat} width={width} />
                    <figcaption className="label-mono mt-2 text-muted">desain</figcaption>
                  </figure>
                  <figure>
                    <Render t={t} photos={photos} texts={texts} width={width} />
                    <figcaption className="label-mono mt-2 text-muted">canvas</figcaption>
                  </figure>
                </div>
              ) : (
                <div className="relative" style={{ width }}>
                  <Design t={t} cat={cat} width={width} />
                  <div
                    className="absolute inset-0"
                    style={mode === 'tumpuk' ? { opacity: opacity / 100 } : { mixBlendMode: 'difference' }}
                  >
                    <Render t={t} photos={photos} texts={texts} width={width} />
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
