// Kategori Meme & Lucu: template hasil desain (design-reference/meme-lucu/)
import type { DesignCategory } from '../designs/define'
import { sebelumSesudah } from './sebelum-sesudah'
import { tierList } from './tier-list'
import { level } from './level'
import { raporFoto } from './rapor-foto'
import { memeGrid } from './meme-grid'
import { dicari } from './dicari'
import { piagam } from './piagam'
import { nggakHmmIya } from './nggak-hmm-iya'
import { polling } from './polling'
import { twitViral } from './twit-viral'
import { paketStiker } from './paket-stiker'
import { badanHewan } from './badan-hewan'

export const MEME_TEMPLATES = [dicari, level, memeGrid, raporFoto, sebelumSesudah, tierList, piagam, nggakHmmIya, polling, twitViral, paketStiker, badanHewan]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const MEME_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'meme-sebelum-sesudah': { tanggal: '17.10.26' },
  'meme-level': { nama: '[NAMA]', catatan: '[NAMA PENCAPAIAN]', tanggal: '17.10.26' },
  'meme-rapor-foto': { nama: '[NAMA]', nama2: '[wali kelas]', tanggal: '17.10.2026' },
  'meme-meme-grid': { nama: '[KOMUNITAS]', nama2: '[USER]', catatan: '[TEKS ATAS] / [TEKS BAWAH]', tanggal: '17.10.26' },
  'meme-dicari': { nama: '[NAMA]', catatan: '[CIRI KHAS]', tempat: '[TEMPAT]', nama2: '[KONTAK]', tanggal: '17.10.2026' },
  'meme-tier-list': { catatan: '[TOPIK]', tanggal: '17.10.26' },
  'meme-piagam': { nama: '[NAMA]', catatan: '[BIDANG PRESTASI]', nama2: '[tanda tangan]', tanggal: '17.10.2026' },
  'meme-paket-stiker': { nama: '[NAMA]' },
  'meme-badan-hewan': { nama: '[USER]', tanggal: '17.10.26' },
  'meme-polling': { nama: '[NAMA GENG]', tanggal: '17.10.26' },
  'meme-twit-viral': { nama: '[NAMA]', nama2: '[USER]', catatan: '[TEKS TWIT SINGKAT]', tanggal: '17 Okt 26' },
  'meme-nggak-hmm-iya': { catatan: '[SITUASI]', nama: '[USER]', tanggal: '17.10.26' },
}

/** file desain acuan per template */
export const MEME_REFERENCE: Record<string, string> = {
  'meme-sebelum-sesudah': 'sebelum-sesudah',
  'meme-tier-list': 'tier-list',
  'meme-level': 'level',
  'meme-dicari': 'dicari',
  'meme-meme-grid': 'meme-grid',
  'meme-rapor-foto': 'rapor-foto',
  'meme-piagam': 'piagam',
  'meme-nggak-hmm-iya': 'nggak-hmm-iya',
  'meme-polling': 'polling',
  'meme-paket-stiker': 'paket-stiker',
  'meme-badan-hewan': 'badan-hewan',
  'meme-twit-viral': 'twit-viral',
}

export const CATEGORY: DesignCategory = {
  id: 'meme',
  folder: 'meme-lucu',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: MEME_TEMPLATES,
  sampleTexts: MEME_SAMPLE_TEXTS,
  reference: MEME_REFERENCE,
}
