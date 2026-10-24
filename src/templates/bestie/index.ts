// Kategori Bestie & Couple: template hasil desain (design-reference/bestie-couple/)
import type { DesignCategory } from '../designs/define'
import { berdua } from './berdua'
import { chat } from './chat'
import { gelangManik } from './gelang-manik'
import { jemuranFoto } from './jemuran-foto'
import { kalender } from './kalender'
import { kartuLipat } from './kartu-lipat'
import { pintuKulkas } from './pintu-kulkas'
import { playlistBerdua } from './playlist-berdua'
import { scrapbook } from './scrapbook'
import { surat } from './surat'
import { tiketBioskop } from './tiket-bioskop'
import { tiketWahana } from './tiket-wahana'

/** urutan mengikuti design-reference/manifest.json */
export const BESTIE_TEMPLATES = [
  kalender,
  tiketBioskop,
  chat,
  surat,
  berdua,
  scrapbook,
  kartuLipat,
  pintuKulkas,
  playlistBerdua,
  jemuranFoto,
  tiketWahana,
  gelangManik,
]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const BESTIE_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'bestie-kalender': { tanggal: '17.10.2026', catatan: '[CATATAN]' },
  'bestie-tiket-bioskop': { catatan: '[JUDUL FILM]', tanggal: '17.10.2026' },
  'bestie-chat': { nama: '[NAMA]', tanggal: 'Sabtu, 17 Oktober' },
  'bestie-surat': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.26' },
  'bestie-berdua': { nama: '[A]', nama2: '[B]', tanggal: '17.10.26' },
  'bestie-scrapbook': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.2026' },
  'bestie-kartu-lipat': { nama: '[NAMA]' },
  'bestie-pintu-kulkas': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.2026' },
  'bestie-playlist-berdua': { nama: '[NAMA]', nama2: '[NAMA]', catatan: '[JUDUL LAGU]' },
  'bestie-jemuran-foto': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.2026' },
  'bestie-tiket-wahana': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.26' },
  'bestie-gelang-manik': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.2026' },
}

/** file desain acuan per template */
export const BESTIE_REFERENCE: Record<string, string> = {
  'bestie-kalender': 'kalender',
  'bestie-tiket-bioskop': 'tiket-bioskop',
  'bestie-chat': 'chat',
  'bestie-surat': 'surat',
  'bestie-berdua': 'berdua',
  'bestie-scrapbook': 'scrapbook',
  'bestie-kartu-lipat': 'kartu-lipat',
  'bestie-pintu-kulkas': 'pintu-kulkas',
  'bestie-playlist-berdua': 'playlist-berdua',
  'bestie-jemuran-foto': 'jemuran-foto',
  'bestie-tiket-wahana': 'tiket-wahana',
  'bestie-gelang-manik': 'gelang-manik',
}

export const CATEGORY: DesignCategory = {
  id: 'bestie',
  folder: 'bestie-couple',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: BESTIE_TEMPLATES,
  sampleTexts: BESTIE_SAMPLE_TEXTS,
  reference: BESTIE_REFERENCE,
}
