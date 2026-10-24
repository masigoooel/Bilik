// Kategori Editorial & Majalah: template hasil desain (design-reference/editorial-majalah/)
import type { DesignCategory } from '../designs/define'
import { coverMajalah } from './cover-majalah'
import { fotoEsai } from './foto-esai'
import { katalogPameran } from './katalog-pameran'
import { kolomOpini } from './kolom-opini'
import { posterPameran } from './poster-pameran'
import { sampulBuku } from './sampul-buku'
import { wawancara } from './wawancara'
import { indeks } from './indeks'
import { kontributor } from './kontributor'
import { lookbook } from './lookbook'
import { posterFilm } from './poster-film'
import { spread } from './spread'

export const EDITORIAL_TEMPLATES = [
  coverMajalah, spread, indeks, posterFilm, kontributor, lookbook,
  fotoEsai, katalogPameran, kolomOpini, posterPameran, sampulBuku, wawancara,
]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (halaman uji & skrip compare) */
export const EDITORIAL_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'editorial-cover-majalah': { catatan: '[JUDUL UTAMA]', tempat: '[SUBJUDUL SINGKAT]', nama: '[NAMA]', tanggal: '17 Oktober 2026' },
  'editorial-spread': { nama: '[JUDUL ARTIKEL]', catatan: '[KUTIPAN SINGKAT]', tempat: '[KETERANGAN FOTO]', tanggal: '17 Oktober 2026' },
  'editorial-indeks': { nama: '[KETERANGAN]', nama2: '[KETERANGAN]', tempat: '[KETERANGAN]', catatan: '[KETERANGAN]', tanggal: '17 Oktober 2026' },
  'editorial-poster-film': { nama: '[NAMA]', nama2: '[NAMA]', catatan: '[JUDUL FILM]', tempat: '[NAMA]', tanggal: '17.10.2026' },
  'editorial-kontributor': { nama: '[NAMA], [NAMA], [NAMA]', nama2: '[NAMA], [NAMA], [NAMA]' },
  'editorial-lookbook': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.2026' },
  'editorial-foto-esai': { catatan: '[Judul Esai]', nama: '[NAMA]', tempat: '[KETERANGAN FOTO SINGKAT]', tanggal: '17 Oktober 2026' },
  'editorial-katalog-pameran': { nama: '[NAMA]', tempat: '[TEMPAT]', tanggal: '17.10 — 30.11.2026', catatan: '[JUDUL KARYA]' },
  'editorial-kolom-opini': { catatan: '[KUTIPAN SINGKAT]', nama: '[NAMA]', tanggal: '17.10.2026' },
  'editorial-poster-pameran': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10 — 30.11.2026', tempat: '[TEMPAT]' },
  'editorial-sampul-buku': { catatan: '[JUDUL BUKU]', nama: '[NAMA]', tanggal: '17.10.2026' },
  'editorial-wawancara': { nama: '[NAMA]', tempat: '[TEMPAT]', catatan: '[KUTIPAN SINGKAT]', nama2: '[NAMA]' },
}

/** file desain acuan per template */
export const EDITORIAL_REFERENCE: Record<string, string> = {
  'editorial-cover-majalah': 'cover-majalah',
  'editorial-spread': 'spread',
  'editorial-indeks': 'indeks',
  'editorial-poster-film': 'poster-film',
  'editorial-kontributor': 'kontributor',
  'editorial-lookbook': 'lookbook',
  'editorial-foto-esai': 'foto-esai',
  'editorial-katalog-pameran': 'katalog-pameran',
  'editorial-kolom-opini': 'kolom-opini',
  'editorial-poster-pameran': 'poster-pameran',
  'editorial-sampul-buku': 'sampul-buku',
  'editorial-wawancara': 'wawancara',
}

export const CATEGORY: DesignCategory = {
  id: 'editorial',
  folder: 'editorial-majalah',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: EDITORIAL_TEMPLATES,
  sampleTexts: EDITORIAL_SAMPLE_TEXTS,
  reference: EDITORIAL_REFERENCE,
}
