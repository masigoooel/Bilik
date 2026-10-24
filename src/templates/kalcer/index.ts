// Kategori Kalcer: template hasil desain (design-reference/kalcer/)
import type { DesignCategory } from '../designs/define'
import { tiketGig } from './tiket-gig'
import { labelThrift } from './label-thrift'
import { strukKopiSusu } from './struk-kopi-susu'
import { setlistGig } from './setlist-gig'
import { zineFotokopian } from './zine-fotokopian'
import { koleksiTiket } from './koleksi-tiket'
import { piringanHitam } from './piringan-hitam'
import { backstagePass } from './backstage-pass'
import { kasetDemo } from './kaset-demo'
import { amplopCuciCetak } from './amplop-cuci-cetak'
import { papanMenuKopi } from './papan-menu-kopi'
import { dindingStiker } from './dinding-stiker'

export const KALCER_TEMPLATES = [tiketGig, labelThrift, strukKopiSusu, setlistGig, zineFotokopian, koleksiTiket, piringanHitam, backstagePass, kasetDemo, amplopCuciCetak, papanMenuKopi, dindingStiker]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const KALCER_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'kalcer-tiket-gig': { tempat: '[NAMA TEMPAT]', tanggal: '17.10.26' },
  'kalcer-struk-kopi-susu': { tempat: '[ALAMAT]', tanggal: '17/10/26' },
  'kalcer-setlist-gig': { nama: '[NAMA BAND]', tempat: '[VENUE]', tanggal: '17.10.26' },
  'kalcer-zine-fotokopian': { nama: '[NAMA GENG]', tanggal: '17.10.2026' },
  'kalcer-koleksi-tiket': { nama: '[NAMA GIG]', tempat: '[VENUE]', tanggal: '17.10.2026' },
  'kalcer-backstage-pass': { nama: '[NAMA]', nama2: '[NAMA BAND]', tanggal: '17.10.26' },
  'kalcer-kaset-demo': { nama: '[NAMA BAND]', catatan: '[LAGU] / [LAGU] / [LAGU] / [LAGU] / [LAGU]', tanggal: '17.10.26' },
  'kalcer-amplop-cuci-cetak': { nama: '[NAMA]', tanggal: '17/10' },
  'kalcer-papan-menu-kopi': { tempat: '[NAMA KEDAI]', nama: '[NAMA]' },
  'kalcer-dinding-stiker': { nama: '[NAMA]', nama2: '[NAMA]', tempat: '[VENUE]', tanggal: '17.10.26', catatan: '[BAND]' },
  'kalcer-piringan-hitam': { nama: '[NAMA BAND]', catatan: '[JUDUL LAGU] / [JUDUL LAGU] / [JUDUL LAGU] / [JUDUL LAGU]' },
}

/** file desain acuan per template */
export const KALCER_REFERENCE: Record<string, string> = {
  'kalcer-tiket-gig': 'tiket-gig',
  'kalcer-label-thrift': 'label-thrift',
  'kalcer-struk-kopi-susu': 'struk-kopi-susu',
  'kalcer-setlist-gig': 'setlist-gig',
  'kalcer-zine-fotokopian': 'zine-fotokopian',
  'kalcer-koleksi-tiket': 'koleksi-tiket',
  'kalcer-piringan-hitam': 'piringan-hitam',
  'kalcer-backstage-pass': 'backstage-pass',
  'kalcer-kaset-demo': 'kaset-demo',
  'kalcer-amplop-cuci-cetak': 'amplop-cuci-cetak',
  'kalcer-papan-menu-kopi': 'papan-menu-kopi',
  'kalcer-dinding-stiker': 'dinding-stiker',
}

export const CATEGORY: DesignCategory = {
  id: 'kalcer',
  folder: 'kalcer',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: KALCER_TEMPLATES,
  sampleTexts: KALCER_SAMPLE_TEXTS,
  reference: KALCER_REFERENCE,
}
