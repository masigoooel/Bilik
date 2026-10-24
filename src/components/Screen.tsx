import type { ReactNode } from 'react'
import { useApp } from '../state/AppState'
import { Logo } from './Logo'
import { StepIndicator } from './StepIndicator'

type Props = {
  title: string
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** konten kolom kiri di desktop (≥1024px). di HP tidak ditampilkan */
  stage?: ReactNode
  /** sembunyikan tombol kembali */
  noBack?: boolean
  /** lebar panel kanan desktop (px), default 480 */
  panel?: number
}

export function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** header standar: tombol kembali + (opsional) label tengah + indikator langkah */
export function ScreenHeader({ noBack, extra, className = '' }: { noBack?: boolean; extra?: ReactNode; className?: string }) {
  const { step, back } = useApp()
  return (
    <header className={`pt-safe sticky top-0 z-10 flex min-h-14 items-center justify-between gap-3 bg-ivory/90 pb-2 backdrop-blur ${className}`}>
      {noBack ? (
        <span className="h-11 w-11" />
      ) : (
        <button
          onClick={back}
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-black/5 lg:hover:bg-black/5"
          aria-label="kembali"
        >
          <BackIcon />
        </button>
      )}
      {extra && <div className="mr-auto min-w-0">{extra}</div>}
      <StepIndicator step={step} />
    </header>
  )
}

/** kolom kiri desktop: area besar untuk preview */
export function Stage({ children, dark = false, hideLogo = false }: { children: ReactNode; dark?: boolean; hideLogo?: boolean }) {
  return (
    <aside
      className={`relative hidden h-dvh items-center justify-center overflow-hidden p-10 lg:flex ${
        dark ? 'bg-ink' : 'bg-[#ECEAE4]'
      }`}
    >
      {!hideLogo && (
        <div className="absolute top-6 left-8">
          <Logo size={26} tone={dark ? 'light' : 'dark'} />
        </div>
      )}
      {children}
    </aside>
  )
}

function Title({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <>
      <h1 className="heading animate-rise mt-2 text-[34px] font-extrabold lg:text-[40px]">{title}</h1>
      {subtitle && <p className="animate-rise mt-2 text-[15px] leading-snug text-muted">{subtitle}</p>}
    </>
  )
}

/**
 * Kerangka layar. HP (<1024px): satu kolom maks 480px.
 * Desktop (≥1024px): dua kolom, kiri `stage`, kanan langkah aktif.
 */
export function Screen({ title, subtitle, children, footer, stage, noBack, panel }: Props) {
  return (
    <Shell stage={stage} panel={panel}>
      <ScreenHeader noBack={noBack} className="px-4 lg:px-8 lg:pt-6" />
      <main className="flex-1 px-4 pb-6 lg:px-8">
        <Title title={title} subtitle={subtitle} />
        <div className="mt-6">{children}</div>
      </main>
      {footer && (
        <footer className="pb-safe sticky bottom-0 z-10 bg-gradient-to-t from-ivory via-ivory to-ivory/0 px-4 pt-6 lg:px-8 lg:pb-8">
          {footer}
        </footer>
      )}
    </Shell>
  )
}

/** grid dua kolom desktop; dipakai juga oleh layar yang tidak memakai <Screen> */
export function Shell({ stage, children, panel = 480 }: { stage?: ReactNode; children: ReactNode; panel?: number }) {
  return (
    <div className="min-h-dvh lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_var(--panel)] lg:overflow-hidden" style={{ ['--panel' as string]: `${panel}px` }}>
      {stage ?? <Stage>{null}</Stage>}
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-ivory lg:h-dvh lg:max-w-none lg:overflow-y-auto lg:border-l lg:border-line">
        {children}
      </div>
    </div>
  )
}

type SplitProps = {
  title: string
  subtitle?: ReactNode
  /** isi utama (grid). HP: di bawah judul. desktop: kolom kanan yang lebar */
  children: ReactNode
  /** isi tambahan sidebar kiri, hanya desktop */
  sidebar?: ReactNode
  /** bar bawah lengket, hanya HP */
  mobileFooter?: ReactNode
  /** bagian bawah sidebar, hanya desktop */
  desktopFooter?: ReactNode
  /** label di header, di samping tombol kembali */
  headerExtra?: ReactNode
}

/**
 * Layout untuk layar grid lebar (template, galeri).
 * HP: satu kolom + bar bawah. Desktop: sidebar kiri 380px + grid lebar di kanan.
 */
export function SplitScreen({ title, subtitle, children, sidebar, mobileFooter, desktopFooter, headerExtra }: SplitProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col lg:grid lg:h-dvh lg:max-w-none lg:grid-cols-[380px_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="flex flex-col px-4 [scrollbar-width:thin] lg:h-dvh lg:overflow-y-auto lg:border-r lg:border-line lg:px-8">
        {/* label header: di HP di samping tombol kembali; di sidebar desktop (sempit) di bawah judul */}
        <ScreenHeader className="lg:pt-6" extra={headerExtra && <div className="lg:hidden">{headerExtra}</div>} />
        <Title title={title} subtitle={subtitle} />
        {headerExtra && <div className="mt-4 hidden lg:flex">{headerExtra}</div>}
        {sidebar && <div className="mt-6 hidden flex-1 lg:block">{sidebar}</div>}
        {desktopFooter && <div className="sticky bottom-0 mt-6 hidden bg-ivory pt-4 pb-8 lg:block">{desktopFooter}</div>}
      </aside>
      <main className="flex-1 px-4 pt-6 pb-6 lg:h-dvh lg:overflow-y-auto lg:bg-[#ECEAE4] lg:p-8">{children}</main>
      {mobileFooter && <footer className="pb-safe sticky bottom-0 z-10 lg:hidden">{mobileFooter}</footer>}
    </div>
  )
}
