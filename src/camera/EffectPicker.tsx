import { useEffect, useRef } from 'react'
import { FILTERS, FILTER_GROUPS, filterById, filterHasStrength } from '../render/filters'
import { LENSES, NO_LENS, lensById, lensHasStrength } from '../render/lens'
import { NO_MOTION } from '../render/motion'
import { drawStickerThumb, stickerById, type StickerId } from '../effects/faceStickers'

export type EffectTab = 'filter' | 'lensa' | 'stiker'

type Props = {
  tab: EffectTab
  lensAvailable: boolean
  thumbs: Record<string, string>
  filterId: string
  onFilter: (id: string) => void
  lensId: string
  onLens: (id: string) => void
  motionId: string
  onMotion: (id: string) => void
  /** petak grid stiker dari kamera langsung */
  liveTile?: TileDraw
  disabled?: boolean
}

const LENS_ITEMS = [{ id: NO_LENS, name: 'tanpa' }, ...LENSES.map((l) => ({ id: l.id, name: l.name }))]

/** tombol segmen filter / lensa / stiker (lensa butuh WebGL; stiker disembunyikan kalau model wajah gagal dimuat) */
export function EffectTabs({ tab, onTab, lensAvailable, stickers = true }: { tab: EffectTab; onTab: (t: EffectTab) => void; lensAvailable: boolean; stickers?: boolean }) {
  const tabs = (['filter', 'lensa', 'stiker'] as EffectTab[]).filter((t) => (t !== 'lensa' || lensAvailable) && (t !== 'stiker' || stickers))
  return (
    <div role="tablist" aria-label="efek" className="inline-flex rounded-full border border-line bg-white p-1">
      {tabs.map((t) => {
        const on = tab === t
        return (
          <button
            key={t}
            role="tab"
            aria-selected={on}
            onClick={() => onTab(t)}
            className={`h-8 rounded-full px-3.5 text-[14px] font-semibold transition-colors ${on ? 'bg-ink text-white' : 'text-ink hover:bg-ivory'}`}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** grid stiker wajah 3×3 ala Photo Booth: "normal" (tanpa stiker) di tengah */
const GRID: (StickerId | null)[] = ['hearts', 'stars', 'birds', 'butterfly', null, 'bubbles', 'notes', 'sparkle', 'petals']
const TILE_W = 112
const TILE_H = 64
/** resolusi kanvas petak: kecil supaya ringan, tapi cukup tajam di layar retina */
const TILE_PX = typeof devicePixelRatio === 'number' ? Math.min(2, Math.max(1, devicePixelRatio)) : 1

/**
 * gambar petak dari kamera langsung + stiker di wajah yang terdeteksi (seperti Photo Booth);
 * mengembalikan false kalau kamera belum siap (dipakai gambar kartun)
 */
export type TileDraw = (ctx: CanvasRenderingContext2D, id: StickerId | null, w: number, h: number, now: number) => boolean

/**
 * Grid stiker wajah. Tiap petak menampilkan kamera langsung dengan stikernya masing-masing, digambar dalam satu loop
 * ±15 fps di resolusi kecil, hanya selama grid tampil. Panah ← → ↑ ↓ berpindah dalam grid 3×3.
 */
export function StickerGrid({ value, onChange, disabled, liveTile }: { value: string; onChange: (id: string) => void; disabled?: boolean; liveTile?: TileDraw }) {
  const canvases = useRef<(HTMLCanvasElement | null)[]>([])
  const grid = useRef<HTMLDivElement>(null)
  const liveRef = useRef(liveTile)
  liveRef.current = liveTile
  useEffect(() => {
    const w = Math.round(TILE_W * TILE_PX)
    const h = Math.round(TILE_H * TILE_PX)
    const draw = (now: number) =>
      canvases.current.forEach((c, i) => {
        if (!c) return
        const ctx = c.getContext('2d')!
        if (!liveRef.current?.(ctx, GRID[i], w, h, now)) drawStickerThumb(ctx, GRID[i], w, reducedMotion() ? 0.9 : now / 1000, h)
      })
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last > 66) {
        last = now
        draw(now)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const index = Math.max(0, GRID.findIndex((id) => (id ?? NO_MOTION) === value))
  const pick = (i: number) => onChange(GRID[i] ?? NO_MOTION)
  const onKey = (e: React.KeyboardEvent) => {
    const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[e.key]
    if (d === undefined) return
    e.preventDefault()
    const j = index + d
    if (j < 0 || j >= GRID.length || (Math.abs(d) === 1 && Math.floor(j / 3) !== Math.floor(index / 3))) return
    pick(j)
    grid.current?.querySelector<HTMLElement>(`[data-i="${j}"]`)?.focus()
  }

  return (
    <div ref={grid} role="listbox" aria-label="stiker wajah" onKeyDown={onKey} className="grid grid-cols-3 gap-2">
      {GRID.map((id, i) => {
        const name = id ? (stickerById(id)?.name ?? id) : 'normal'
        const on = i === index
        return (
          <button
            key={id ?? 'normal'}
            type="button"
            role="option"
            aria-selected={on}
            aria-label={name}
            data-i={i}
            tabIndex={on ? 0 : -1}
            disabled={disabled}
            onClick={() => pick(i)}
            className="group relative block overflow-hidden rounded-[12px] bg-line disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            style={{ aspectRatio: `${TILE_W} / ${TILE_H}`, boxShadow: on ? '0 0 0 2px #F7F6F2, 0 0 0 4px #111111' : undefined }}
          >
            <canvas
              ref={(c) => {
                canvases.current[i] = c
              }}
              width={Math.round(TILE_W * TILE_PX)}
              height={Math.round(TILE_H * TILE_PX)}
              className="h-full w-full"
              aria-hidden="true"
            />
            <span
              className={`absolute bottom-1 left-1 rounded-full bg-black/55 px-1.5 py-[3px] text-[10px] leading-none text-white ${on ? 'font-bold' : ''}`}
              aria-hidden="true"
            >
              {name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Satu baris thumbnail efek yang bisa digeser (desktop & HP). Nama grup filter jadi label kecil di awal tiap grup.
 * Thumbnail dari frame kamera terakhir; yang aktif bercincin tinta.
 */
export function EffectStrip(p: Props) {
  if (p.tab === 'stiker') return <StickerGrid value={p.motionId} onChange={p.onMotion} disabled={p.disabled} liveTile={p.liveTile} />
  return <EffectRow {...p} />
}

function EffectRow(p: Props) {
  const row = useRef<HTMLDivElement>(null)
  const activeId = p.tab === 'filter' ? p.filterId : p.lensId
  // efek aktif (mis. lewat ← →) selalu terlihat di baris
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>('[aria-checked="true"]')
    const r = row.current
    if (!el || !r) return
    const left = el.offsetLeft - r.offsetLeft
    if (left < r.scrollLeft || left + el.offsetWidth > r.scrollLeft + r.clientWidth)
      r.scrollTo({ left: left - r.clientWidth / 2 + el.offsetWidth / 2, behavior: reducedMotion() ? 'auto' : 'smooth' })
  }, [activeId, p.tab])

  const item = (id: string, name: string, on: boolean, onClick: () => void, thumb?: string) => (
    <button
      key={id}
      role="radio"
      aria-checked={on}
      disabled={p.disabled}
      onClick={onClick}
      className="group flex w-16 shrink-0 flex-col items-center gap-1.5 disabled:opacity-50"
    >
      <span
        className={`block h-16 w-16 overflow-hidden rounded-[14px] bg-line motion-safe:transition-shadow ${on ? '' : 'group-hover:opacity-85'}`}
        style={on ? { boxShadow: '0 0 0 3px #F7F6F2, 0 0 0 5px #111111' } : undefined}
      >
        {thumb && <img src={thumb} alt="" className="h-full w-full object-cover" draggable={false} />}
      </span>
      <span className={`w-full truncate text-center text-[12px] leading-tight ${on ? 'font-bold text-ink' : 'text-muted'}`}>{name}</span>
    </button>
  )

  const groupLabel = (g: string) => (
    <span key={`g-${g}`} className="flex h-16 shrink-0 items-center font-mono text-[10px] whitespace-nowrap text-muted" aria-hidden="true">
      {g}
    </span>
  )

  return (
    <div
      ref={row}
      role="radiogroup"
      aria-label={p.tab}
      className="-mx-8 flex items-start gap-3 overflow-x-auto px-8 pt-1.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {p.tab === 'filter'
        ? FILTER_GROUPS.map((g) => [
            groupLabel(g),
            ...FILTERS.filter((f) => f.group === g).map((f) => item(f.id, f.name, p.filterId === f.id, () => p.onFilter(f.id), p.thumbs[`f:${f.id}`])),
          ])
        : LENS_ITEMS.map((l) => item(l.id, l.name, p.lensId === l.id, () => p.onLens(l.id), p.thumbs[`l:${l.id}`]))}
    </div>
  )
}

/** slider kekuatan 0–100 untuk efek di tab aktif. tetap tampil (nonaktif) kalau efeknya tidak punya kekuatan, supaya tata letak tidak lompat */
export function StrengthSlider({
  tab,
  filterId,
  filterStrength,
  onFilterStrength,
  lensId,
  lensStrength,
  onLensStrength,
}: {
  tab: EffectTab
  filterId: string
  filterStrength: number
  onFilterStrength: (v: number) => void
  lensId: string
  lensStrength: number
  onLensStrength: (v: number) => void
}) {
  const lens = lensById(lensId)
  const filter = filterById(filterId)
  const isFilter = tab === 'filter'
  const enabled = isFilter ? filterHasStrength(filter) : !!lens && lensHasStrength(lens)
  const value = isFilter ? filterStrength : lensStrength
  const name = isFilter ? filter.name : (lens?.name ?? 'tanpa lensa')
  return (
    <label className={`flex flex-col gap-1.5 ${enabled ? '' : 'opacity-45'}`}>
      <span className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">kekuatan</span>
        <span className="font-mono text-[12px] tabular-nums text-ink">{enabled ? value : '–'}</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={enabled ? value : 100}
        disabled={!enabled}
        onChange={(e) => (isFilter ? onFilterStrength : onLensStrength)(Number(e.target.value))}
        aria-label={`kekuatan ${name}`}
        className="h-5 w-full cursor-pointer accent-ink disabled:cursor-default"
      />
    </label>
  )
}
