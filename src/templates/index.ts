import type { Template, TextField } from './types'
import { FORMATS, FORMATS_BY_COUNT, PHOTO_COUNTS, type Format, type PhotoCount, seeded } from './layouts'
import { VIBES } from './vibes'
import { DESIGN_CATEGORIES } from './designs'

export type { Template, TextField, TextValues } from './types'
export { VIBES } from './vibes'
export { PHOTO_COUNTS, FORMATS, type PhotoCount, type Format } from './layouts'

export type CatalogTemplate = Template & { format: Format }

/** kategori yang sudah selesai dipindah dari file desain ke kode (menggantikan template hasil generator) */
const DESIGNED: Record<string, CatalogTemplate[]> = Object.fromEntries(
  DESIGN_CATEGORIES.filter((c) => c.complete && c.templates.length).map((c) => [c.id, c.templates]),
)

/** template hasil generator: 12 vibe × 5 jumlah foto × 2 format × 2 varian */
const GENERATED: CatalogTemplate[] = VIBES.filter((v) => !DESIGNED[v.id]).flatMap((vibe) =>
  PHOTO_COUNTS.flatMap((count) =>
    FORMATS_BY_COUNT[count].flatMap((format) =>
      ([0, 1] as const).map((variant) => {
        const { width, height } = FORMATS[format]
        const id = `${vibe.id}-${count}-${format}-${variant}`
        const built = vibe.build({ format, count, W: width, H: height, variant, rand: seeded(id) })
        return {
          id,
          name: vibe.variants[variant],
          category: vibe.id,
          width,
          height,
          photoCount: count,
          format,
          filter: vibe.filter,
          ...built,
        }
      }),
    ),
  ),
)

export const TEMPLATES: CatalogTemplate[] = [...GENERATED, ...Object.values(DESIGNED).flat()]

/** template untuk jumlah foto & kategori tertentu (null = semua) */
export function templatesFor(count: PhotoCount | null, vibeId: string | null = null) {
  return TEMPLATES.filter((t) => (count === null || t.photoCount === count) && (vibeId === null || t.category === vibeId))
}

export function templateById(id: string | null) {
  return TEMPLATES.find((t) => t.id === id) ?? null
}

export function fieldsOf(t: Template): TextField[] {
  const set = new Set<TextField>()
  for (const tx of t.texts ?? []) for (const f of [tx.field].flat()) set.add(f)
  for (const f of t.fields ?? []) set.add(f)
  const order: TextField[] = ['nama', 'nama2', 'tempat', 'tanggal', 'catatan']
  return order.filter((f) => set.has(f))
}

export function vibeById(id: string | null) {
  return VIBES.find((v) => v.id === id) ?? null
}
