import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Screen, Stage } from '../components/Screen'
import { TemplateThumb } from '../components/TemplateThumb'
import { PHOTO_COUNTS, templatesFor, type CatalogTemplate, type PhotoCount } from '../templates'
import { useApp } from '../state/AppState'

/** jeda antar foto (kilat + napas) di kamera, detik; sama dengan sesi foto sebenarnya */
const GAP_S = 0.65

/** ikon kecil susunan foto (46px, sel pertama pink) */
function Glyph({ n }: { n: PhotoCount }) {
  const cols = n === 1 ? 1 : n === 2 || n === 4 ? 2 : n === 3 ? 1 : 2
  const rows = Math.ceil(n / cols)
  return (
    <div
      className="grid h-[46px] w-[46px] shrink-0 gap-[3px] rounded-[10px] bg-ink p-[5px]"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      aria-hidden="true"
    >
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={`rounded-[2px] ${i === 0 ? 'bg-accent' : 'bg-white/85'}`} />
      ))}
    </div>
  )
}

/** 3 contoh template untuk jumlah foto ini, dari kategori berbeda: awal, tengah, akhir katalog */
function examplesFor(n: PhotoCount): CatalogTemplate[] {
  const all = templatesFor(n)
  const pick: CatalogTemplate[] = []
  for (const k of [0, 0.5, 1]) {
    const t = all[Math.round(k * (all.length - 1))]
    if (t && !pick.includes(t)) pick.push(t)
  }
  return pick
}

/** kiri (desktop): 3 contoh template seperti kipas — kiri -7°, tengah 0° paling depan, kanan +7° */
function CountStage({ n }: { n: PhotoCount }) {
  const all = templatesFor(n)
  const ex = examplesFor(n)
  // urutan tampil: [kiri, tengah, kanan]; contoh "tengah" katalog yang paling depan
  const [left, center, right] = ex.length === 3 ? [ex[0], ex[1], ex[2]] : [undefined, ex[0], ex[1]]
  // tinggi kartu tengah & samping; geser samping = setengah lebar tengah + setengah lebar samping − tumpukan 12% lebar tengah
  const CH = 'min(60dvh, 560px)'
  const SH = 'min(50dvh, 470px)'
  const cAr = center ? center.width / center.height : 0.8
  const card = (t: CatalogTemplate | undefined, pos: 'left' | 'center' | 'right') => {
    if (!t) return null
    const h = pos === 'center' ? CH : SH
    const ar = t.width / t.height
    const off = `calc(${CH} * ${cAr} * 0.38 + ${SH} * ${ar} * 0.5)`
    const x = pos === 'left' ? `calc(-1 * ${off})` : pos === 'right' ? off : '0px'
    const rot = pos === 'left' ? -7 : pos === 'right' ? 7 : 0
    return (
      <div
        className="absolute top-1/2 left-1/2"
        style={{ zIndex: pos === 'center' ? 2 : 1, transform: `translate(-50%, -50%) translateX(${x}) rotate(${rot}deg)` }}
      >
        <div
          className={`overflow-hidden rounded-[8px] ${pos === 'center' ? 'shadow-[0_30px_60px_-24px_rgba(17,17,17,0.45),0_8px_20px_-10px_rgba(17,17,17,0.25)]' : 'shadow-[0_18px_40px_-20px_rgba(17,17,17,0.35)]'}`}
          style={{ height: h, aspectRatio: `${t.width} / ${t.height}` }}
        >
          <TemplateThumb template={t} width={Math.round((420 * t.width) / t.height)} className="h-full" alt="" />
        </div>
      </div>
    )
  }
  const rest = Math.max(0, all.length - ex.length)

  // kipas dikecilkan kalau lebih lebar dari area (mis. tiga template 4:5 yang lebar)
  const fan = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(1)
  useLayoutEffect(() => {
    const el = fan.current
    if (!el) return
    const fit = () => {
      const vh = window.innerHeight
      const ch = Math.min(0.6 * vh, 560)
      const sh = Math.min(0.5 * vh, 470)
      const side = (t?: CatalogTemplate) => (t ? sh * (t.width / t.height) - ch * cAr * 0.12 : 0)
      // + ruang untuk kartu yang miring 7°
      const total = ch * cAr + side(left) + side(right) + 2 * sh * Math.sin((7 * Math.PI) / 180)
      setK(Math.min(1, (el.offsetWidth - 32) / total))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [left, right, cAr])
  return (
    <Stage>
      <div key={n} className="animate-fade-in flex h-full w-full flex-col items-center justify-center gap-8">
        <div ref={fan} className="relative h-[min(64dvh,600px)] w-full" aria-hidden="true" style={{ transform: `scale(${k})` }}>
          {card(left, 'left')}
          {card(right, 'right')}
          {card(center, 'center')}
        </div>
        <div className="text-center">
          <p className="heading text-[18px] font-extrabold">contoh template {n} foto</p>
          <p className="mt-1 font-mono text-[12px] text-muted">
            {ex.map((t) => t.name).join(' · ')}
            {rest > 0 && ` · dan ${rest} lainnya`}
          </p>
        </div>
      </div>
    </Stage>
  )
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent'

export function CountScreen() {
  const { count, setCount, go, timer } = useApp()
  const group = useRef<HTMLDivElement>(null)
  const next = () => count && go('template')

  // panah atas/bawah memindah pilihan (dan fokus), Enter = lanjut
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = count ? PHOTO_COUNTS.indexOf(count) : -1
    let j = i
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = Math.min(PHOTO_COUNTS.length - 1, i + 1)
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = Math.max(0, i - 1)
    else if (e.key === 'Home') j = 0
    else if (e.key === 'End') j = PHOTO_COUNTS.length - 1
    else if (e.key === 'Enter') {
      e.preventDefault()
      return next()
    } else return
    e.preventDefault()
    const n = PHOTO_COUNTS[j]
    setCount(n)
    group.current?.querySelector<HTMLElement>(`[data-n="${n}"]`)?.focus()
  }

  return (
    <Screen
      stage={<CountStage n={count ?? 4} />}
      panel={440}
      title="mau berapa foto?"
      subtitle="jumlah foto menentukan template yang bisa dipilih."
      footer={
        <button
          type="button"
          disabled={!count}
          onClick={next}
          className={`flex h-[60px] w-full items-center justify-center rounded-full bg-accent text-[19px] font-bold tracking-[-0.01em] text-white transition-[filter] hover:brightness-[0.92] disabled:bg-[#D9D6CF] disabled:text-muted disabled:hover:brightness-100 ${focusRing}`}
        >
          {count ? `lanjut · ${count} foto` : 'pilih jumlah foto'}
        </button>
      }
    >
      <div ref={group} className="flex flex-col gap-2.5" role="radiogroup" aria-label="jumlah foto" onKeyDown={onKey}>
        {PHOTO_COUNTS.map((n) => {
          const active = count === n
          const templates = templatesFor(n).length
          // durasi sesi: tiap foto = hitung mundur timer + jeda, dibulatkan
          const secs = Math.round(n * (timer + GAP_S))
          return (
            <button
              key={n}
              type="button"
              data-n={n}
              role="radio"
              aria-checked={active}
              tabIndex={active || (!count && n === PHOTO_COUNTS[0]) ? 0 : -1}
              onClick={() => setCount(n)}
              className={`flex items-center gap-4 rounded-[16px] bg-white px-4 py-3.5 text-left transition-shadow ${focusRing} ${
                active ? 'shadow-[0_0_0_2.5px_#FF3E8A]' : 'shadow-[0_0_0_1px_#E2E0DA] active:bg-ivory lg:hover:shadow-[0_0_0_1px_#CFCCC4]'
              }`}
            >
              <Glyph n={n} />
              <div className="min-w-0 flex-1">
                <div className="heading text-[22px] leading-tight font-extrabold">{n} foto</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted">
                  {templates} template · sesi ±{secs} detik
                </div>
              </div>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-accent' : 'border-[#CFCCC4]'}`}
                aria-hidden="true"
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
              </span>
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
