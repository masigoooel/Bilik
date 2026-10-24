import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Logo } from '../components/Logo'
import { Showcase } from '../components/Showcase'
import { useApp } from '../state/AppState'
import type { CatalogTemplate } from '../templates'

function useWide() {
  const q = '(min-width: 768px)'
  const [wide, setWide] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent'
// teks 19px tebal = "teks besar" WCAG, jadi putih di atas pink (3.3:1) tetap lolos AA
const btn = `flex items-center justify-center rounded-full text-[19px] font-bold tracking-[-0.01em] transition-[background-color,color,filter] ${focusRing}`
const pinkBtn = `${btn} bg-accent text-white hover:brightness-[0.92]`
// garis 1.5px lewat inset shadow: border CSS dibulatkan Chrome ke piksel layar (jadi 1px di layar 1x)
const outlineBtn = `${btn} bg-transparent text-ink shadow-[inset_0_0_0_1.5px_#111111] hover:bg-ink hover:text-white`
const link = `font-semibold text-ink underline-offset-4 hover:underline ${focusRing}`

/** kilau bintang empat sudut */
function Sparkle({ size, color, style }: { size: number; color: string; style: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="pointer-events-none absolute" style={style} aria-hidden="true">
      <path d="M12 0C12.7 6.4 17.6 11.3 24 12 17.6 12.7 12.7 17.6 12 24 11.3 17.6 6.4 12.7 0 12 6.4 11.3 11.3 6.4 12 0Z" fill={color} />
    </svg>
  )
}

/** lingkaran warna lembut di belakang etalase (gradasi radial: tampak seperti blur besar tanpa biaya filter blur) */
function Glow({ color, size, opacity, style }: { color: string; size: string; opacity: number; style: CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ width: size, height: size, opacity, background: `radial-gradient(closest-side, ${color} 35%, transparent)`, ...style }}
      aria-hidden="true"
    />
  )
}

export function Home() {
  const { go, reset, hasProgress, resume, setTemplate, booth, startBoothSession } = useApp()
  const wide = useWide()
  // mode booth dengan template tetap: tamu tidak memilih template
  const fixedTemplate = booth.on && !!booth.templateId

  const pick = (t: CatalogTemplate) => {
    if (booth.on) return void startBoothSession(t.id)
    setTemplate(t.id)
    go('text')
  }
  const start = () => {
    if (booth.on) return void startBoothSession()
    reset()
    go('count')
  }

  // tekan lama logo (2,5 detik) → setelan mode booth (untuk operator, tidak terlihat oleh tamu)
  const hold = useRef(0)
  const holdStart = () => {
    clearTimeout(hold.current)
    hold.current = window.setTimeout(() => go('booth'), 2500)
  }
  const holdEnd = () => clearTimeout(hold.current)

  const resumeLink = hasProgress && (
    <button type="button" onClick={resume} className={`self-center py-1 font-mono text-[12px] text-ink underline-offset-4 hover:underline ${focusRing}`}>
      lanjutkan sesi terakhir →
    </button>
  )

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-ivory">
      {/* ---------- dekorasi latar ---------- */}
      {wide ? (
        <>
          <Glow color="#FFD36F" size="min(420px, 34vw)" opacity={0.24} style={{ left: '16%', top: '58%' }} />
          <Glow color="#FF3E8A" size="min(520px, 40vw)" opacity={0.18} style={{ left: '32%', top: '80%' }} />
          <Glow color="#B98CFF" size="min(500px, 38vw)" opacity={0.22} style={{ left: '72%', top: '78%' }} />
          <Glow color="#7FD3FF" size="min(400px, 32vw)" opacity={0.2} style={{ left: '88%', top: '56%' }} />
        </>
      ) : (
        <>
          <Glow color="#FFD36F" size="72vw" opacity={0.22} style={{ left: '12%', top: '50%' }} />
          <Glow color="#FF3E8A" size="80vw" opacity={0.16} style={{ left: '38%', top: '66%' }} />
          <Glow color="#B98CFF" size="78vw" opacity={0.22} style={{ left: '82%', top: '62%' }} />
          <Glow color="#7FD3FF" size="60vw" opacity={0.16} style={{ left: '92%', top: '42%' }} />
        </>
      )}

      {/* ---------- navigasi ---------- */}
      <header className="relative z-10 flex h-16 shrink-0 items-center justify-between px-[22px] md:h-[84px] md:px-14">
        <span
          onPointerDown={holdStart}
          onPointerUp={holdEnd}
          onPointerLeave={holdEnd}
          onPointerCancel={holdEnd}
          onContextMenu={(e) => e.preventDefault()}
          className="select-none [-webkit-touch-callout:none]"
        >
          <Logo size={wide ? 30 : 26} />
        </span>
        <nav aria-label="utama" className="-mr-2 flex items-center gap-2 text-[14px] md:gap-6 md:text-[15px]">
          {wide && !fixedTemplate && (
            <button type="button" onClick={() => go('gallery')} className={`px-2 py-3 ${link}`}>
              template
            </button>
          )}
          <button type="button" onClick={() => go('tentang')} className={`px-2 py-3 ${link}`}>
            tentang
          </button>
        </nav>
      </header>

      {/* ---------- judul ---------- */}
      <div className="relative z-10 flex shrink-0 flex-col items-center px-[22px] pt-[clamp(12px,3dvh,28px)] text-center md:pt-[clamp(0px,2dvh,20px)]">
        <h1
          className="relative font-display font-extrabold whitespace-nowrap text-ink"
          style={{ letterSpacing: '-0.05em', lineHeight: 0.9, fontSize: wide ? 'clamp(68px, min(7.8vw, 12.5dvh), 112px)' : 'clamp(44px, 16vw, 62px)' }}
        >
          pose dulu<span className="text-accent">.</span>
          {wide ? (
            <>
              <Sparkle size={14} color="#FF3E8A" style={{ left: '-1.45em', top: '-0.1em' }} />
              <Sparkle size={18} color="#B98CFF" style={{ left: '-0.8em', bottom: '-0.1em' }} />
              <Sparkle size={30} color="#FF3E8A" style={{ right: '-0.85em', top: '0.15em' }} />
              <Sparkle size={16} color="#FFD36F" style={{ right: '-1.4em', bottom: '-0.55em' }} />
            </>
          ) : (
            <>
              <Sparkle size={22} color="#FF3E8A" style={{ right: '-0.42em', top: '0.12em' }} />
              <Sparkle size={14} color="#B98CFF" style={{ left: '-0.3em', bottom: '-0.2em' }} />
              <Sparkle size={14} color="#FFD36F" style={{ left: '0.15em', top: '-0.4em' }} />
            </>
          )}
        </h1>
        <p className="mt-3 text-[15px] leading-snug text-muted md:mt-4 md:text-[19px]">pilih template, senyum, lalu simpan hasilnya.</p>

        {wide && (
          <>
            <div className="mt-[clamp(16px,3dvh,28px)] flex gap-3">
              <button type="button" onClick={start} className={`${pinkBtn} h-14 px-9`}>
                mulai foto
              </button>
              {!fixedTemplate && (
                <button type="button" onClick={() => go('gallery')} className={`${outlineBtn} h-14 px-9`}>
                  lihat template
                </button>
              )}
            </div>
            {resumeLink && <div className="mt-2 flex">{resumeLink}</div>}
          </>
        )}
      </div>

      {/* ---------- etalase ---------- */}
      <Showcase onPick={pick} phone={!wide} className="relative z-[1] min-h-0 flex-1 md:mt-2" />
      {wide && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-linear-to-b from-transparent to-ivory" aria-hidden="true" />}

      {/* ---------- HP: tombol menempel di bawah ---------- */}
      {!wide && (
        <div className="relative z-10 flex shrink-0 flex-col gap-2.5 px-[22px] pt-2 pb-[max(34px,env(safe-area-inset-bottom))]">
          {resumeLink}
          <button type="button" onClick={start} className={`${pinkBtn} h-14 w-full`}>
            mulai foto
          </button>
          {!fixedTemplate && (
            <button type="button" onClick={() => go('gallery')} className={`${outlineBtn} h-[52px] w-full`}>
              lihat template
            </button>
          )}
        </div>
      )}
    </div>
  )
}
