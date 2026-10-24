// Editor stiker layar penuh: tempel stiker bilik atau tulisan sendiri, geser (jari/mouse), cubit dua jari untuk
// ukuran & putaran (scroll di desktop), cerminkan, gandakan, ke depan/belakang, hapus, dan urungkan.
import { useDeferredValue, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode, type WheelEvent as RWheelEvent } from 'react'
import { Button } from './Button'
import { defaultSize, loadStickerFonts, STICKER_PACKS, stickerName, stickerPreview, TEXT_STYLES, textKind, type Sticker } from '../lib/stickers'

type Props = {
  /** gambar hasil asli (tanpa stiker) */
  src: string
  width: number
  height: number
  initial: Sticker[]
  /** kategori template yang dipakai: kelompok stiker ini yang terbuka duluan */
  category?: string
  onDone: (list: Sticker[]) => void
  onCancel: () => void
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const MIN_SIZE = 0.03
const MAX_SIZE = 0.8
/** tab tulisan sendiri (di depan tab kategori) */
const WRITE = 'tulis'
const MAX_TEXT = 24

type Pt = { x: number; y: number }
type Pinch = { id: number; d0: number; a0: number; size0: number; rot0: number }

function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const ICON = {
  undo: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  rotate: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  flip: 'M12 3v18M8 7 3 12l5 5V7zM16 7l5 5-5 5V7z',
  copy: 'M8 8h12v12H8zM16 8V4H4v12h4',
  front: 'M12 3 2 8l10 5 10-5-10-5zM2 16l10 5 10-5',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
}

export function StickerEditor({ src, width, height, initial, category, onDone, onCancel }: Props) {
  const [list, setList] = useState<Sticker[]>(initial)
  const listRef = useRef(list)
  listRef.current = list
  const [sel, setSel] = useState<number | null>(initial.at(-1)?.id ?? null)
  const selRef = useRef(sel)
  selRef.current = sel
  // riwayat untuk "urungkan": salinan daftar stiker sebelum tiap perubahan
  const [history, setHistory] = useState<Sticker[][]>([])
  const box = useRef<HTMLDivElement>(null)
  const nextId = useRef(Math.max(0, ...initial.map((s) => s.id)) + 1)
  // ukuran tampil gambar: dimuat utuh (contain) di area tengah
  const area = useRef<HTMLDivElement>(null)
  const [disp, setDisp] = useState({ w: 0, h: 0 })
  // stiker tulisan digambar dengan font bilik: tunggu fontnya siap supaya gambarnya tidak memakai font cadangan
  const [fontsReady, setFontsReady] = useState(false)
  useEffect(() => {
    let alive = true
    loadStickerFonts().then(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])
  const [pack, setPack] = useState(() => (STICKER_PACKS.some((p) => p.id === category) ? category! : STICKER_PACKS[0].id))
  const items = (STICKER_PACKS.find((p) => p.id === pack) ?? STICKER_PACKS[0]).items
  const [text, setText] = useState('')
  const typed = useDeferredValue(text.trim())
  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    const fit = () => {
      const r = el.getBoundingClientRect()
      const k = Math.min((r.width - 32) / width, (r.height - 32) / height)
      setDisp({ w: Math.max(0, Math.floor(width * k)), h: Math.max(0, Math.floor(height * k)) })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height])

  /** simpan keadaan sekarang sebelum berubah (paling banyak 40 langkah) */
  const snap = () => {
    // ambil sekarang juga: fungsi updater baru dijalankan saat render berikutnya, saat daftar sudah berubah
    const cur = listRef.current
    setHistory((h) => [...h.slice(-39), cur])
  }
  const undo = () => {
    const prev = history.at(-1)
    if (!prev) return
    setHistory((h) => h.slice(0, -1))
    setList(prev)
    if (!prev.some((s) => s.id === selRef.current)) setSel(prev.at(-1)?.id ?? null)
  }
  const update = (id: number, f: (s: Sticker) => Partial<Sticker>) => setList((l) => l.map((s) => (s.id === id ? { ...s, ...f(s) } : s)))

  const add = (kind: string) => {
    snap()
    const id = nextId.current++
    // muncul sedikit bergeser supaya stiker baru tidak menumpuk tepat di atas yang lama
    const k = list.length % 5
    setList((l) => [...l, { id, kind, x: 0.5 + (k - 2) * 0.06, y: 0.45 + (k - 2) * 0.04, size: defaultSize(kind), rot: 0 }])
    setSel(id)
  }

  const selected = list.find((s) => s.id === sel) ?? null
  const isTop = !!selected && list.at(-1)?.id === selected.id
  const act = {
    resize: (k: number) => selected && (snap(), update(selected.id, (s) => ({ size: clamp(s.size * k, MIN_SIZE, MAX_SIZE) }))),
    rotate: () => selected && (snap(), update(selected.id, (s) => ({ rot: (s.rot + 15) % 360 }))),
    flip: () => selected && (snap(), update(selected.id, (s) => ({ flip: !s.flip }))),
    copy: () => {
      if (!selected) return
      snap()
      const id = nextId.current++
      setList((l) => [...l, { ...selected, id, x: clamp(selected.x + 0.05, 0, 1), y: clamp(selected.y + 0.05, 0, 1) }])
      setSel(id)
    },
    // ke depan; kalau sudah paling depan, ke paling belakang
    order: () => {
      if (!selected) return
      snap()
      setList((l) => {
        const rest = l.filter((s) => s.id !== selected.id)
        return isTop ? [selected, ...rest] : [...rest, selected]
      })
    },
    remove: () => {
      if (!selected) return
      snap()
      setList((l) => l.filter((s) => s.id !== selected.id))
      setSel(null)
    },
    nudge: (dx: number, dy: number) => selected && update(selected.id, (s) => ({ x: clamp(s.x + dx, 0, 1), y: clamp(s.y + dy, 0, 1) })),
  }
  const actRef = useRef({ act, undo })
  actRef.current = { act, undo }

  // keyboard (desktop): ctrl/cmd+z urungkan, ctrl/cmd+d gandakan, delete hapus, panah geser
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      const { act, undo } = actRef.current
      const mod = e.ctrlKey || e.metaKey
      const step = e.shiftKey ? 0.05 : 0.01
      if (mod && e.key.toLowerCase() === 'z') undo()
      else if (mod && e.key.toLowerCase() === 'd') act.copy()
      else if (e.key === 'Delete' || e.key === 'Backspace') act.remove()
      else if (e.key === 'ArrowLeft') act.nudge(-step, 0)
      else if (e.key === 'ArrowRight') act.nudge(step, 0)
      else if (e.key === 'ArrowUp') act.nudge(0, -step)
      else if (e.key === 'ArrowDown') act.nudge(0, step)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---------- geser & cubit ----------
  const pts = useRef(new Map<number, Pt>())
  const drag = useRef<{ id: number; dx: number; dy: number; moved: boolean } | null>(null)
  const pinch = useRef<Pinch | null>(null)
  /** sentuhan di luar stiker yang belum jadi cubitan: kalau dilepas, pilihan stiker dibatalkan */
  const tap = useRef<Pt | null>(null)

  const rel = (p: Pt) => {
    const r = box.current!.getBoundingClientRect()
    return { x: (p.x - r.left) / r.width, y: (p.y - r.top) / r.height }
  }
  const two = () => {
    const [a, b] = [...pts.current.values()]
    return { d: Math.hypot(b.x - a.x, b.y - a.y), a: Math.atan2(b.y - a.y, b.x - a.x) }
  }
  const startPinch = (id: number) => {
    const s = listRef.current.find((x) => x.id === id)
    if (!s || pts.current.size < 2) return
    const g = two()
    if (g.d < 4) return
    snap()
    pinch.current = { id, d0: g.d, a0: g.a, size0: s.size, rot0: s.rot }
    drag.current = null
    tap.current = null
  }
  const onStickerDown = (e: RPointerEvent, s: Sticker) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pts.current.size === 1) {
      const p = rel({ x: e.clientX, y: e.clientY })
      drag.current = { id: s.id, dx: s.x - p.x, dy: s.y - p.y, moved: false }
      setSel(s.id)
    } else {
      // jari kedua: cubit stiker yang sedang dipegang/dipilih
      startPinch(drag.current?.id ?? selRef.current ?? s.id)
    }
  }
  const onAreaDown = (e: RPointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pts.current.size === 1) tap.current = { x: e.clientX, y: e.clientY }
    else {
      const id = drag.current?.id ?? selRef.current
      if (id !== null) startPinch(id)
    }
  }
  const onMove = (e: RPointerEvent) => {
    if (!pts.current.has(e.pointerId)) return
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const t = tap.current
    if (t && Math.hypot(e.clientX - t.x, e.clientY - t.y) > 8) tap.current = null
    const g = pinch.current
    if (g && pts.current.size >= 2) {
      const now = two()
      update(g.id, () => ({
        size: clamp((g.size0 * now.d) / g.d0, MIN_SIZE, MAX_SIZE),
        rot: (((g.rot0 + ((now.a - g.a0) * 180) / Math.PI) % 360) + 360) % 360,
      }))
      return
    }
    const d = drag.current
    if (!d) return
    if (!d.moved) {
      d.moved = true
      snap()
    }
    const p = rel({ x: e.clientX, y: e.clientY })
    update(d.id, () => ({ x: clamp(p.x + d.dx, 0, 1), y: clamp(p.y + d.dy, 0, 1) }))
  }
  const onUp = (e: RPointerEvent) => {
    pts.current.delete(e.pointerId)
    if (pts.current.size < 2) pinch.current = null
    if (pts.current.size === 0) {
      if (tap.current) setSel(null)
      tap.current = null
      drag.current = null
    }
  }
  // desktop: scroll = ukuran, shift+scroll = putar (satu langkah urungkan per rangkaian scroll)
  const lastWheel = useRef(0)
  const onWheel = (e: RWheelEvent) => {
    if (!selected) return
    const now = performance.now()
    if (now - lastWheel.current > 600) snap()
    lastWheel.current = now
    const dir = e.deltaY < 0 ? 1 : -1
    if (e.shiftKey) update(selected.id, (s) => ({ rot: (s.rot + dir * 5 + 360) % 360 }))
    else update(selected.id, (s) => ({ size: clamp(s.size * (dir > 0 ? 1.06 : 1 / 1.06), MIN_SIZE, MAX_SIZE) }))
  }

  const tool = (label: string, onClick: () => void, icon: string, o: { disabled?: boolean; className?: string } = {}) => (
    <button
      type="button"
      onClick={onClick}
      disabled={o.disabled ?? !selected}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12 text-white active:bg-white/25 disabled:opacity-35 lg:hover:bg-white/20 ${o.className ?? ''}`}
    >
      <Icon d={icon} />
    </button>
  )

  const thumb = (kind: string, label: string, wide: boolean, key: string): ReactNode => (
    <button
      key={key}
      type="button"
      onClick={() => add(kind)}
      aria-label={label}
      title={label}
      className="flex h-14 shrink-0 items-center justify-center rounded-[14px] px-1.5 active:bg-white/15 lg:hover:bg-white/10"
    >
      <img
        src={stickerPreview(kind, 96).url}
        alt=""
        draggable={false}
        className={wide ? 'h-9 w-auto max-w-[180px] object-contain' : 'h-12 w-12 object-contain'}
      />
    </button>
  )

  const tabs = [{ id: WRITE, name: 'tulis' }, ...STICKER_PACKS]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink text-white" role="dialog" aria-modal="true" aria-label="tambah stiker">
      <header className="pt-safe flex items-center justify-between gap-3 px-4 pb-2 lg:px-8 lg:pt-6">
        <button type="button" onClick={onCancel} className="h-11 rounded-full px-3 text-[15px] active:bg-white/10 lg:hover:bg-white/10">
          batal
        </button>
        <span className="label-mono text-center text-white/70">
          <span className="lg:hidden">geser · cubit dua jari</span>
          <span className="hidden lg:inline">geser · scroll untuk ukuran · shift+scroll putar</span>
        </span>
        <Button full={false} variant="light" className="h-11 px-5 text-[15px]" onClick={() => onDone(list)}>
          selesai
        </Button>
      </header>

      <div
        ref={area}
        className="flex min-h-0 flex-1 touch-none items-center justify-center select-none"
        onPointerDown={onAreaDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
      >
        {/* dipotong di tepi foto: yang terlihat sama dengan hasil PNG */}
        <div ref={box} className="relative overflow-hidden" style={{ width: disp.w, height: disp.h }}>
          <img src={src} alt="hasil foto" className="h-full w-full" draggable={false} />
          {fontsReady &&
            list.map((s) => {
              const pv = stickerPreview(s.kind)
              // ukuran relatif lebar gambar (sama dengan saat disatukan ke PNG)
              const k = s.size * disp.w
              return (
                <img
                  key={s.id}
                  src={pv.url}
                  alt=""
                  draggable={false}
                  role="button"
                  tabIndex={0}
                  aria-label={`stiker ${stickerName(s.kind)}`}
                  aria-pressed={s.id === sel}
                  onPointerDown={(e) => onStickerDown(e, s)}
                  onFocus={() => setSel(s.id)}
                  className={`absolute max-w-none cursor-grab rounded-[8px] ${s.id === sel ? 'outline-2 outline-offset-2 outline-accent outline-dashed' : ''}`}
                  style={{
                    left: `${s.x * 100}%`,
                    top: `${s.y * 100}%`,
                    width: pv.w * k,
                    height: pv.h * k,
                    transform: `translate(-50%, -50%) rotate(${s.rot}deg)${s.flip ? ' scaleX(-1)' : ''}`,
                  }}
                />
              )
            })}
        </div>
      </div>

      <div className="pb-safe flex flex-col gap-3 px-4 pt-2 lg:px-8 lg:pb-8">
        <div className="flex items-center justify-center gap-1.5 lg:gap-2">
          {tool('urungkan', undo, ICON.undo, { disabled: history.length === 0 })}
          <span className="mx-1 h-6 w-px bg-white/15" aria-hidden="true" />
          {tool('perkecil', () => act.resize(1 / 1.2), ICON.minus, { className: 'hidden lg:flex' })}
          {tool('perbesar', () => act.resize(1.2), ICON.plus, { className: 'hidden lg:flex' })}
          {tool('putar', act.rotate, ICON.rotate)}
          {tool('cerminkan', act.flip, ICON.flip)}
          {tool('gandakan', act.copy, ICON.copy)}
          {tool(isTop ? 'ke paling belakang' : 'ke paling depan', act.order, ICON.front)}
          {tool('hapus', act.remove, ICON.trash)}
        </div>
        <div
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0"
          role="tablist"
          aria-label="kategori stiker"
        >
          {tabs.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === pack}
              onClick={() => setPack(p.id)}
              className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] font-medium whitespace-nowrap ${
                p.id === pack ? 'bg-white text-ink' : 'bg-white/10 text-white active:bg-white/20 lg:hover:bg-white/20'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        {pack === WRITE ? (
          <div className="flex flex-col gap-2 lg:items-center" role="tabpanel" aria-label="tulis stiker sendiri">
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
              maxLength={MAX_TEXT}
              placeholder="ketik tulisanmu…"
              aria-label="tulisan stiker"
              enterKeyHint="done"
              className="h-11 w-full rounded-full bg-white/10 px-4 text-[16px] text-white placeholder:text-white/55 focus:bg-white/15 focus:outline-2 focus:outline-white/60 lg:w-[420px]"
            />
            <div className="-mx-4 flex min-h-14 gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0">
              {fontsReady && typed
                ? TEXT_STYLES.map((st) => thumb(textKind(st.id, typed), `tambah tulisan gaya ${st.name}`, true, st.id))
                : <p className="self-center text-[13px] text-white/70">tulis dulu, lalu pilih gayanya</p>}
            </div>
          </div>
        ) : (
          <div
            className="-mx-4 flex min-h-14 gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0"
            role="tabpanel"
            aria-label={`stiker ${pack}`}
          >
            {fontsReady && items.map((a) => thumb(a.id, `tambah stiker ${a.name}`, a.w > 1.5, a.id))}
          </div>
        )}
      </div>
    </div>
  )
}
