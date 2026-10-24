// Kategori Bold & Pop: template hasil desain (design-reference/bold-pop/)
import type { DesignCategory } from '../designs/define'
import { popSingle } from './pop-single'
import { kemasanSnack } from './kemasan-snack'
import { komik2Panel } from './komik-2-panel'
import { komik4Panel } from './komik-4-panel'
import { popGrid } from './pop-grid'
import { warnaTabrak } from './warna-tabrak'
import { cetakRiso } from './cetak-riso'
import { empatWarna } from './empat-warna'
import { sampulKomik } from './sampul-komik'
import { mesinGacha } from './mesin-gacha'
import { billboardKota } from './billboard-kota'
import { mesinMinuman } from './mesin-minuman'

export const POP_TEMPLATES = [kemasanSnack, komik2Panel, komik4Panel, popGrid, popSingle, warnaTabrak, cetakRiso, empatWarna, sampulKomik, mesinGacha, billboardKota, mesinMinuman]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const POP_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'pop-kemasan-snack': { tanggal: '17.10.26' },
  'pop-komik-2-panel': { catatan: '[TEKS]', tanggal: '17.10.26' },
  'pop-komik-4-panel': { catatan: '[TEKS]', tanggal: '17.10.26' },
  'pop-grid': { tanggal: '17.10.26' },
  'pop-warna-tabrak': { tanggal: '17.10.26' },
  'pop-single': { catatan: '[TEKS]', nama: '[NAMA]', tanggal: '17.10.26' },
  'pop-cetak-riso': { nama: '[NAMA]', tanggal: '17.10.26' },
  'pop-empat-warna': { nama: '[NAMA]', tanggal: '17.10.26' },
  'pop-sampul-komik': { nama: '[NAMA]', tempat: '[TEMPAT]', tanggal: '17.10.26' },
  'pop-mesin-gacha': { nama: '[NAMA]' },
  'pop-billboard-kota': { nama: '[NAMA]', tanggal: '17.10.26' },
  'pop-mesin-minuman': { nama: '[NAMA]' },
}

/** file desain acuan per template */
export const POP_REFERENCE: Record<string, string> = {
  'pop-single': 'pop-single',
  'pop-kemasan-snack': 'kemasan-snack',
  'pop-komik-2-panel': 'komik-2-panel',
  'pop-komik-4-panel': 'komik-4-panel',
  'pop-grid': 'pop-grid',
  'pop-warna-tabrak': 'warna-tabrak',
  'pop-cetak-riso': 'cetak-riso',
  'pop-empat-warna': 'empat-warna',
  'pop-sampul-komik': 'sampul-komik',
  'pop-mesin-gacha': 'mesin-gacha',
  'pop-billboard-kota': 'billboard-kota',
  'pop-mesin-minuman': 'mesin-minuman',
}

export const CATEGORY: DesignCategory = {
  id: 'pop',
  folder: 'bold-pop',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: POP_TEMPLATES,
  sampleTexts: POP_SAMPLE_TEXTS,
  reference: POP_REFERENCE,
}
