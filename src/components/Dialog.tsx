// Dialog kecil: latar gelap, Esc / klik latar menutup, fokus masuk ke dialog lalu kembali ke tombol pembuka.
import { useEffect, useRef, type ReactNode } from 'react'

export function Dialog({ title, onClose, children, footer, wide = false }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    box.current?.querySelector<HTMLElement>('input, button:not([data-close]), [tabindex="0"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      opener?.focus?.()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`pb-safe flex max-h-[88dvh] w-full flex-col rounded-t-[22px] bg-ivory text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] sm:rounded-[22px] ${wide ? 'sm:max-w-[640px]' : 'sm:max-w-[440px]'}`}
      >
        <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3">
          <h2 className="heading text-[24px] font-extrabold">{title}</h2>
          <button
            type="button"
            data-close
            onClick={onClose}
            aria-label="tutup"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-[18px] hover:bg-[#EFEDE8]"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">{children}</div>
        {footer && <div className="border-t border-line px-6 pt-4 pb-5">{footer}</div>}
      </div>
    </div>
  )
}
