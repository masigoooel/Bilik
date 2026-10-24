// Kategori Travel: template hasil desain (design-reference/travel/)
import type { DesignCategory } from '../designs/define'
import { boardingPass } from './boarding-pass'
import { bukuPanduan } from './buku-panduan'
import { jendelaKereta } from './jendela-kereta'
import { jendelaPesawat } from './jendela-pesawat'
import { kartuPos } from './kartu-pos'
import { koperStiker } from './koper-stiker'
import { kunciHotel } from './kunci-hotel'
import { paspor } from './paspor'
import { petaRute } from './peta-rute'
import { plangPenunjuk } from './plang-penunjuk'
import { rakKartuPos } from './rak-kartu-pos'
import { tiketKereta } from './tiket-kereta'

export const TRAVEL_TEMPLATES = [boardingPass, bukuPanduan, jendelaKereta, jendelaPesawat, kartuPos, koperStiker, kunciHotel, paspor, petaRute, plangPenunjuk, rakKartuPos, tiketKereta]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const TRAVEL_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'travel-boarding-pass': { tanggal: '17.10.26' },
  'travel-buku-panduan': { tempat: '[KOTA]', nama: '[NAMA]' },
  'travel-jendela-kereta': { nama: '[NAMA]', tempat: '[ASAL] → [TUJUAN]', tanggal: '17.10.26' },
  'travel-jendela-pesawat': { tempat: '[ASAL] → [TUJUAN]', tanggal: '17.10.26' },
  'travel-kartu-pos': { tempat: '[TEMPAT]', catatan: '[PESAN]', tanggal: '17.10.2026' },
  'travel-koper-stiker': { nama: '[NAMA]', tempat: '[KOTA]', tanggal: '17.10.26' },
  'travel-kunci-hotel': { nama: '[NAMA]', tanggal: '17.10.26', tempat: '[KOTA]' },
  'travel-paspor': { nama: '[NAMA]', tempat: '[KOTA] → [KOTA]', tanggal: '17 OKT 2026' },
  'travel-peta-rute': { tempat: '[TEMPAT]' },
  'travel-plang-penunjuk': { tempat: '[KOTA]', tanggal: '17.10.26' },
  'travel-rak-kartu-pos': { tempat: '[KOTA]', tanggal: '17.10.2026' },
  'travel-tiket-kereta': { tempat: '[ASAL] → [TUJUAN]', tanggal: '17.10.2026' },
}

/** file desain acuan per template */
export const TRAVEL_REFERENCE: Record<string, string> = {
  'travel-boarding-pass': 'boarding-pass',
  'travel-buku-panduan': 'buku-panduan',
  'travel-jendela-kereta': 'jendela-kereta',
  'travel-jendela-pesawat': 'jendela-pesawat',
  'travel-kartu-pos': 'kartu-pos',
  'travel-koper-stiker': 'koper-stiker',
  'travel-kunci-hotel': 'kunci-hotel',
  'travel-paspor': 'paspor',
  'travel-peta-rute': 'peta-rute',
  'travel-plang-penunjuk': 'plang-penunjuk',
  'travel-rak-kartu-pos': 'rak-kartu-pos',
  'travel-tiket-kereta': 'tiket-kereta',
}

export const CATEGORY: DesignCategory = {
  id: 'travel',
  folder: 'travel',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: TRAVEL_TEMPLATES,
  sampleTexts: TRAVEL_SAMPLE_TEXTS,
  reference: TRAVEL_REFERENCE,
}
