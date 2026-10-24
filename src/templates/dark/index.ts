// Kategori Dark & Grunge: template hasil desain (design-reference/dark-grunge/)
import type { DesignCategory } from '../designs/define'
import { berkasRahasia } from './berkas-rahasia'
import { bukuMantra } from './buku-mantra'
import { cerminAntik } from './cermin-antik'
import { diaryHitam } from './diary-hitam'
import { jendelaGotik } from './jendela-gotik'
import { jendelaHujan } from './jendela-hujan'
import { kartuRemi } from './kartu-remi'
import { kartuTarot } from './kartu-tarot'
import { mugshot } from './mugshot'
import { negatifTerbakar } from './negatif-terbakar'
import { papanBukti } from './papan-bukti'
import { sampulAlbum } from './sampul-album'

export const DARK_TEMPLATES = [berkasRahasia, bukuMantra, cerminAntik, diaryHitam, jendelaGotik, jendelaHujan, kartuRemi, kartuTarot, mugshot, negatifTerbakar, papanBukti, sampulAlbum]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (halaman uji & skrip compare) */
export const DARK_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'dark-berkas-rahasia': { nama: '[NAMA]', tempat: '[TEMPAT]', tanggal: '17.10.2026' },
  'dark-buku-mantra': { nama: '[NAMA]' },
  'dark-cermin-antik': { nama: '[NAMA]' },
  'dark-diary-hitam': { tanggal: '17 okt', nama: '[BAND]' },
  'dark-jendela-gotik': { tanggal: '17.10.2026' },
  'dark-jendela-hujan': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'dark-kartu-remi': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.2026' },
  'dark-kartu-tarot': { nama: '[NAMA]', tanggal: '17.10.2026', catatan: '[TEKS RAMALAN SINGKAT]' },
  'dark-mugshot': { nama: '[NAMA]', tanggal: '17.10.2026' },
  'dark-negatif-terbakar': { nama: '[NAMA]' },
  'dark-papan-bukti': { tempat: '[TEMPAT]', catatan: '[PETUNJUK]', tanggal: '17.10.26' },
  'dark-sampul-album': { nama: '[Nama Band]', nama2: '[NAMA]', catatan: '[JUDUL LAGU]', tanggal: '17.10.2026', tempat: '[STUDIO]' },
}

/** file desain acuan per template */
export const DARK_REFERENCE: Record<string, string> = {
  'dark-berkas-rahasia': 'berkas-rahasia',
  'dark-buku-mantra': 'buku-mantra',
  'dark-cermin-antik': 'cermin-antik',
  'dark-diary-hitam': 'diary-hitam',
  'dark-jendela-gotik': 'jendela-gotik',
  'dark-jendela-hujan': 'jendela-hujan',
  'dark-kartu-remi': 'kartu-remi',
  'dark-kartu-tarot': 'kartu-tarot',
  'dark-mugshot': 'mugshot',
  'dark-negatif-terbakar': 'negatif-terbakar',
  'dark-papan-bukti': 'papan-bukti',
  'dark-sampul-album': 'sampul-album',
}

export const CATEGORY: DesignCategory = {
  id: 'dark',
  folder: 'dark-grunge',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: DARK_TEMPLATES,
  sampleTexts: DARK_SAMPLE_TEXTS,
  reference: DARK_REFERENCE,
}
