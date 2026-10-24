// Kategori Klasik & Minimalis: 12 template hasil desain (design-reference/klasik-minimalis/)
import type { DesignCategory } from '../designs/define'
import { bingkaiGaris } from './bingkai-garis'
import { diptych } from './diptych'
import { stripHitam } from './strip-hitam'
import { stripKlasik } from './strip-klasik'
import { gridGaris } from './grid-garis'
import { enamFrame } from './enam-frame'
import { bingkaiOval } from './bingkai-oval'
import { garisWaktu } from './garis-waktu'
import { matGaleri } from './mat-galeri'
import { pasFotoStudio } from './pas-foto-studio'
import { stripGarisEmas } from './strip-garis-emas'
import { triptych } from './triptych'

export const KLASIK_TEMPLATES = [bingkaiGaris, diptych, stripHitam, stripKlasik, gridGaris, enamFrame, bingkaiOval, garisWaktu, matGaleri, pasFotoStudio, stripGarisEmas, triptych]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const KLASIK_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'klasik-bingkai-garis': { tanggal: '17.10.2026', tempat: '[TEMPAT]' },
  'klasik-diptych': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'klasik-strip-hitam': { tanggal: '17.10.2026' },
  'klasik-strip-klasik': { tanggal: '17 · 10 · 2026' },
  'klasik-grid-garis': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'klasik-enam-frame': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'klasik-bingkai-oval': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'klasik-garis-waktu': { tanggal: '17.10.2026', tempat: '[TEMPAT]' },
  'klasik-mat-galeri': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'klasik-pas-foto-studio': { nama: '[NAMA]', tanggal: '17 OKT 2026' },
  'klasik-strip-garis-emas': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'klasik-triptych': { tanggal: '17.10.2026', tempat: '[TEMPAT]' },
}

/** file desain acuan per template */
export const KLASIK_REFERENCE: Record<string, string> = {
  'klasik-bingkai-garis': 'bingkai-garis',
  'klasik-diptych': 'diptych',
  'klasik-strip-hitam': 'strip-hitam',
  'klasik-strip-klasik': 'strip-klasik',
  'klasik-grid-garis': 'grid-garis',
  'klasik-enam-frame': 'enam-frame',
  'klasik-bingkai-oval': 'bingkai-oval',
  'klasik-garis-waktu': 'garis-waktu',
  'klasik-mat-galeri': 'mat-galeri',
  'klasik-pas-foto-studio': 'pas-foto-studio',
  'klasik-strip-garis-emas': 'strip-garis-emas',
  'klasik-triptych': 'triptych',
}

export const CATEGORY: DesignCategory = {
  id: 'klasik',
  folder: 'klasik-minimalis',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: KLASIK_TEMPLATES,
  sampleTexts: KLASIK_SAMPLE_TEXTS,
  reference: KLASIK_REFERENCE,
}
