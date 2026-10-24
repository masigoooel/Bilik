import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon, InfoScreen, focusRing, pinkButton, type InfoRow } from '../components/InfoScreen'
import { FORMATS, PHOTO_COUNTS, TEMPLATES, VIBES, templateById } from '../templates'
import { FILTERS } from '../render/filters'
import { LENSES } from '../render/lens'
import { sampleRender } from '../lib/sampleRender'
import { useApp } from '../state/AppState'

/** kipas kiri, tengah, kanan: format & kategori berbeda */
const FAN = ['retro-polaroid-strip', 'cute-telinga-kelinci', 'bestie-scrapbook']
const TILT = 7
const SIDE = 0.78 // tinggi kartu samping relatif kartu tengah
const OVERLAP = 0.16 // tumpukan, relatif lebar kartu tengah

/** alamat masukan bisa diatur lewat VITE_FEEDBACK_URL; tanpa itu dibuka email baru dengan subjek berisi versi */
const FEEDBACK_URL = (import.meta.env.VITE_FEEDBACK_URL as string | undefined) || `mailto:?subject=${encodeURIComponent(`masukan bilik v${__APP_VERSION__}`)}`

/** "a, b, dan c" / "a, b, atau c" */
const list = (xs: string[], last = 'dan') => (xs.length < 3 ? xs.join(` ${last} `) : `${xs.slice(0, -1).join(', ')}, ${last} ${xs.at(-1)}`)

/** tiga template asli dengan foto contoh, disusun kipas -7°, 0°, 7° */
function TemplateFan() {
  const [cards] = useState(() => {
    const spare = TEMPLATES.filter((t) => !FAN.includes(t.id))
    return FAN.map((id, i) => templateById(id) ?? spare[i])
  })
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ W: 0, H: 0 })
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setSize({ W: el.clientWidth, H: el.clientHeight })
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ukuran: kartu tengah setinggi area (maks. 520), dikecilkan kalau kipas lebih lebar dari area
  const rad = (TILT * Math.PI) / 180
  const ar = cards.map((t) => t.width / t.height)
  const widthPerH = (() => {
    const cw = ar[1]
    const sw = (i: number) => SIDE * ar[i]
    const ext = (i: number) => cw / 2 + sw(i) - OVERLAP * cw + (SIDE * Math.sin(rad)) / 2
    return ext(0) + ext(2)
  })()
  const ch = size.H ? Math.max(0, Math.min(520, size.H * 0.9, (size.W - 16) / widthPerH)) : 0
  const px = Math.min(1400, Math.ceil((ch * Math.min(2, window.devicePixelRatio || 1)) / 100) * 100)

  const [urls, setUrls] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!px) return
    let alive = true
    // tengah dulu
    for (const i of [1, 0, 2]) {
      const t = cards[i]
      sampleRender(t, px, i * 2).then((u) => alive && u && setUrls((m) => (m[t.id] === u ? m : { ...m, [t.id]: u })))
    }
    return () => {
      alive = false
    }
  }, [cards, px])

  const cw = ch * ar[1]
  return (
    <div ref={box} className="absolute inset-0" aria-hidden="true">
      {ch > 0 &&
        cards.map((t, i) => {
          const center = i === 1
          const h = center ? ch : ch * SIDE
          const w = h * ar[i]
          const dir = i - 1
          const x = dir * (cw / 2 + w / 2 - OVERLAP * cw)
          const url = urls[t.id]
          return (
            <div
              key={t.id}
              className="absolute top-1/2 left-1/2 overflow-hidden rounded-[8px] bg-white"
              style={{
                width: w,
                height: h,
                zIndex: center ? 2 : 1,
                transform: `translate(-50%, -50%) translateX(${x}px) translateY(${center ? 0 : ch * 0.04}px) rotate(${dir * TILT}deg)`,
                boxShadow: center ? '0 30px 60px -24px rgba(17,17,17,0.45), 0 8px 20px -10px rgba(17,17,17,0.25)' : '0 18px 40px -20px rgba(17,17,17,0.35)',
                opacity: url ? 1 : 0,
                transition: 'opacity 400ms ease-out',
              }}
            >
              {url && <img src={url} alt="" draggable={false} className="h-full w-full" />}
            </div>
          )
        })}
    </div>
  )
}

export function AboutScreen() {
  const { go, reset, booth, startBoothSession } = useApp()
  const formats = Object.values(FORMATS).map((f) => f.label)
  const counts = PHOTO_COUNTS.map(String)
  const rows: InfoRow[] = [
    {
      icon: (
        <Icon>
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </Icon>
      ),
      title: 'cara pakainya',
      body: 'pilih jumlah foto dan template, isi tulisan kalau mau, lalu berpose di depan kamera. hasilnya bisa disimpan sebagai png, dibagikan, atau dicetak.',
    },
    {
      icon: (
        <Icon>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </Icon>
      ),
      title: 'banyak pilihan',
      body: `${TEMPLATES.length} template dalam ${VIBES.length} kategori, format ${list(formats)}, untuk ${list(counts, 'atau')} foto. ditambah ${FILTERS.filter((f) => f.id !== 'normal').length} filter warna dan ${LENSES.length} lensa.`,
    },
    {
      icon: (
        <Icon>
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          <path d="M9 12l2 2 4-4" />
        </Icon>
      ),
      title: 'fotomu tetap di perangkatmu',
      body: 'kamera, filter, dan template diproses langsung di browser. tanpa akun, tanpa unggah.',
    },
  ]

  const start = () => {
    if (booth.on) return void startBoothSession()
    reset()
    go('count')
  }

  return (
    <InfoScreen
      title="tentang"
      subtitle="bilik itu photobox yang jalan langsung di browser."
      visual={<TemplateFan />}
      caption="dibuat di Indonesia · 2026"
      rows={rows}
      after={
        <button type="button" onClick={() => go('privasi')} className={`py-1 font-mono text-[13px] text-ink underline-offset-4 hover:underline ${focusRing}`}>
          baca soal privasi →
        </button>
      }
      footer={
        <>
          <button type="button" onClick={start} className={pinkButton}>
            mulai foto
          </button>
          <a href={FEEDBACK_URL} {...(FEEDBACK_URL.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`py-1 font-mono text-[12px] text-muted underline-offset-4 hover:underline ${focusRing}`}>
            kirim masukan · versi {__APP_VERSION__}
          </a>
        </>
      }
    />
  )
}
