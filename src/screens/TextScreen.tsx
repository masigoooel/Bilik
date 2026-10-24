import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Shell, ScreenHeader } from '../components/Screen'
import { Logo } from '../components/Logo'
import { TemplateThumb } from '../components/TemplateThumb'
import { TextForm } from '../components/TextFields'
import { FORMATS, templateById, vibeById, type CatalogTemplate } from '../templates'
import { useApp } from '../state/AppState'
import { useStartCamera } from '../state/useStartCamera'
import { colorName, css, rotate, templatePalette, type Palette } from '../lib/palette'

/** pilihan warna aksen: putaran hue (derajat); maks. 6 supaya muat satu baris */
const HUES = [0, 60, 120, 180, 240, 300]

const ring = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent'

const infoLine = (t: CatalogTemplate) =>
  `${t.name} · ${vibeById(t.category)?.name.toLowerCase() ?? t.category} · ${t.photoCount} foto · ${FORMATS[t.format].label} ${t.width}×${t.height}`

/** pratinjau langsung, "contain" di dalam kotaknya; teks & warna ikut berubah (debounce 150ms di TemplateThumb) */
function LivePreview({ t, className = '' }: { t: CatalogTemplate; className?: string }) {
  const { renderTexts, hue } = useApp()
  const box = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setH(Math.floor(Math.min(el.clientHeight, (el.clientWidth * t.height) / t.width)))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [t])
  // resolusi render dibulatkan supaya tidak render ulang tiap perubahan ukuran kecil
  const w = Math.max(40, Math.ceil((h * t.width) / t.height / 40) * 40)
  return (
    <div ref={box} className={`relative flex min-h-0 items-center justify-center ${className}`}>
      {/* cahaya pink samar di belakang */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(closest-side, rgba(255,62,138,0.16), rgba(255,62,138,0.05) 55%, transparent)' }}
        aria-hidden="true"
      />
      {h > 0 && (
        <div className="relative shadow-[0_28px_60px_-24px_rgba(17,17,17,0.45),0_8px_20px_-10px_rgba(17,17,17,0.2)]" style={{ height: h, aspectRatio: `${t.width} / ${t.height}` }}>
          <TemplateThumb template={t} width={w} texts={renderTexts} hue={hue} className="h-full" alt={`pratinjau template ${t.name}`} />
        </div>
      )}
    </div>
  )
}

function TextStage({ t }: { t: CatalogTemplate }) {
  return (
    <aside className="relative hidden h-dvh min-h-0 flex-col bg-[#ECEAE5] lg:flex">
      <header className="flex h-[84px] shrink-0 items-center justify-between px-8">
        <Logo size={26} />
        <span className="font-mono text-[12px] text-muted">pratinjau langsung</span>
      </header>
      <LivePreview t={t} className="mx-10 flex-1" />
      <p className="shrink-0 px-8 pt-6 pb-8 text-center font-mono text-[12px] text-muted">{infoLine(t)}</p>
    </aside>
  )
}

function ColorPicker({ t }: { t: CatalogTemplate }) {
  const { hue, setHue } = useApp()
  const [pal, setPal] = useState<Palette | null>(null)
  useEffect(() => {
    let alive = true
    templatePalette(t).then((p) => alive && setPal(p))
    return () => {
      alive = false
    }
  }, [t])
  const options = HUES.map((h, i) => {
    const p = pal && rotate(pal, h)
    const name = h === 0 ? 'asli' : p ? colorName(p.accent) : `warna ${i + 1}`
    return { h, i, p, name, short: h === 0 ? 'asli' : String(i + 1) }
  })
  const current = options.find((o) => o.h === hue) ?? options[0]
  // nama warna bisa sama (mis. aksen template hitam-putih tidak berubah warna): pakai nomor supaya tetap bisa dibedakan
  const unique = (o: (typeof options)[number]) => o.h !== 0 && options.filter((x) => x.name === o.name).length === 1
  const display = (o: (typeof options)[number]) => (o.h === 0 ? 'asli' : unique(o) ? o.name : `warna ${o.i + 1}`)
  const label = (o: (typeof options)[number]) => (o.h === 0 ? 'warna asli' : unique(o) ? `warna ${o.i + 1}, ${o.name}` : `warna ${o.i + 1}`)

  const group = useRef<HTMLDivElement>(null)
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const j = (HUES.indexOf(current.h) + d + HUES.length) % HUES.length
    setHue(HUES[j])
    group.current?.querySelector<HTMLElement>(`[data-hue="${HUES[j]}"]`)?.focus()
  }

  return (
    <section className="mt-5" aria-labelledby="warna-label">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="warna-label" className="text-[14px] font-bold text-ink">
          warna template
        </h2>
        <span className="font-mono text-[11px] text-muted">{display(current)}</span>
      </div>
      <div
        ref={group}
        role="radiogroup"
        aria-label="warna template"
        onKeyDown={onKey}
        className="-mx-4 mt-2.5 flex gap-3 overflow-x-auto px-4 pt-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:justify-between lg:overflow-visible lg:px-0"
      >
        {options.map((o) => {
          const on = o.h === current.h
          return (
            <button
              key={o.h}
              type="button"
              role="radio"
              data-hue={o.h}
              aria-checked={on}
              aria-label={label(o)}
              tabIndex={on ? 0 : -1}
              onClick={() => setHue(o.h)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-[12px] ${ring}`}
            >
              <span className={`block rounded-full p-[3px] transition-shadow ${on ? 'shadow-[0_0_0_2px_#111111]' : ''}`}>
                <span
                  className="block h-[46px] w-[46px] rounded-full shadow-[inset_0_0_0_1px_rgba(17,17,17,0.12)]"
                  style={{ background: o.p ? `linear-gradient(135deg, ${css(o.p.bg)} 50%, ${css(o.p.accent)} 50%)` : '#E2E0DA' }}
                />
              </span>
              <span className={`text-[12px] ${on ? 'font-semibold text-ink' : 'text-muted'}`}>{o.short}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function TextScreen() {
  const { templateId } = useApp()
  const start = useStartCamera()
  const t = templateById(templateId)
  if (!t) return null

  const cta = (
    <button
      type="button"
      onClick={() => start()}
      className={`flex h-[60px] w-full items-center justify-center rounded-full bg-accent text-[19px] font-bold tracking-[-0.01em] text-white transition-[filter] hover:brightness-[0.92] ${ring}`}
    >
      lanjut ke kamera
    </button>
  )

  return (
    <Shell stage={<TextStage t={t} />} panel={440}>
      <div className="flex min-h-full flex-1 flex-col lg:min-h-0 lg:px-8 lg:pt-7 lg:pb-7">
        <ScreenHeader className="px-4 lg:static lg:min-h-11 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-0 lg:backdrop-blur-none" />
        {/* HP: pratinjau di atas (±40% layar) */}
        <div className="flex h-[40dvh] min-h-[220px] shrink-0 flex-col bg-[#ECEAE5] px-4 py-4 lg:hidden">
          <LivePreview t={t} className="flex-1" />
          <p className="mt-3 truncate text-center font-mono text-[11px] text-muted">{infoLine(t)}</p>
        </div>
        <main className="flex-1 px-4 pt-5 pb-6 lg:px-0 lg:pt-4 lg:pb-0">
          <h1 className="heading text-[36px] font-extrabold lg:text-[44px]">isi teks</h1>
          <p className="mt-1 text-[15px] leading-snug text-muted">muncul di template ini. boleh dikosongin.</p>
          <div className="mt-5">
            <TextForm template={t} onSubmit={() => start()} />
          </div>
          <ColorPicker t={t} />
        </main>
        <footer className="pb-safe sticky bottom-0 z-10 bg-ivory px-4 pt-3 lg:static lg:mt-5 lg:px-0 lg:pt-0 lg:pb-0">{cta}</footer>
      </div>
    </Shell>
  )
}
