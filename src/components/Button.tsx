import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
  full?: boolean
}

// pink #FF3E8A + teks putih hanya 3.3:1, jadi tombol utama pakai tinta dan pink jadi aksen
const styles: Record<Variant, string> = {
  primary: 'bg-ink text-white active:bg-black disabled:bg-[#BDBBB5]',
  secondary: 'bg-white text-ink border border-line active:bg-ivory disabled:text-muted',
  ghost: 'bg-transparent text-ink active:bg-black/5',
  light: 'bg-white text-ink active:bg-white/90',
}

export function Button({ variant = 'primary', icon, full = true, className = '', children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[17px] font-semibold tracking-[-0.01em] transition-colors disabled:cursor-not-allowed ${full ? 'w-full' : ''} ${styles[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
