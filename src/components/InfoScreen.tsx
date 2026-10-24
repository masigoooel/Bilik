// Kerangka laman informasi (tentang, privasi).
// Desktop (≥1024px): kiri visual di latar #ECEAE5, kanan panel 440px berisi baris berikon; hanya daftar yang scroll.
// HP: visual di atas (±30% layar), daftar di bawahnya, tombol menempel di bawah.
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Logo } from './Logo'
import { BackIcon } from './Screen'
import { useApp } from '../state/AppState'

export type InfoRow = { icon: ReactNode; title: string; body: ReactNode }

export const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent'
// teks 19px tebal = "teks besar" WCAG, jadi putih di atas pink (3.3:1) tetap lolos AA
export const pinkButton = `flex h-[60px] w-full items-center justify-center rounded-full bg-accent text-[19px] font-bold tracking-[-0.01em] text-white transition-[filter] hover:brightness-[0.92] ${focusRing}`

const stageBg: CSSProperties = { background: 'radial-gradient(circle at 50% 46%, rgba(255,62,138,0.10), rgba(255,62,138,0) 62%), #ECEAE5' }

/** ikon garis 18px (stroke mengikuti warna teks) */
export function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

/** daftar baris; di desktop hanya bagian ini yang scroll, dengan gradasi pudar 50px kalau masih ada isi di bawah */
function RowList({ rows }: { rows: InfoRow[] }) {
  const box = useRef<HTMLUListElement>(null)
  const [fade, setFade] = useState(false)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const on = () => setFade(el.scrollHeight - el.scrollTop - el.clientHeight > 2)
    on()
    el.addEventListener('scroll', on, { passive: true })
    const ro = new ResizeObserver(on)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', on)
      ro.disconnect()
    }
  }, [])
  return (
    <div className="relative lg:min-h-0 lg:flex-1">
      <ul ref={box} className="divide-y divide-line [scrollbar-width:thin] lg:h-full lg:overflow-y-auto">
        {rows.map((r) => (
          <li key={r.title} className="flex gap-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-white text-ink">{r.icon}</span>
            <div className="min-w-0">
              <h2 className="text-[17px] leading-snug font-bold text-ink">{r.title}</h2>
              <p className="mt-0.5 text-[14px] leading-snug text-muted">{r.body}</p>
            </div>
          </li>
        ))}
      </ul>
      {fade && <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[50px] bg-linear-to-b from-ivory/0 to-ivory lg:block" aria-hidden="true" />}
    </div>
  )
}

type Props = {
  title: string
  subtitle: string
  /** visual kolom kiri; mengisi kotaknya */
  visual: ReactNode
  caption: ReactNode
  rows: InfoRow[]
  /** di bawah daftar (mis. tautan) */
  after?: ReactNode
  /** tombol utama + (opsional) tautan kecil di bawahnya */
  footer: ReactNode
}

export function InfoScreen({ title, subtitle, visual, caption, rows, after, footer }: Props) {
  const { back } = useApp()
  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_440px] lg:overflow-hidden">
      <aside className="relative hidden h-dvh min-h-0 flex-col lg:flex" style={stageBg}>
        <header className="flex h-[84px] shrink-0 items-center px-8">
          <Logo size={26} />
        </header>
        <div className="relative mx-10 min-h-0 flex-1">{visual}</div>
        <p className="shrink-0 px-8 pt-6 pb-8 text-center font-mono text-[12px] text-muted">{caption}</p>
      </aside>

      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-ivory lg:h-dvh lg:min-h-0 lg:max-w-none lg:border-l lg:border-line lg:px-8 lg:pt-7 lg:pb-7">
        <header className="pt-safe flex shrink-0 items-center px-4 pb-3 lg:p-0">
          <button
            type="button"
            onClick={back}
            aria-label="kembali"
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-[inset_0_0_0_1px_#E2E0DA] transition-colors hover:bg-[#EFEDE8] ${focusRing}`}
          >
            <BackIcon />
          </button>
        </header>

        {/* HP: visual di atas */}
        <div className="flex h-[30dvh] min-h-[200px] shrink-0 flex-col px-4 pt-2 pb-3 lg:hidden" style={stageBg}>
          <div className="relative min-h-0 flex-1">{visual}</div>
          <p className="mt-2 text-center font-mono text-[11px] text-muted">{caption}</p>
        </div>

        <main className="flex flex-1 flex-col px-4 pt-5 pb-4 lg:min-h-0 lg:px-0 lg:pt-5 lg:pb-0">
          <h1 className="heading text-[36px] font-extrabold lg:text-[44px]">{title}</h1>
          <p className="mt-1 text-[15px] leading-snug text-muted">{subtitle}</p>
          <div className="mt-3 flex flex-1 flex-col lg:min-h-0">
            <RowList rows={rows} />
            {after && <div className="shrink-0 pt-3">{after}</div>}
          </div>
        </main>

        <footer className="pb-safe sticky bottom-0 z-10 flex shrink-0 flex-col items-center gap-2 bg-ivory px-4 pt-3 lg:static lg:mt-5 lg:px-0 lg:pt-0 lg:pb-0">{footer}</footer>
      </div>
    </div>
  )
}
