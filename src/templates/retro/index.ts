// Kategori Retro & Vintage: 12 template hasil desain (design-reference/retro-vintage/)
import type { DesignCategory } from '../designs/define'
import { filmNegatif } from './film-negatif'
import { polaroidStrip } from './polaroid-strip'
import { koranLama } from './koran-lama'
import { kaset } from './kaset'
import { vhs } from './vhs'
import { lembarKontak } from './lembar-kontak'
import { tvTabung } from './tv-tabung'
import { radioKaset } from './radio-kaset'
import { kameraInstan } from './kamera-instan'
import { salamDari } from './salam-dari'
import { lembarPerangko } from './lembar-perangko'
import { etalaseTokoFoto } from './etalase-toko-foto'

export const RETRO_TEMPLATES = [koranLama, kaset, polaroidStrip, filmNegatif, vhs, lembarKontak, tvTabung, radioKaset, kameraInstan, salamDari, lembarPerangko, etalaseTokoFoto]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const RETRO_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'retro-film-negatif': { tanggal: "'26 10 17" },
  'retro-polaroid-strip': { tanggal: '17.10.2026' },
  'retro-koran-lama': { tanggal: 'Sabtu, 17 Oktober 2026', catatan: '[JUDUL BERITA]', nama: '[NAMA FOTOGRAFER]', tempat: '[NAMA TOKO]' },
  'retro-kaset': { catatan: '[JUDUL MIXTAPE]', tanggal: '17.10.2026', nama: '[NAMA]' },
  'retro-vhs': { tanggal: '17.10.26' },
  'retro-lembar-kontak': { tanggal: '17.10.26' },
  'retro-tv-tabung': { nama: '[NAMA]', tanggal: '17.10.1979', tempat: '[TEMPAT]' },
  'retro-radio-kaset': { nama: '[NAMA]', tanggal: '17.10.1984' },
  'retro-kamera-instan': { nama: '[NAMA]', tanggal: '17.10.1979' },
  'retro-salam-dari': { tempat: '[KOTA]', tanggal: '17.10.1976' },
  'retro-lembar-perangko': { nama: '[NAMA]', tanggal: '17.10.1976' },
  'retro-etalase-toko-foto': { nama: '[NAMA]' },
}

/** file desain acuan per template */
export const RETRO_REFERENCE: Record<string, string> = {
  'retro-film-negatif': 'film-negatif',
  'retro-polaroid-strip': 'polaroid-strip',
  'retro-koran-lama': 'koran-lama',
  'retro-kaset': 'kaset',
  'retro-vhs': 'vhs',
  'retro-lembar-kontak': 'lembar-kontak',
  'retro-tv-tabung': 'tv-tabung',
  'retro-radio-kaset': 'radio-kaset',
  'retro-kamera-instan': 'kamera-instan',
  'retro-salam-dari': 'salam-dari',
  'retro-lembar-perangko': 'lembar-perangko',
  'retro-etalase-toko-foto': 'etalase-toko-foto',
}

export const CATEGORY: DesignCategory = {
  id: 'retro',
  folder: 'retro-vintage',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: RETRO_TEMPLATES,
  sampleTexts: RETRO_SAMPLE_TEXTS,
  reference: RETRO_REFERENCE,
}
