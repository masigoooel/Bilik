// Kategori Y2K & Aesthetic: 13 template hasil desain (design-reference/y2k-aesthetic/)
import type { DesignCategory } from '../designs/define'
import { jendelaDesktop } from './jendela-desktop'
import { aplikasiGambar } from './aplikasi-gambar'
import { folderFoto } from './folder-foto'
import { pemutarMedia } from './pemutar-media'
import { photoSticker } from './photo-sticker'
import { messengerGel } from './messenger-gel'
import { flipPhone } from './flip-phone'
import { cdSingle } from './cd-single'
import { disket } from './disket'
import { hewanVirtual } from './hewan-virtual'
import { kotakMasukMms } from './kotak-masuk-mms'
import { panggilanVideo } from './panggilan-video'
import { voucherPulsa } from './voucher-pulsa'

export const Y2K_TEMPLATES = [aplikasiGambar, flipPhone, jendelaDesktop, pemutarMedia, folderFoto, photoSticker, messengerGel, cdSingle, disket, hewanVirtual, kotakMasukMms, panggilanVideo, voucherPulsa]

/** teks contoh yang menghasilkan tulisan sama dengan file desain (untuk halaman uji) */
export const Y2K_SAMPLE_TEXTS: Record<string, Record<string, string>> = {
  'y2k-jendela-desktop': { tanggal: '17/10/26' },
  'y2k-flip-phone': { tanggal: '17.10.26', nama: '[NAMA]', nama2: '[NAMA]' },
  'y2k-folder-foto': { tanggal: '17-10-2026' },
  'y2k-pemutar-media': { catatan: '[JUDUL LAGU]', nama: '[NAMA]' },
  'y2k-photo-sticker': { tanggal: '17.10.26' },
  'y2k-messenger-gel': { nama: '[NAMA]', nama2: '[NAMA]', catatan: '[STATUS]', tanggal: '17.10.26' },
  'y2k-cd-single': { catatan: '[JUDUL]', nama: '[NAMA]', tanggal: '17.10.2003' },
  'y2k-disket': { tanggal: '17.10.26' },
  'y2k-hewan-virtual': { nama: '[NAMA]' },
  'y2k-kotak-masuk-mms': { nama: '[NAMA]', nama2: '[NAMA]' },
  'y2k-panggilan-video': { nama: '[NAMA]', nama2: '[NAMA]' },
  'y2k-voucher-pulsa': { nama: '[NAMA]' },
}

/** file desain acuan per template */
export const Y2K_REFERENCE: Record<string, string> = {
  'y2k-jendela-desktop': 'jendela-desktop',
  'y2k-flip-phone': 'flip-phone',
  'y2k-aplikasi-gambar': 'aplikasi-gambar',
  'y2k-folder-foto': 'folder-foto',
  'y2k-pemutar-media': 'pemutar-media',
  'y2k-photo-sticker': 'photo-sticker',
  'y2k-messenger-gel': 'messenger-gel',
  'y2k-cd-single': 'cd-single',
  'y2k-disket': 'disket',
  'y2k-hewan-virtual': 'hewan-virtual',
  'y2k-kotak-masuk-mms': 'kotak-masuk-mms',
  'y2k-panggilan-video': 'panggilan-video',
  'y2k-voucher-pulsa': 'voucher-pulsa',
}

export const CATEGORY: DesignCategory = {
  id: 'y2k',
  folder: 'y2k-aesthetic',
  complete: true,
  templates: Y2K_TEMPLATES,
  sampleTexts: Y2K_SAMPLE_TEXTS,
  reference: Y2K_REFERENCE,
}
