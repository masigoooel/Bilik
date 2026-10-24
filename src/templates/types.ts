// Template didefinisikan sebagai data. Renderer di src/render/ menggambar data ini ke <canvas>.
// Semua koordinat dalam piksel kanvas final (mis. 1200x1800 untuk 4R).

export type TextField = 'nama' | 'nama2' | 'tempat' | 'tanggal' | 'catatan'

export type Align = 'left' | 'center' | 'right'

export type Slot = {
  x: number
  y: number
  w: number
  h: number
  /** radius sudut; satu angka atau per sudut [kiri-atas, kanan-atas, kanan-bawah, kiri-bawah] (CSS border-radius) */
  radius?: number | [number, number, number, number]
  /** derajat, berputar di titik tengah slot */
  rotate?: number
  /** garis tepi di sekeliling foto */
  stroke?: { color: string; width: number }
  /** bayangan keras (offset) di belakang foto */
  shadow?: { color: string; x: number; y: number }
}

export type TemplateText = {
  /** satu field, atau beberapa field yang digabung dengan `joiner` (field kosong dilewati) */
  field: TextField | TextField[]
  joiner?: string
  x: number
  y: number
  font: string
  size: number
  color: string
  align?: Align
  weight?: number
  italic?: boolean
  letterSpacing?: number
  transform?: 'upper' | 'lower'
  prefix?: string
  suffix?: string
  /** dipakai bila semua field kosong; tanpa fallback teks tidak digambar */
  fallback?: string
  /** lebar maksimum; teks dibungkus per kata (tidak pernah memotong kata) */
  maxWidth?: number
  maxLines?: number
  lineHeight?: number
  /** posisi y relatif terhadap blok teks (berguna untuk teks multi-baris). default 'middle' */
  anchor?: 'top' | 'middle' | 'bottom'
  rotate?: number
  stroke?: { color: string; width: number }
}

export type GradientStop = [offset: number, color: string]

export type Background =
  | { type: 'solid'; color: string }
  | { type: 'linear'; angle: number; stops: GradientStop[] }
  | { type: 'radial'; stops: GradientStop[] }

export type PatternKind =
  | 'dots'
  | 'grid'
  | 'stripes'
  | 'checker'
  | 'halftone'
  | 'scanlines'
  | 'grain'
  | 'airmail'

type Common = { layer?: 'under' | 'over'; opacity?: number; rotate?: number }

export type Decor = Common &
  (
    | {
        type: 'rect'
        x: number
        y: number
        w: number
        h: number
        radius?: number
        fill?: string
        stroke?: string
        lineWidth?: number
        dash?: number[]
      }
    | {
        type: 'circle'
        cx: number
        cy: number
        r: number
        fill?: string
        stroke?: string
        lineWidth?: number
        dash?: number[]
      }
    | { type: 'sparkle'; cx: number; cy: number; r: number; fill: string }
    | { type: 'star'; cx: number; cy: number; r: number; points?: number; inner?: number; fill: string }
    | { type: 'heart'; cx: number; cy: number; size: number; fill: string }
    | {
        type: 'line'
        x1: number
        y1: number
        x2: number
        y2: number
        stroke: string
        lineWidth: number
        dash?: number[]
      }
    | {
        type: 'text'
        text: string
        x: number
        y: number
        font: string
        size: number
        color: string
        weight?: number
        italic?: boolean
        align?: Align
        letterSpacing?: number
        stroke?: { color: string; width: number }
      }
    | {
        type: 'pattern'
        kind: PatternKind
        x: number
        y: number
        w: number
        h: number
        color: string
        color2?: string
        size: number
        gap?: number
        seed?: number
      }
    | { type: 'sunburst'; cx: number; cy: number; r: number; rays: number; color: string }
    | { type: 'barcode'; x: number; y: number; w: number; h: number; color: string; seed: number }
    | {
        type: 'brackets'
        x: number
        y: number
        w: number
        h: number
        len: number
        color: string
        lineWidth: number
      }
  )

export type Template = {
  id: string
  name: string
  category: string
  width: number
  height: number
  photoCount: number
  background: Background
  slots: Slot[]
  texts?: TemplateText[]
  decor?: Decor[]
  /** warna isi slot kosong (thumbnail / placeholder) */
  placeholder?: string
  /** id filter warna default saat template ini dipilih (user tetap bisa ganti) */
  filter?: string
  /**
   * Dekorasi yang digambar langsung dengan Canvas 2D (template hasil desain).
   * under: sebelum foto, over: sesudah foto (bingkai/ornamen yang menimpa foto & teks user),
   * top: sesudah texture (elemen yang di desain berada di atas lapisan noise).
   */
  draw?: { under?: DrawFn; over?: DrawFn; top?: DrawFn }
  /** font Google Fonts yang dipakai draw(), mis. 'Silkscreen', 'Space Mono:400,700', 'Instrument Serif:400,400i' */
  fonts?: FontSpec[]
  /** lapisan noise desain (data-texture) di atas seluruh kanvas, termasuk foto */
  texture?: { opacity: number; blend: 'multiply' | 'screen' }
  /** field teks yang dipakai draw() (melengkapi `texts`) */
  fields?: TextField[]
}

/** string ringkas, atau parameter css2 Google Fonts mentah + face yang perlu dimuat ('400', 'italic 400') */
export type FontSpec = string | { family: string; css: string; faces: string[] }

export type DrawEnv = {
  /** teks user (tanggal sudah dikosongkan bila saklar "tampilkan tanggal" mati) */
  texts: Partial<TextValues>
  W: number
  H: number
}

export type DrawFn = (ctx: CanvasRenderingContext2D, env: DrawEnv) => void

export type TextValues = Record<TextField, string>
