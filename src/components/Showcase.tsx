// Etalase beranda: deretan template melengkung (tengah paling besar & depan, pinggir makin kecil, miring, turun)
// yang berganti set (carousel). Kartu dirender dengan sistem Template (renderTemplate) + foto contoh, lalu muncul dengan fade saat siap.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { TEMPLATES, templateById, vibeById, type CatalogTemplate } from '../templates'
import { sampleRender as cardImage } from '../lib/sampleRender'

/**
 * 4 set × 7 template (desktop). HP memakai 5 di tengah.
 * pola format tiap set: 4r · strip · 4:5 · 4r (tengah) · 4:5 · strip · 4r, jumlah foto 1/3/4/6 bercampur, kategori berbeda.
 */
const SETS: string[][] = [
  ['travel-peta-rute', 'cute-awan', 'retro-koran-lama', 'y2k-folder-foto', 'dark-kartu-tarot', 'cute-permen', 'gaming-inventaris'],
  ['klasik-enam-frame', 'editorial-poster-film', 'meme-dicari', 'dark-sampul-album', 'bestie-kalender', 'pop-warna-tabrak', 'retro-lembar-kontak'],
  ['bestie-scrapbook', 'y2k-pemutar-media', 'cute-telinga-kelinci', 'meme-meme-grid', 'editorial-cover-majalah', 'travel-boarding-pass', 'kalcer-zine-fotokopian'],
  ['dark-papan-bukti', 'klasik-strip-hitam', 'gaming-kartu-karakter', 'pop-komik-4-panel', 'kalcer-tiket-gig', 'retro-film-negatif', 'editorial-kontributor'],
]

type Mode = {
  /** tinggi kartu, kemiringan (derajat), turun (px) per posisi, dari kiri ke kanan */
  h: number[]
  rot: number[]
  drop: number[]
  /** tumpukan antar kartu */
  overlap: number
  radius: number
  /** lebar acuan: area lebih sempit dari ini → etalase dikecilkan */
  refW: number
  maxK: number
  shadow: [center: string, side: string]
}

const DESKTOP: Mode = {
  h: [300, 350, 380, 440, 380, 350, 300],
  rot: [-15, -10, -5, 0, 5, 10, 15],
  drop: [70, 30, 8, 0, 8, 30, 70],
  overlap: 22,
  radius: 10,
  refW: 1400,
  maxK: 1.15,
  shadow: ['0 30px 60px -22px rgba(17,17,17,0.45), 0 8px 18px -8px rgba(17,17,17,0.25)', '0 16px 36px -18px rgba(17,17,17,0.32)'],
}
const PHONE: Mode = {
  h: [170, 205, 240, 205, 170],
  rot: [-12, -6, 0, 6, 12],
  drop: [30, 10, 0, 10, 30],
  overlap: 14,
  radius: 6,
  refW: 370,
  maxK: 1,
  shadow: ['0 18px 36px -14px rgba(17,17,17,0.45), 0 5px 12px -6px rgba(17,17,17,0.25)', '0 10px 22px -12px rgba(17,17,17,0.32)'],
}

const AUTO_MS = 5000
const IDLE_MS = 5000
/** ruang untuk kartu melayang (±6px) & naik saat hover (8px) */
const BREATHE = 16

/** set yang template-nya belum ada diganti template lain yang sudah ada */
function resolveSets(): CatalogTemplate[][] {
  const used = new Set(SETS.flat())
  const spare = TEMPLATES.filter((t) => !used.has(t.id))
  return SETS.map((ids) => ids.map((id) => templateById(id) ?? spare.shift() ?? TEMPLATES[0]))
}

export const cardLabel = (t: CatalogTemplate) => `${t.name}, ${vibeById(t.category)?.name.toLowerCase() ?? t.category}, ${t.photoCount} foto`

type Card = { t: CatalogTemplate; w: number; h: number; x: number; y: number; rot: number; z: number; slot: number }

/** posisi kartu (belum diskala), relatif ke tengah kartu tengah */
function layout(set: CatalogTemplate[], m: Mode): Card[] {
  const n = set.length
  const mid = (n - 1) / 2
  const ws = set.map((t, i) => (m.h[i] * t.width) / t.height)
  const xs = set.map(() => 0)
  for (let i = mid + 1; i < n; i++) xs[i] = xs[i - 1] + ws[i - 1] / 2 + ws[i] / 2 - m.overlap
  for (let i = mid - 1; i >= 0; i--) xs[i] = xs[i + 1] - ws[i + 1] / 2 - ws[i] / 2 + m.overlap
  return set.map((t, i) => ({ t, w: ws[i], h: m.h[i], x: xs[i], y: m.drop[i], rot: m.rot[i], z: n - Math.abs(i - mid), slot: i }))
}

/** batas atas & bawah deretan (termasuk tambahan karena miring) */
function vertical(cards: Card[]) {
  let top = Infinity
  let bottom = -Infinity
  for (const c of cards) {
    const r = (Math.abs(c.rot) * Math.PI) / 180
    const half = (c.h * Math.cos(r) + c.w * Math.sin(r)) / 2
    top = Math.min(top, c.y - half)
    bottom = Math.max(bottom, c.y + half)
  }
  return { top, bottom }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return reduced
}

// ---------- render kartu (sekali per template & resolusi, tidak memblokir tampilan) ----------
const idle = () => new Promise<void>((r) => ('requestIdleCallback' in window ? requestIdleCallback(() => r(), { timeout: 400 }) : setTimeout(r, 30)))

/** url gambar per template; set aktif dirender lebih dulu (tengah → pinggir), sisanya saat browser senggang */
function useCardImages(sets: CatalogTemplate[][], m: Mode, k: number, first: number) {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  // resolusi dibulatkan supaya tidak render ulang tiap perubahan ukuran kecil
  const plan = k
    ? sets.map((set, si) =>
        set
          .map((t, ci) => ({ t, ci, px: Math.min(1500, Math.ceil((m.h[ci] * k * dpr) / 100) * 100), offset: si * set.length + ci }))
          .sort((a, b) => Math.abs(a.ci - (set.length - 1) / 2) - Math.abs(b.ci - (set.length - 1) / 2)),
      )
    : []
  const sig = plan.flat().map((p) => `${p.t.id}@${p.px}`).join()
  const planRef = useRef(plan)
  planRef.current = plan
  const firstRef = useRef(first)
  firstRef.current = first
  useEffect(() => {
    if (!sig) return
    let alive = true
    const plan = planRef.current
    const order = [firstRef.current, ...plan.keys()].filter((v, i, a) => a.indexOf(v) === i)
    ;(async () => {
      for (const si of order) {
        for (const p of plan[si]) {
          if (!alive) return
          await idle()
          const url = await cardImage(p.t, p.px, p.offset)
          if (alive && url) setUrls((u) => (u[p.t.id] === url ? u : { ...u, [p.t.id]: url }))
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [sig])
  return urls
}

// ---------- komponen ----------
type Anim = { from: number | null; dir: 1 | -1; fromX: number; n: number }

export function Showcase({ onPick, phone, className = '' }: { onPick: (t: CatalogTemplate) => void; phone: boolean; className?: string }) {
  const [all] = useState(resolveSets)
  const m = phone ? PHONE : DESKTOP
  const sets = phone ? all.map((s) => s.slice(1, 6)) : all
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [anim, setAnim] = useState<Anim>({ from: null, dir: 1, fromX: 0, n: 0 })
  // animasi masuk terakhir yang sudah selesai (supaya tidak diputar ulang setelah geser dibatalkan)
  const [settled, setSettled] = useState(0)
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [hold, setHold] = useState(false) // kursor di atas / fokus di dalam etalase
  const [tick, setTick] = useState(0)
  const pausedUntil = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ W: 0, H: 0 })

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setSize({ W: el.clientWidth, H: el.clientHeight })
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // skala: muat setinggi area (tanpa terpotong atas-bawah); lebar boleh terpotong tepi layar, tapi dikecilkan di layar sempit
  const layouts = sets.map((s) => layout(s, m))
  const span = Math.max(...layouts.map((l) => vertical(l).bottom - vertical(l).top))
  const k = size.H ? Math.max(0, Math.min(m.maxK, (size.H - 2 * BREATHE) / span, size.W / m.refW)) : 0

  const urls = useCardImages(sets, m, k, index)

  const goTo = useCallback(
    (next: number, dir: 1 | -1, fromX = 0) => {
      const n = (next + sets.length) % sets.length
      if (n === index) return
      setAnim((a) => ({ from: index, dir, fromX, n: a.n + 1 }))
      setIndex(n)
    },
    [index, sets.length],
  )
  const step = useCallback((d: 1 | -1, fromX = 0) => goTo(index + d, d, fromX), [goTo, index])
  const interact = () => {
    pausedUntil.current = Date.now() + IDLE_MS
    setTick((t) => t + 1)
  }

  // set aktif baru dihitung tampil setelah semua kartunya selesai dirender
  const shown = sets[index].every((t) => !!urls[t.id])

  // rotasi otomatis tiap 5 detik: berhenti saat interaksi (lanjut 5 detik kemudian), saat disorot/fokus, dan saat tab tidak terlihat.
  // hitungan mulai saat kartu set ini tampil, bukan saat halaman dibuka
  useEffect(() => {
    if (reduced || hold || dragging || !shown) return
    const wait = Math.max(AUTO_MS, pausedUntil.current - Date.now())
    const t = setTimeout(() => {
      if (document.visibilityState === 'visible') step(1)
      else setTick((x) => x + 1)
    }, wait)
    return () => clearTimeout(t)
  }, [reduced, hold, dragging, shown, step, tick])

  // ---------- geser (drag di desktop, swipe di HP) ----------
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null)
  const moved = useRef(false)
  const onDown = (e: RPointerEvent) => {
    if (e.button !== 0) return
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
    moved.current = false
  }
  const onMove = (e: RPointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const mx = e.clientX - d.x
    if (!d.moved) {
      if (Math.abs(mx) < 8 || Math.abs(mx) < Math.abs(e.clientY - d.y)) return
      d.moved = moved.current = true
      stageRef.current?.setPointerCapture(e.pointerId)
      setDragging(true)
      interact()
    }
    setDx(mx)
  }
  const onUp = (e: RPointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== e.pointerId || !d.moved) return
    const mx = e.clientX - d.x
    // klik yang menyusul akhir geser diabaikan; setelah itu kartu bisa diklik lagi (mis. Enter dari keyboard)
    setTimeout(() => (moved.current = false), 0)
    setDragging(false)
    setDx(0)
    interact()
    if (Math.abs(mx) > 60) step(mx < 0 ? 1 : -1, mx)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    interact()
    step(e.key === 'ArrowRight' ? 1 : -1)
  }

  const layerStyle = (i: number): { style: CSSProperties; className: string } => {
    if (i === index) {
      const style: CSSProperties = dragging
        ? { transform: `translate3d(${dx}px,0,0)`, opacity: Math.max(0.35, 1 - Math.abs(dx) / 500) }
        : { transform: 'translate3d(0,0,0)', opacity: 1, transition: reduced ? undefined : 'transform 200ms ease-out, opacity 200ms ease-out' }
      const entering = !reduced && anim.n > settled && !dragging
      return { style, className: entering ? (anim.dir > 0 ? 'showcase-in-next' : 'showcase-in-prev') : '' }
    }
    if (i === anim.from && !reduced) {
      return {
        style: { opacity: 0, ['--from-x' as string]: `${anim.fromX}px`, pointerEvents: 'none' },
        className: anim.dir > 0 ? 'showcase-out-next' : 'showcase-out-prev',
      }
    }
    return { style: { opacity: 0, pointerEvents: 'none' }, className: '' }
  }

  const autoplay = !reduced && !hold

  return (
    <section
      aria-roledescription="carousel"
      aria-label="etalase template"
      tabIndex={0}
      onKeyDown={onKey}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        setHold(false)
        interact()
      }}
      onFocus={(e) => (e.target as Element).matches(':focus-visible') && setHold(true)}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        setHold(false)
        interact()
      }}
      className={`flex min-h-0 flex-col outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent ${className}`}
    >
      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 touch-pan-y select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-live={autoplay ? 'off' : 'polite'}
      >
        {k > 0 &&
          layouts.map((cards, i) => {
            const { style, className } = layerStyle(i)
            const active = i === index
            // kartu tidak aktif tidak melayang (hemat), kecuali set yang sedang keluar
            const bob = !reduced && (active || i === anim.from)
            const { top, bottom } = vertical(cards)
            const cy0 = size.H / 2 - ((top + bottom) / 2) * k
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`set ${i + 1} dari ${sets.length}`}
                aria-hidden={!active}
                inert={!active}
                className={`absolute inset-0 will-change-transform ${className}`}
                style={style}
                onAnimationEnd={(e) => active && e.target === e.currentTarget && setSettled(anim.n)}
              >
                {cards.map((c) => {
                  const w = c.w * k
                  const h = c.h * k
                  const cx = size.W / 2 + c.x * k
                  const cy = cy0 + c.y * k
                  const url = urls[c.t.id]
                  const center = c.slot === (cards.length - 1) / 2
                  return (
                    <div
                      key={c.t.id}
                      className="absolute top-0 left-0"
                      style={{
                        width: w,
                        height: h,
                        transform: `translate3d(${cx - w / 2}px, ${cy - h / 2}px, 0)`,
                        zIndex: c.z,
                        opacity: url ? 1 : 0,
                        transition: 'opacity 400ms ease-out',
                        pointerEvents: url ? undefined : 'none',
                      }}
                    >
                      <div
                        className={`h-full w-full ${bob ? 'etalase-bob' : ''}`}
                        style={bob ? { animationDuration: `${4 + ((c.slot * 0.83 + i * 0.4) % 2)}s`, animationDelay: `${-(c.slot * 1.37 + i * 0.6)}s` } : undefined}
                      >
                        <button
                          type="button"
                          aria-label={cardLabel(c.t)}
                          onClick={() => !moved.current && onPick(c.t)}
                          className="etalase-card block h-full w-full overflow-hidden bg-white p-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                          style={{ ['--rot' as string]: `${c.rot}deg`, borderRadius: m.radius, boxShadow: m.shadow[center ? 0 : 1] }}
                        >
                          {url && <img src={url} alt="" draggable={false} className="h-full w-full" style={{ borderRadius: 'inherit' }} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
    </section>
  )
}
