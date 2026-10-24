// Kategori Cute & Kawaii: template hasil desain (design-reference/cute-kawaii/)
import type { DesignCategory } from '../designs/define'
import { telingaKelinci } from './telinga-kelinci'
import { gelembung } from './gelembung'
import { awan } from './awan'
import { permen } from './permen'
import { gridPastel4r } from './grid-pastel-4r'
import { lembarStiker } from './lembar-stiker'
import { balon } from './balon'
import { bekalBento } from './bekal-bento'
import { kotakSusu } from './kotak-susu'
import { piknik } from './piknik'
import { rumahKecil } from './rumah-kecil'
import { toplesKue } from './toples-kue'

export const CUTE_TEMPLATES = [
  telingaKelinci,
  gelembung,
  awan,
  permen,
  gridPastel4r,
  lembarStiker,
  balon,
  bekalBento,
  kotakSusu,
  piknik,
  rumahKecil,
  toplesKue,
]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const CUTE_SAMPLE_TEXTS: Record<string, Record<string, string>> = {
  'cute-telinga-kelinci': { tanggal: '17.10.26' },
  'cute-gelembung': { tanggal: '17.10.26' },
  'cute-awan': { tanggal: '17.10.26' },
  'cute-permen': { tanggal: '17.10.26' },
  'cute-grid-pastel-4r': { tanggal: '17 okt 2026' },
  'cute-lembar-stiker': { tanggal: '17.10.26' },
  'cute-balon': { tanggal: '17.10.26' },
  'cute-bekal-bento': { nama: '[NAMA]', tanggal: '17.10.26' },
  'cute-kotak-susu': { nama: '[NAMA]', tanggal: '17.10.26' },
  'cute-piknik': { tempat: '[TEMPAT]', tanggal: '17.10.26' },
  'cute-rumah-kecil': { nama: '[NAMA]' },
  'cute-toples-kue': { nama: '[NAMA]', tanggal: '17.10.26' },
}

/** file desain acuan per template */
export const CUTE_REFERENCE: Record<string, string> = {
  'cute-telinga-kelinci': 'telinga-kelinci',
  'cute-gelembung': 'gelembung',
  'cute-awan': 'awan',
  'cute-permen': 'permen',
  'cute-grid-pastel-4r': 'grid-pastel-4r',
  'cute-lembar-stiker': 'lembar-stiker',
  'cute-balon': 'balon',
  'cute-bekal-bento': 'bekal-bento',
  'cute-kotak-susu': 'kotak-susu',
  'cute-piknik': 'piknik',
  'cute-rumah-kecil': 'rumah-kecil',
  'cute-toples-kue': 'toples-kue',
}

export const CATEGORY: DesignCategory = {
  id: 'cute',
  folder: 'cute-kawaii',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: CUTE_TEMPLATES,
  sampleTexts: CUTE_SAMPLE_TEXTS,
  reference: CUTE_REFERENCE,
}
