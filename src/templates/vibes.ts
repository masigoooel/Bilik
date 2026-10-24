import type { Background, Decor, Slot, Template, TemplateText, TextField } from './types'
import { type Format, type Pad, slotsFor } from './layouts'

export const FONTS = {
  display: '"Outfit Variable"',
  mono: '"Space Mono"',
  serif: '"DM Serif Display"',
  hand: '"Caveat Variable"',
  pixel: 'VT323',
  impact: 'Anton',
}

export type BuildCtx = {
  format: Format
  count: number
  W: number
  H: number
  variant: 0 | 1
  rand: () => number
}

export type Built = {
  background: Background
  slots: Slot[]
  texts?: TemplateText[]
  decor?: Decor[]
  placeholder?: string
}

export type Vibe = {
  id: string
  name: string
  blurb: string
  swatch: string[]
  variants: [string, string]
  /** filter warna default untuk semua template vibe ini */
  filter: string
  build: (c: BuildCtx) => Built
}

// ---------- helper kecil ----------

/** margin dasar: 5% dari sisi terpendek */
const unit = (c: BuildCtx) => Math.round(Math.min(c.W, c.H) * 0.05)
const pad = (t: number, r: number, b: number, l: number): Pad => ({ t, r, b, l })
const solid = (color: string): Background => ({ type: 'solid', color })

function txt(
  field: TextField | TextField[],
  x: number,
  y: number,
  font: string,
  size: number,
  color: string,
  o: Partial<TemplateText> = {},
): TemplateText {
  return { field, x, y, font, size: Math.round(size), color, align: 'center', ...o }
}

type TextDecor = Extract<Decor, { type: 'text' }>

function label(text: string, x: number, y: number, size: number, color: string, o: Partial<TextDecor> = {}): Decor {
  return {
    type: 'text',
    text,
    x,
    y,
    font: FONTS.mono,
    size: Math.round(size),
    color,
    align: 'center',
    letterSpacing: size * 0.12,
    ...o,
  } as Decor
}

const full = (c: BuildCtx) => ({ x: 0, y: 0, w: c.W, h: c.H })

// ---------- 12 vibe ----------

const klasik: Vibe = {
  id: 'klasik',
  name: 'Klasik',
  blurb: 'putih bersih, serif tenang',
  swatch: ['#FFFFFF', '#111111', '#ECE9E2'],
  variants: ['kertas', 'arang'],
  filter: 'normal',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.14)
    const dark = c.variant === 1
    const ink = dark ? '#F7F6F2' : '#111111'
    const sub = dark ? '#A3A3A3' : '#6B6B6B'
    const fw = c.W - 2 * p
    return {
      background: solid(dark ? '#161616' : '#FFFFFF'),
      placeholder: dark ? '#2A2A2A' : '#ECE9E2',
      slots: slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.6)),
      texts: [
        txt('nama', c.W / 2, c.H - fh * 0.6, FONTS.serif, fh * 0.3, ink, { maxWidth: fw }),
        txt(['tempat', 'tanggal'], c.W / 2, c.H - fh * 0.31, FONTS.mono, fh * 0.085, sub, {
          joiner: '  ·  ',
          maxWidth: fw,
        }),
      ],
      decor: [label('bilik', c.W / 2, c.H - fh * 0.12, fh * 0.06, dark ? '#555555' : '#B5B2AA')],
    }
  },
}

const retro: Vibe = {
  id: 'retro',
  name: 'Retro',
  blurb: 'krem hangat, garis 70-an',
  swatch: ['#F3E3C3', '#E2582B', '#E9A83A', '#5A3A22'],
  variants: ['senja', 'kopi'],
  filter: 'film-hangat',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.15)
    const dark = c.variant === 1
    const ink = dark ? '#F3E3C3' : '#5A3A22'
    const sub = dark ? '#D9BF94' : '#8A5A3A'
    const sh = fh * 0.045
    const stripes = ['#E2582B', '#E9A83A', ink].map(
      (fill, i): Decor => ({
        type: 'rect',
        x: p,
        y: c.H - fh + p * 0.35 + i * sh * 1.4,
        w: c.W - 2 * p,
        h: sh,
        radius: sh / 2,
        fill,
      }),
    )
    return {
      background: solid(dark ? '#4A2E1C' : '#F3E3C3'),
      placeholder: dark ? '#6A4A34' : '#E6D2AC',
      slots: slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.6), () => ({
        radius: p * 0.6,
        stroke: { color: ink, width: Math.max(3, p * 0.12) },
      })),
      decor: [
        { type: 'sunburst', cx: c.W / 2, cy: c.H - fh * 0.5, r: c.H * 1.3, rays: 28, color: dark ? '#553522' : '#EED7AE' },
        ...stripes,
      ],
      texts: [
        txt('nama', c.W / 2, c.H - fh * 0.48, FONTS.display, fh * 0.27, ink, {
          weight: 800,
          letterSpacing: -fh * 0.008,
          maxWidth: c.W - 2 * p,
        }),
        txt(['tempat', 'tanggal'], c.W / 2, c.H - fh * 0.2, FONTS.mono, fh * 0.08, sub, {
          joiner: '  ·  ',
          maxWidth: c.W - 2 * p,
        }),
      ],
    }
  },
}

const y2k: Vibe = {
  id: 'y2k',
  name: 'Y2K',
  blurb: 'jendela windows, flip phone, stiker',
  swatch: ['#3A8C8C', '#FF7EC2', '#BFE3FF', '#D4D0C8'],
  variants: ['bubblegum', 'krom'],
  filter: 'glossy',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.14)
    const chrome = c.variant === 1
    const slots = slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.7), () => ({
      radius: p * 0.9,
      stroke: { color: '#FFFFFF', width: p * 0.22 },
    }))
    const sparkles: Decor[] = slots.flatMap((s, i) => {
      const out: Decor[] = [
        { type: 'sparkle', cx: s.x + s.w - p * 0.15, cy: s.y + p * 0.15, r: p * 0.75, fill: i % 2 ? '#FF3E8A' : '#FFFFFF', layer: 'over' },
      ]
      if (i % 2 === 0)
        out.push({ type: 'sparkle', cx: s.x + p * 0.1, cy: s.y + s.h - p * 0.1, r: p * 0.45, fill: '#FFFFFF', layer: 'over' })
      return out
    })
    sparkles.push(
      { type: 'sparkle', cx: p * 1.6, cy: c.H - fh * 0.56, r: p * 0.6, fill: '#FFFFFF' },
      { type: 'sparkle', cx: c.W - p * 1.6, cy: c.H - fh * 0.42, r: p * 0.5, fill: '#FF3E8A' },
    )
    return {
      background: chrome
        ? { type: 'linear', angle: 160, stops: [[0, '#F4F5F8'], [0.35, '#C9CEDB'], [0.6, '#F1F2F6'], [1, '#B9C0D0']] }
        : { type: 'linear', angle: 160, stops: [[0, '#BDE3FF'], [0.5, '#F3C6FF'], [1, '#FFD1E8']] },
      placeholder: chrome ? '#DDE1EA' : '#F6DDF6',
      slots,
      decor: sparkles,
      texts: [
        txt('nama', c.W / 2, c.H - fh * 0.54, FONTS.display, fh * 0.3, '#FFFFFF', {
          weight: 800,
          letterSpacing: -fh * 0.01,
          stroke: { color: chrome ? '#6E7790' : '#FF3E8A', width: fh * 0.035 },
          maxWidth: c.W - p * 5,
        }),
        txt(['tempat', 'tanggal'], c.W / 2, c.H - fh * 0.22, FONTS.mono, fh * 0.08, chrome ? '#4A5268' : '#6A3D9A', {
          joiner: '  ✦  ',
          maxWidth: c.W - p * 5,
        }),
      ],
    }
  },
}

const cute: Vibe = {
  id: 'cute',
  name: 'Cute',
  blurb: 'pastel, polkadot, hati kecil',
  swatch: ['#FFE3EC', '#FF7AA8', '#FFFFFF', '#E3F4E8'],
  variants: ['stroberi', 'matcha'],
  filter: 'peach',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.16)
    const mint = c.variant === 1
    const heart = mint ? '#F28CB1' : '#FF7AA8'
    const ink = mint ? '#2F6B4F' : '#C2255C'
    const slots = slotsFor(c.format, c.count, c.W, c.H, pad(p * 1.1, p * 1.1, fh, p * 1.1), Math.round(p * 0.9), (_, i) => ({
      radius: p * 0.8,
      stroke: { color: '#FFFFFF', width: p * 0.28 },
      rotate: c.count > 1 ? (i % 2 ? 1.6 : -1.6) : 0,
    }))
    const s0 = slots[0]
    return {
      background: solid(mint ? '#E3F4E8' : '#FFE3EC'),
      placeholder: mint ? '#C9E8D4' : '#FBCCDB',
      slots,
      decor: [
        { type: 'pattern', kind: 'dots', ...full(c), color: '#FFFFFF', size: p * 0.16, gap: p * 1.1 },
        { type: 'heart', cx: p * 1.7, cy: c.H - fh * 0.56, size: p * 1.1, fill: heart, rotate: -14 },
        { type: 'heart', cx: c.W - p * 1.7, cy: c.H - fh * 0.62, size: p * 0.8, fill: heart, rotate: 12 },
        { type: 'heart', cx: s0.x + p * 0.25, cy: s0.y + p * 0.25, size: p * 1.0, fill: heart, rotate: -10, layer: 'over' },
      ],
      texts: [
        txt('nama', c.W / 2, c.H - fh * 0.6, FONTS.hand, fh * 0.36, ink, { weight: 700, maxWidth: c.W - p * 6 }),
        txt('catatan', c.W / 2, c.H - fh * 0.32, FONTS.hand, fh * 0.17, ink, { weight: 500, maxWidth: c.W - p * 4 }),
        txt('tanggal', c.W / 2, c.H - fh * 0.11, FONTS.mono, fh * 0.06, mint ? '#4F7F67' : '#A34A6E', {
          letterSpacing: fh * 0.006,
        }),
      ],
    }
  },
}

const kalcer: Vibe = {
  id: 'kalcer',
  name: 'Kalcer',
  blurb: 'kertas kraft, selotip, roll film',
  swatch: ['#E8E1D3', '#2B2924', '#F2D57E', '#3D4434'],
  variants: ['kraft', 'zaitun'],
  filter: 'pudar',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.13)
    const dark = c.variant === 1
    const ink = dark ? '#EDE6D6' : '#2B2924'
    const sub = dark ? '#BEB6A2' : '#5E584C'
    const m = p * 1.2
    const slots = slotsFor(c.format, c.count, c.W, c.H, pad(m, m, fh, m), Math.round(p * 0.9), () => ({
      stroke: { color: dark ? '#EDE6D6' : '#FFFFFF', width: p * 0.32 },
      rotate: (c.rand() * 2 - 1) * 2.2,
    }))
    const tapes: Decor[] = slots.map((s) => {
      const w = Math.min(s.w * 0.3, p * 5)
      const h = p * 0.75
      return {
        type: 'rect',
        x: s.x + s.w / 2 - w / 2 + (c.rand() - 0.5) * s.w * 0.3,
        y: s.y - h * 0.5,
        w,
        h,
        fill: dark ? '#D9C9A3' : '#F2D57E',
        opacity: 0.8,
        rotate: (c.rand() * 2 - 1) * 7,
        layer: 'over',
      }
    })
    const bw = Math.min(fh * 0.9, c.W * 0.22)
    const fw = c.W - 2 * m
    return {
      background: solid(dark ? '#3D4434' : '#E8E1D3'),
      placeholder: dark ? '#565E4B' : '#D6CDBA',
      slots,
      decor: [
        { type: 'pattern', kind: 'grain', ...full(c), color: dark ? '#FFFFFF' : '#000000', size: 2, seed: 7, opacity: 0.07 },
        ...tapes,
        { type: 'barcode', x: c.W - m - bw, y: c.H - fh * 0.74, w: bw, h: fh * 0.3, color: ink, seed: 11 },
        label('roll 01', c.W - m, c.H - fh * 0.3, fh * 0.06, sub, { align: 'right' }),
      ],
      texts: [
        txt('nama', m, c.H - fh * 0.6, FONTS.mono, fh * 0.15, ink, { weight: 700, align: 'left', maxWidth: fw - bw - p }),
        txt(['tempat', 'tanggal'], m, c.H - fh * 0.36, FONTS.mono, fh * 0.08, sub, {
          joiner: ' — ',
          align: 'left',
          maxWidth: fw - bw - p,
        }),
      ],
    }
  },
}

const bestie: Vibe = {
  id: 'bestie',
  name: 'Bestie',
  blurb: 'kotak-kotak, berdua lebih seru',
  swatch: ['#FFD8E8', '#FFFFFF', '#D9CCFF', '#FFF7C2'],
  variants: ['permen', 'lavender'],
  filter: 'cerah',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.15)
    const lav = c.variant === 1
    const line = Math.max(3, p * 0.12)
    const panel = { x: p, y: c.H - fh + p * 0.3, w: c.W - 2 * p, h: fh - p * 1.0 }
    const pcy = panel.y + panel.h / 2
    return {
      background: solid('#FFFFFF'),
      placeholder: lav ? '#E4DBFF' : '#FFE6F0',
      slots: slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.6), () => ({
        radius: p * 0.35,
        stroke: { color: '#111111', width: line },
      })),
      decor: [
        {
          type: 'pattern',
          kind: 'checker',
          ...full(c),
          color: lav ? '#D9CCFF' : '#FFD8E8',
          color2: lav ? '#FFF7C2' : '#FFFFFF',
          size: p * 0.9,
        },
        { type: 'rect', ...panel, radius: p * 0.5, fill: '#FFFFFF', stroke: '#111111', lineWidth: line },
        { type: 'star', cx: panel.x + panel.w - p * 0.2, cy: panel.y + p * 0.1, r: p * 0.7, fill: '#FF3E8A', rotate: 12 },
      ],
      texts: [
        txt(['nama', 'nama2'], c.W / 2, pcy - panel.h * 0.12, FONTS.display, fh * 0.22, '#111111', {
          joiner: ' & ',
          weight: 800,
          letterSpacing: -fh * 0.006,
          maxWidth: panel.w - p * 1.5,
        }),
        txt(['catatan', 'tanggal'], c.W / 2, pcy + panel.h * 0.24, FONTS.mono, fh * 0.07, '#6B6B6B', {
          joiner: '  ·  ',
          maxWidth: panel.w - p * 1.5,
        }),
      ],
    }
  },
}

const editorial: Vibe = {
  id: 'editorial',
  name: 'Editorial',
  blurb: 'sampul majalah, masthead serif',
  swatch: ['#FFFFFF', '#111111', '#6B6B6B'],
  variants: ['majalah', 'malam'],
  filter: 'mono-kontras',
  build(c) {
    const p = unit(c)
    const hh = Math.round(c.H * 0.15)
    const fh = Math.round(c.H * 0.1)
    const dark = c.variant === 1
    const ink = dark ? '#FFFFFF' : '#111111'
    const sub = dark ? '#A3A3A3' : '#6B6B6B'
    const bw = Math.min(fh * 1.1, c.W * 0.25)
    return {
      background: solid(dark ? '#111111' : '#FFFFFF'),
      placeholder: dark ? '#2A2A2A' : '#E9E9E9',
      slots: slotsFor(c.format, c.count, c.W, c.H, pad(hh + p * 0.15, p, fh, p), Math.round(p * 0.5)),
      decor: [
        { type: 'line', x1: p, y1: hh * 0.94, x2: c.W - p, y2: hh * 0.94, stroke: ink, lineWidth: Math.max(2, p * 0.06) },
        label('vol. 01', p, hh * 0.84, hh * 0.07, sub, { align: 'left' }),
        { type: 'barcode', x: c.W - p - bw, y: c.H - fh * 0.72, w: bw, h: fh * 0.45, color: ink, seed: 3 },
      ],
      texts: [
        txt('nama', c.W / 2, hh * 0.42, FONTS.serif, hh * 0.58, ink, {
          fallback: 'bilik',
          letterSpacing: -hh * 0.01,
          maxWidth: c.W - 2 * p,
        }),
        txt('tanggal', c.W - p, hh * 0.84, FONTS.mono, hh * 0.07, sub, { align: 'right' }),
        txt('tempat', p, c.H - fh * 0.78, FONTS.mono, fh * 0.1, sub, {
          align: 'left',
          letterSpacing: fh * 0.01,
          maxWidth: c.W - 2 * p - bw - p * 0.5,
        }),
        txt('catatan', p, c.H - fh * 0.62, FONTS.serif, fh * 0.24, ink, {
          align: 'left',
          italic: true,
          anchor: 'top',
          maxLines: 2,
          lineHeight: 1.05,
          maxWidth: c.W - 2 * p - bw - p * 0.5,
        }),
      ],
    }
  },
}

const pop: Vibe = {
  id: 'pop',
  name: 'Bold & Pop',
  blurb: 'kuning terang, garis tebal, halftone',
  swatch: ['#FFD60A', '#FF3E8A', '#111111'],
  variants: ['kuning', 'pink'],
  filter: 'kontras',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.15)
    const pink = c.variant === 1
    const dot = pink ? '#FFD60A' : '#FF3E8A'
    const off = Math.round(p * 0.3)
    const slots = slotsFor(c.format, c.count, c.W, c.H, pad(p, p + off, fh, p), Math.round(p * 0.8), () => ({
      stroke: { color: '#111111', width: Math.max(4, p * 0.18) },
      shadow: { color: '#111111', x: off, y: off },
    }))
    const s0 = slots[0]
    return {
      background: solid(pink ? '#FF3E8A' : '#FFD60A'),
      placeholder: pink ? '#FF8DB8' : '#FFE873',
      slots,
      decor: [
        { type: 'pattern', kind: 'halftone', ...full(c), color: dot, size: p * 0.32, gap: p * 0.9, opacity: 0.55 },
        { type: 'star', cx: s0.x + s0.w - p * 0.5, cy: s0.y + p * 0.5, r: p * 1.3, points: 14, inner: 0.72, fill: dot, rotate: 12, layer: 'over' },
      ],
      texts: [
        txt('nama', c.W / 2, c.H - fh * 0.54, FONTS.display, fh * 0.32, '#111111', {
          weight: 900,
          transform: 'upper',
          letterSpacing: -fh * 0.008,
          maxWidth: c.W - 2 * p,
        }),
        txt(['tempat', 'tanggal'], c.W / 2, c.H - fh * 0.23, FONTS.mono, fh * 0.08, '#111111', {
          weight: 700,
          joiner: ' / ',
          transform: 'upper',
          maxWidth: c.W - 2 * p,
        }),
      ],
    }
  },
}

const meme: Vibe = {
  id: 'meme',
  name: 'Meme',
  blurb: 'teks atas, teks bawah',
  swatch: ['#FFFFFF', '#111111'],
  variants: ['putih', 'hitam'],
  filter: 'normal',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.07)
    const dark = c.variant === 1
    const slots = slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.5))
    const s0 = slots[0]
    const sn = slots[slots.length - 1]
    const size = (s: Slot) => Math.min(s.w * 0.12, s.h * 0.17)
    const meme = (s: Slot): Partial<TemplateText> => ({
      transform: 'upper',
      stroke: { color: '#000000', width: size(s) * 0.16 },
      maxWidth: s.w * 0.92,
      maxLines: 2,
      lineHeight: 1.02,
      letterSpacing: size(s) * 0.01,
    })
    const sub = dark ? '#A3A3A3' : '#6B6B6B'
    return {
      background: solid(dark ? '#111111' : '#FFFFFF'),
      placeholder: dark ? '#2E2E2E' : '#D8D8D8',
      slots,
      decor: [label('bilik', c.W - p, c.H - fh * 0.5, fh * 0.24, sub, { align: 'right' })],
      texts: [
        txt('nama', s0.x + s0.w / 2, s0.y + s0.h * 0.04, FONTS.impact, size(s0), '#FFFFFF', { ...meme(s0), anchor: 'top' }),
        txt('catatan', sn.x + sn.w / 2, sn.y + sn.h * 0.96, FONTS.impact, size(sn), '#FFFFFF', { ...meme(sn), anchor: 'bottom' }),
        txt(['tempat', 'tanggal'], p, c.H - fh * 0.5, FONTS.mono, fh * 0.26, sub, {
          joiner: '  ·  ',
          align: 'left',
          maxWidth: c.W - 2 * p - fh * 2,
        }),
      ],
    }
  },
}

const travel: Vibe = {
  id: 'travel',
  name: 'Travel',
  blurb: 'kartu pos & tiket pesawat',
  swatch: ['#F4EFE6', '#D64545', '#2F5DA8', '#1F3A5F'],
  variants: ['kartu pos', 'boarding'],
  filter: 'hangat-klasik',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.15)
    if (c.variant === 0) {
      const b = Math.round(p * 0.45)
      const m = b + Math.round(p * 0.7)
      const r = Math.min(fh * 0.33, c.W * 0.12)
      const cx = c.W - m - r
      const cy = c.H - b - fh * 0.5
      const fw = c.W - 2 * m - 2 * r - p * 0.5
      return {
        background: solid('#F4EFE6'),
        placeholder: '#E2DACB',
        slots: slotsFor(c.format, c.count, c.W, c.H, pad(m, m, fh + b, m), Math.round(p * 0.5), () => ({ radius: p * 0.12 })),
        decor: [
          { type: 'pattern', kind: 'airmail', ...full(c), color: '#D64545', color2: '#2F5DA8', size: b * 2 },
          { type: 'rect', x: b, y: b, w: c.W - 2 * b, h: c.H - 2 * b, fill: '#F4EFE6' },
          { type: 'circle', cx, cy, r, stroke: '#2F5DA8', lineWidth: Math.max(2, r * 0.06), dash: [r * 0.12, r * 0.08], opacity: 0.85 },
          { type: 'circle', cx, cy, r: r * 0.78, stroke: '#2F5DA8', lineWidth: Math.max(1.5, r * 0.03), opacity: 0.85 },
          label('via bilik', cx, cy, r * 0.24, '#2F5DA8', { rotate: -12, opacity: 0.9, letterSpacing: r * 0.02 }),
          label('salam dari', m, c.H - b - fh * 0.8, fh * 0.075, '#6B6B6B', { align: 'left' }),
        ],
        texts: [
          txt('tempat', m, c.H - b - fh * 0.54, FONTS.display, fh * 0.25, '#2F3E5C', {
            weight: 800,
            align: 'left',
            fallback: 'suatu tempat',
            letterSpacing: -fh * 0.006,
            maxWidth: fw,
          }),
          txt(['nama', 'tanggal'], m, c.H - b - fh * 0.26, FONTS.mono, fh * 0.075, '#6B6B6B', {
            joiner: '  ·  ',
            align: 'left',
            maxWidth: fw,
          }),
        ],
      }
    }
    const ink = '#F4EFE6'
    const sub = '#AFC0D6'
    const bw = Math.min(fh * 1.0, c.W * 0.22)
    const fw = c.W - 2 * p - bw - p
    const perf = c.H - fh + p * 0.45
    return {
      background: solid('#1F3A5F'),
      placeholder: '#33507A',
      slots: slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.5), () => ({
        radius: p * 0.2,
        stroke: { color: ink, width: Math.max(2, p * 0.06) },
      })),
      decor: [
        { type: 'line', x1: p, y1: perf, x2: c.W - p, y2: perf, stroke: sub, lineWidth: 3, dash: [8, 10] },
        { type: 'circle', cx: 0, cy: perf, r: p * 0.5, fill: '#F7F6F2' },
        { type: 'circle', cx: c.W, cy: perf, r: p * 0.5, fill: '#F7F6F2' },
        label('tujuan', p, c.H - fh * 0.62, fh * 0.065, sub, { align: 'left' }),
        { type: 'barcode', x: c.W - p - bw, y: c.H - fh * 0.62, w: bw, h: fh * 0.42, color: ink, seed: 5 },
      ],
      texts: [
        txt('tempat', p, c.H - fh * 0.44, FONTS.display, fh * 0.22, ink, {
          weight: 800,
          align: 'left',
          fallback: 'ke mana saja',
          maxWidth: fw,
        }),
        txt(['nama', 'tanggal'], p, c.H - fh * 0.2, FONTS.mono, fh * 0.075, sub, { joiner: '  ·  ', align: 'left', maxWidth: fw }),
      ],
    }
  },
}

const gaming: Vibe = {
  id: 'gaming',
  name: 'Gaming',
  blurb: 'piksel, neon, player 1 siap',
  swatch: ['#0E0B1F', '#39FF88', '#FF3E8A', '#9BBC0F'],
  variants: ['arcade', 'gameboy'],
  filter: 'vhs',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.15)
    const gb = c.variant === 1
    const neon = gb ? '#0F380F' : '#39FF88'
    const ink = gb ? '#0F380F' : '#FFFFFF'
    const accent = gb ? '#306230' : '#FF3E8A'
    const sub = gb ? '#306230' : '#B3ACDF'
    const m = Math.round(p * 1.3)
    const slots = slotsFor(c.format, c.count, c.W, c.H, pad(m, m, fh, m), Math.round(p * 0.9), () => ({
      stroke: { color: neon, width: Math.max(2, p * 0.08) },
    }))
    const hs = p * 0.6
    const hearts: Decor[] = [0, 1, 2].map((i) => ({
      type: 'heart',
      cx: c.W - m - hs / 2 - i * hs * 1.35,
      cy: c.H - fh * 0.64,
      size: hs,
      fill: accent,
    }))
    const left = (c.W - 2 * m) * 0.62
    return {
      background: solid(gb ? '#9BBC0F' : '#0E0B1F'),
      placeholder: gb ? '#8BAC0F' : '#221C48',
      slots,
      decor: [
        { type: 'pattern', kind: 'grid', ...full(c), color: gb ? '#8BAC0F' : '#1E1840', size: p * 1.2 },
        ...slots.map(
          (s): Decor => ({
            type: 'brackets',
            x: s.x - p * 0.35,
            y: s.y - p * 0.35,
            w: s.w + p * 0.7,
            h: s.h + p * 0.7,
            len: p * 0.9,
            color: neon,
            lineWidth: Math.max(3, p * 0.12),
          }),
        ),
        ...hearts,
        {
          type: 'text',
          text: 'high score',
          x: c.W - m,
          y: c.H - fh * 0.4,
          font: FONTS.pixel,
          size: Math.round(fh * 0.14),
          color: sub,
          align: 'right',
        },
        { type: 'pattern', kind: 'scanlines', ...full(c), color: '#000000', size: 3, opacity: gb ? 0.06 : 0.14, layer: 'over' },
      ],
      texts: [
        txt('nama', m, c.H - fh * 0.64, FONTS.pixel, fh * 0.24, ink, { align: 'left', prefix: 'p1 ', maxWidth: left }),
        txt('nama2', m, c.H - fh * 0.4, FONTS.pixel, fh * 0.24, accent, { align: 'left', prefix: 'p2 ', maxWidth: left }),
        txt('tempat', m, c.H - fh * 0.16, FONTS.pixel, fh * 0.15, sub, {
          align: 'left',
          prefix: 'level: ',
          fallback: 'level: 01',
          maxWidth: left,
        }),
        txt('tanggal', c.W - m, c.H - fh * 0.16, FONTS.pixel, fh * 0.15, sub, { align: 'right', maxWidth: c.W - 2 * m - left }),
      ],
    }
  },
}

const dark: Vibe = {
  id: 'dark',
  name: 'Dark',
  blurb: 'hitam pekat, aksen pink tipis',
  swatch: ['#111111', '#2A2A2A', '#FF3E8A'],
  variants: ['tengah malam', 'neon'],
  filter: 'noir',
  build(c) {
    const p = unit(c)
    const fh = Math.round(c.H * 0.14)
    const neon = c.variant === 1
    const r = fh * 0.045
    const nx = p + r * 2 + p * 0.4
    return {
      background: solid(neon ? '#0A0A0A' : '#111111'),
      placeholder: '#262626',
      slots: slotsFor(c.format, c.count, c.W, c.H, pad(p, p, fh, p), Math.round(p * 0.5), () => ({
        radius: p * 0.25,
        stroke: neon ? { color: '#FF3E8A', width: Math.max(2, p * 0.06) } : { color: '#2A2A2A', width: 2 },
      })),
      decor: [
        { type: 'pattern', kind: 'grain', ...full(c), color: '#FFFFFF', size: 2, seed: 13, opacity: 0.05 },
        { type: 'line', x1: p, y1: c.H - fh + p * 0.5, x2: c.W - p, y2: c.H - fh + p * 0.5, stroke: '#2A2A2A', lineWidth: 2 },
        { type: 'circle', cx: p + r, cy: c.H - fh * 0.5, r, fill: '#FF3E8A' },
        label('bilik', c.W - p, c.H - fh * 0.1, fh * 0.055, '#555555', { align: 'right' }),
      ],
      texts: [
        txt('nama', nx, c.H - fh * 0.5, FONTS.display, fh * 0.22, '#FFFFFF', {
          weight: 700,
          align: 'left',
          letterSpacing: -fh * 0.008,
          maxWidth: c.W - nx - p,
        }),
        txt(['tempat', 'tanggal', 'catatan'], nx, c.H - fh * 0.27, FONTS.mono, fh * 0.07, neon ? '#FF6FA6' : '#8A8A8A', {
          joiner: '  ·  ',
          align: 'left',
          maxWidth: c.W - nx - p,
        }),
      ],
    }
  },
}

export const VIBES: Vibe[] = [klasik, retro, y2k, cute, kalcer, bestie, editorial, pop, meme, travel, gaming, dark]

export type TemplateFormat = Format
export type { Template }
