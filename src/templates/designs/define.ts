import type { Template, TextValues } from '../types'
import type { Format } from '../layouts'

export type DesignTemplate = Template & { format: Format }

/** satu kategori desain (satu folder di design-reference/) */
export type DesignCategory = {
  /** id vibe di aplikasi (klasik, retro, ...) */
  id: string
  /** folder di design-reference/ */
  folder: string
  /** true kalau semua template kategori sudah dipindah & lolos uji: baru menggantikan template generator */
  complete: boolean
  templates: DesignTemplate[]
  /** teks contoh yang menghasilkan tulisan sama dengan file desain (halaman uji & skrip compare) */
  sampleTexts: Record<string, Partial<TextValues>>
  /** nama file desain (tanpa .html) per id template */
  reference: Record<string, string>
}

const FORMAT_BY_SIZE: Record<string, Format> = { '600x1800': 'strip', '1200x1800': '4r', '1080x1350': 'portrait' }

/** pembuat template untuk satu kategori, dengan filter default kategori */
export function defineDesign(category: string, defaultFilter: string) {
  return (t: Omit<Template, 'category'>): DesignTemplate => {
    const format = FORMAT_BY_SIZE[`${t.width}x${t.height}`]
    if (!format) throw new Error(`ukuran ${t.width}x${t.height} tidak dikenal (${t.id})`)
    if (t.slots.length !== t.photoCount) throw new Error(`${t.id}: jumlah slot ${t.slots.length} ≠ ${t.photoCount}`)
    if (!t.id.startsWith(`${category}-`)) throw new Error(`${t.id}: id harus diawali "${category}-"`)
    return { filter: defaultFilter, ...t, category, format }
  }
}
