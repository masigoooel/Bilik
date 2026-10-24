// Kategori Gaming & Pixel: template hasil desain (design-reference/gaming-pixel/)
import type { DesignCategory } from '../designs/define'
import { arcade } from './arcade'
import { binderKartu } from './binder-kartu'
import { kartridGame } from './kartrid-game'
import { konsolGenggam } from './konsol-genggam'
import { kotakGame } from './kotak-game'
import { mesinCapit } from './mesin-capit'
import { pilihLintasan } from './pilih-lintasan'
import { hud } from './hud'
import { inventaris } from './inventaris'
import { kartuKarakter } from './kartu-karakter'
import { pilihKarakter } from './pilih-karakter'
import { vs } from './vs'

export const GAMING_TEMPLATES = [arcade, hud, inventaris, kartuKarakter, pilihKarakter, vs, binderKartu, kartridGame, konsolGenggam, kotakGame, mesinCapit, pilihLintasan]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const GAMING_SAMPLE_TEXTS: DesignCategory['sampleTexts'] = {
  'gaming-arcade': {},
  'gaming-hud': { tanggal: '17.10.26' },
  'gaming-inventaris': { tanggal: '17.10.26' },
  'gaming-kartu-karakter': { nama: '[NAMA]' },
  'gaming-pilih-karakter': { nama: '[NAMA 1]', nama2: '[NAMA 2]', tanggal: '17.10.26' },
  'gaming-vs': { nama: '[NAMA]', nama2: '[NAMA]', tanggal: '17.10.26' },
  'gaming-kartrid-game': { nama: '[NAMA]', catatan: '[JUDUL GAME] / [JUDUL GAME] / [JUDUL GAME]' },
  'gaming-binder-kartu': { nama: '[NAMA]', nama2: '[NAMA]', catatan: '[NAMA GENG]' },
  'gaming-konsol-genggam': { nama: '[NAMA]', catatan: '[JUDUL GAME]' },
  'gaming-kotak-game': { nama: '[NAMA]', catatan: '[JUDUL GAME]' },
  'gaming-mesin-capit': { nama: '[NAMA]' },
  'gaming-pilih-lintasan': { nama: '[NAMA]', tanggal: '17.10.26' },
}

/** file desain acuan per template */
export const GAMING_REFERENCE: Record<string, string> = {
  'gaming-arcade': 'arcade',
  'gaming-hud': 'hud',
  'gaming-inventaris': 'inventaris',
  'gaming-kartu-karakter': 'kartu-karakter',
  'gaming-pilih-karakter': 'pilih-karakter',
  'gaming-vs': 'vs',
  'gaming-binder-kartu': 'binder-kartu',
  'gaming-kartrid-game': 'kartrid-game',
  'gaming-konsol-genggam': 'konsol-genggam',
  'gaming-kotak-game': 'kotak-game',
  'gaming-mesin-capit': 'mesin-capit',
  'gaming-pilih-lintasan': 'pilih-lintasan',
}

export const CATEGORY: DesignCategory = {
  id: 'gaming',
  folder: 'gaming-pixel',
  // jadi true setelah semua template kategori ini dipindah & lolos uji
  complete: true,
  templates: GAMING_TEMPLATES,
  sampleTexts: GAMING_SAMPLE_TEXTS,
  reference: GAMING_REFERENCE,
}
