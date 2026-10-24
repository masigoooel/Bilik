type Props = {
  size?: number
  /** 'dark' = teks tinta (untuk latar terang), 'light' = teks putih */
  tone?: 'dark' | 'light'
  withText?: boolean
  /** sel pink berputar (layar merender) */
  animated?: boolean
  className?: string
}

// urutan searah jarum jam: kiri atas, kanan atas, kanan bawah, kiri bawah
const CELLS = [
  { x: 6, y: 6, delay: 0 },
  { x: 17, y: 6, delay: 0.4 },
  { x: 17, y: 17, delay: 0.8 },
  { x: 6, y: 17, delay: 1.2 },
]

/** ikon 2x2: satu sel pink (kiri atas), tiga sel putih transparan, di dalam kotak tinta */
export function Logo({ size = 28, tone = 'dark', withText = true, animated = false, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="bilik">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#111111" />
        {CELLS.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width="9"
            height="9"
            rx="2.5"
            fill={i === 0 ? '#FF3E8A' : '#FFFFFF'}
            fillOpacity={i === 0 ? 1 : 0.85}
            className={animated ? 'logo-cell' : undefined}
            style={animated ? { animationDelay: `${c.delay}s` } : undefined}
          />
        ))}
      </svg>
      {withText && (
        <span
          className={`heading font-extrabold ${tone === 'dark' ? 'text-ink' : 'text-white'}`}
          style={{ fontSize: size * 0.86 }}
        >
          bilik
        </span>
      )}
    </span>
  )
}
