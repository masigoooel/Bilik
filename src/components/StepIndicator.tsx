import type { Step } from '../state/AppState'

const MACRO: Partial<Record<Step, 1 | 2 | 3>> = {
  count: 1,
  template: 2,
  text: 3,
}

const LABELS = ['jumlah foto', 'template', 'isi teks'] as const
export const TOTAL_STEPS = LABELS.length

/** "langkah 1/3 · jumlah foto" + tiga segmen (hanya di langkah persiapan) */
/** `compact`: hanya "langkah n/3" tanpa nama langkah */
export function StepIndicator({ step, tone = 'dark', compact = false }: { step: Step; tone?: 'dark' | 'light'; compact?: boolean }) {
  const n = MACRO[step]
  if (!n) return null
  const on = tone === 'dark' ? 'bg-ink' : 'bg-white'
  const off = tone === 'dark' ? 'bg-line' : 'bg-white/25'
  return (
    <div className="flex items-center gap-3" aria-label={`langkah ${n} dari ${TOTAL_STEPS}: ${LABELS[n - 1]}`}>
      <span className={`label-mono whitespace-nowrap ${tone === 'dark' ? 'text-muted' : 'text-white/75'}`}>
        langkah {n}/{TOTAL_STEPS}
        {!compact && <span className="hidden sm:inline"> · {LABELS[n - 1]}</span>}
      </span>
      <div className="flex gap-1" aria-hidden="true">
        {LABELS.map((l, i) => (
          <span key={l} className={`h-1.5 rounded-full transition-all ${i < n ? `w-5 ${on}` : `w-3 ${off}`}`} />
        ))}
      </div>
    </div>
  )
}
