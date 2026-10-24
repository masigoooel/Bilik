# Panduan: memindahkan template desain HTML ke Canvas 2D

Acuan: `design-reference/<folder>/*.html`. Contoh yang sudah selesai dan lolos uji: `src/templates/y2k/`.
Baca minimal `src/templates/y2k/jendela-desktop.ts`, `pemutar-media.ts`, `photo-sticker.ts`, `flip-phone.ts` dan `src/templates/paint.ts` sebelum mulai.

## Aturan dari pemilik proyek
- Satu file per template di `src/templates/<vibe>/`, mengikuti tipe `Template` (`src/templates/types.ts`).
- Slot foto diukur dari desain (kotak bertulisan FOTO / STILL / DEPAN / SAMPING / LOOK / ADEGAN / PLAT / SPESIMEN / POTRET). Slot bernomor (FOTO 1, FOTO 2) diurutkan menurut nomornya; label tanpa nomor menurut urutan di HTML.
- Teks kurung siku (`[NAMA]`, `[TEMPAT]`, ...) dipetakan ke field `nama`, `nama2`, `tempat`, `tanggal`, `catatan`.
- Semua dekorasi (latar, bingkai, ikon, ornamen, teks tetap) digambar ulang dengan Canvas 2D di `draw.under` / `draw.over`.
  **Dilarang** memakai screenshot atau gambar statis.
- Font desain dimuat lewat Google Fonts (field `fonts`), dengan spesifikasi yang sama seperti `<link>` di file desain.
- Filter warna default per kategori sudah diset oleh `defineDesign` di `src/templates/<vibe>/define.ts`.
- Kata tidak boleh terpotong di tengah. Teks panjang **dikecilkan** (`maxWidth` di `text()`), bukan dipotong.
- Copy tambahan (kalau perlu) huruf kecil, kalem, bahasa Indonesia.

## Alur kerja per template
Jalankan dari folder `bilik/`. Dev server sudah jalan di `http://localhost:5179` (jangan dimatikan / dijalankan ulang).

1. `node scripts/design/measure.mjs <folder>` sekali per kategori: screenshot acuan + `_ref/measure.json`
   (posisi slot + setiap teks: x, y = **sisi atas kotak konten teks**, ukuran, font, warna).
2. `node scripts/design/dump.mjs <folder> <file>.html`: pohon elemen dengan posisi absolut, background, border, radius, box-shadow, transform.
   Ini sumber angka untuk menggambar ulang. Gunakan angka hasil ukur, jangan menghitung layout flex dengan tangan.
3. Tulis `src/templates/<vibe>/<nama-file>.ts`, daftarkan di `src/templates/<vibe>/index.ts`
   (`templates`, `sampleTexts`, `reference`).
4. `node scripts/design/compare.mjs <vibe> [potongan-id]`: render canvas vs screenshot desain, di luar area slot.
   Hasil gambar (desain | canvas | peta selisih) di `design-reference/<folder>/_ref/compare/<id>.png`. **Lihat gambarnya**, jangan hanya angkanya.
5. Ulangi sampai selisih < 1% piksel (desain dengan rotasi boleh ~1–2% karena anti-aliasing) dan tidak ada beda yang terlihat.
   `compare.mjs` juga mencetak **dalam slot**: slot diisi "foto" polos sewarna `placeholder`, ikon/label di tengah slot ditutup, ambang 8.
   Ini yang menguji bayangan inset dan lapisan halus di atas foto (di gambar compare: merah = luar slot, biru = dalam slot).
   Angka tinggi wajar kalau kotak FOTO di desain memakai `filter` (sepia/grayscale) atau bergradasi/berpola; lihat gambarnya.
6. `npx tsc --noEmit -p tsconfig.app.json`: error di folder kategorimu harus 0 (abaikan error folder lain yang sedang dikerjakan orang lain).

## Struktur file template
```ts
import { box, border, text, ... } from '../paint'
import { klasik } from './define'          // pembuat template kategori (set category, format, filter default)

export const bingkaiGaris = klasik({
  id: 'klasik-bingkai-garis',              // wajib diawali "<vibe>-"
  name: 'bingkai garis',                   // huruf kecil
  width: 1080, height: 1350, photoCount: 1,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E4E2DD',                  // warna kotak FOTO di desain
  fonts: ['Instrument Serif:400,400i', 'IBM Plex Mono:400,600'],
  fields: ['tanggal', 'tempat'],           // field yang dipakai draw()
  texture: { opacity: 0.05, blend: 'multiply' },  // kalau desain punya div data-texture="1"
  slots: [{ x: 108, y: 152, w: 864, h: 900 }],
  draw: {
    under(ctx, { texts, W, H }) { ... },   // sebelum foto
    over(ctx, { texts }) { ... },          // sesudah foto: semua yang menimpa area foto
  },
})
```
`index.ts`: `templates: [...]`, `sampleTexts: { id: { nama: '[NAMA]', tanggal: '17.10.26' } }` (nilai yang membuat tulisan **sama persis** dengan desain, untuk uji), `reference: { id: 'nama-file' }`.
Setelah **semua** template kategori selesai dan lolos uji, set `complete: true` (baru saat itu kategori menggantikan template generator di aplikasi).

## Urutan lapisan
- Renderer: latar `background` → `draw.under` → foto (slot) → `draw.over` → `texture` → `draw.top`.
- Apa pun yang di DOM muncul **setelah** kotak foto **dan** menimpa area foto (status bar, stiker, teks di atas foto, kursor, dialog, coretan) masuk `draw.over`.
- Tepi/bayangan inset pada kotak foto itu sendiri (mis. `inset 2px 2px 0 #808080` di kotak FOTO) juga `draw.over` karena di desain tergambar di atas isi.
- `texture` (div `data-texture="1"`, opacity & mix-blend) digambar renderer di atas foto, sama seperti desain.
  Elemen yang di DOM muncul **setelah** div texture (jadi tidak kena noise) masuk `draw.top`.

## Helper `paint.ts` dan cara meniru CSS
- `box(ctx, x, y, w, h, fill, radius)`: background. Radius per sudut `[tl, tr, br, bl]`. Tepi kotak dibulatkan ke piksel penuh seperti Chrome.
- `border(ctx, x, y, w, h, width, color, radius, dash?)`: border CSS di dalam kotak (border-box). Dotted 1px `[1,1]`, dotted 2px `[2,2]`.
  Dashed Chrome (hasil ukur): lebar < 3px → garis 3×lebar, jeda 2×lebar; lebar ≥ 3px → garis 2×lebar, jeda 1×lebar; jeda diregangkan supaya tiap sisi berakhir dengan garis penuh.
  `border(..., dash)` tidak meniru peregangan ini. Garis lurus: `dashedH` di `src/templates/kalcer/helpers.ts`; kotak bulat: `dashedBorder` di `src/templates/cute/helpers.ts` (salin ke helpers kategorimu).
- Font yang hanya dimuat tegak tapi dipakai `font-style: italic` di desain = italic sintetis Chrome: tiru dengan skewX (lihat `fauxItalic` di `src/templates/kalcer/helpers.ts`), jangan minta face italic.
  Teks dengan letter-spacing yang harus tetap ber-kerning: lihat `spacedText` di helper yang sama (`ctx.letterSpacing` + satu `fillText`).
- `insetShadows(ctx, x, y, w, h, [{dx, dy, blur?, color}], radius)`: `box-shadow: inset ...` (urutan sama dengan CSS, yang pertama paling atas). Inset digambar di **padding box** (di dalam border; radius dikurangi lebar border).
- `dropShadow(ctx, x, y, w, h, dx, dy, blur, color, radius)`: `box-shadow` luar. Sudah dipotong supaya tidak tampak di bawah kotaknya (penting untuk kotak semi-transparan). Gambar **sebelum** kotaknya.
- Gradien: `linear(ctx, x, y, w, h, sudutCSS, stops)` (tanpa sudut di CSS = 180deg), `radial(ctx, cx, cy, r, stops)`.
  `radial-gradient(circle at X% Y%, ...)`: ukuran default farthest-corner. `transparent` → pakai warna yang sama dengan alpha 0 (bukan hitam transparan).
  `repeating-*-gradient`: gambar strip/kotak dengan loop.
- `svg(ctx, d, x, y, w, h, vbW, vbH, {fill, stroke, lineWidth, lineCap, lineJoin, dash, rotate})`: path SVG via Path2D. `rotate` di titik tengah kotak (= CSS transform default).
  `<svg>` inline memotong isi di luar viewport-nya (overflow hidden): kalau path bisa keluar, clip dulu.
- Gradien SVG `linearGradient` default `objectBoundingBox`: pakai `metalGradient(ctx, bbox)` / `ICON_BBOX` sebagai contoh rumusnya.
- `font()` / opsi `family`: nama satu font dikutip otomatis; boleh juga daftar cadangan CSS apa adanya (`'"Courier Prime", monospace'`).
- `text(ctx, s, x, y, {family, size, weight, italic, color, align, letterSpacing, maxWidth, stroke})`:
  **y = sisi atas kotak konten teks** = nilai `y` di `measure.json` (bukan y kotak elemen). `align` center/right memakai x tengah / x kanan.
  `letter-spacing` em → px (`0.2em` × 16px = 3.2). `text-transform: uppercase` → ubah string. `-webkit-text-stroke` + `paint-order: stroke fill` → opsi `stroke` (lebar = nilai CSS).
  Teks di tengah kotak flex: `textMid(ctx, s, x, boxY, boxH, opts)`.
  `line-height` angka (mis. 0.9 / 1): kotak baris = size × lh; kotak konten dipusatkan di dalamnya: `top = lineTop + (size*lh - contentHeight(...)) / 2`.
- `measure(ctx, s, font)` untuk lebar teks (pil/badge yang lebarnya mengikuti teks).
- Transform CSS di elemen induk (rotate dengan `transform-origin` tertentu): bungkus dengan `ctx.save(); translate(origin); rotate; translate(-origin)` lalu gambar dengan koordinat lokal yang **belum** diputar (lihat `flip-phone.ts`). Slot di dalam elemen berputar: pakai x/y/w/h hasil `measure.json` (sudah pusat sebenarnya) + `rotate` derajat.
- `clip-path: polygon(...)` → `ctx.beginPath(); moveTo/lineTo...; ctx.clip()` lalu gambar isi.
- `overflow: hidden` + radius → clip dengan `rrPath` sebelum menggambar anak.
- `opacity` elemen → `ctx.globalAlpha`. `mix-blend-mode` → `globalCompositeOperation`.
- `filter: grayscale/sepia/contrast` di kotak FOTO berarti desainer ingin foto berwarna seperti itu: jangan digambar ulang; ganti filter default template ke preset terdekat (`src/render/filters.ts`, mis. `mono`, `mono-kontras`, `noir`, `sepia`) dan catat di laporan.
- `filter: drop-shadow(...)` pada teks → gambar teks yang sama (+stroke) dengan warna bayangan di posisi offset, sebelum teks aslinya.
- Font yang disebut di `font-family` tapi **tidak** dimuat `<link>` desain: lihat screenshot acuan (font cadangan apa yang tampil). Kalau cadangannya font sistem yang tidak ada di HP (mis. Arial Black), pakai font Google yang dimaksud desain dan catat.
- Glyph simbol (★ ♥ ▶ ⏮ ▮) memakai font cadangan sistem; posisikan dengan y hasil ukur saja.

## Field teks
| Di desain | Field |
|---|---|
| `[NAMA]` pertama | `nama` |
| `[NAMA]` kedua, `[NAMA 2]` | `nama2` |
| `[TEMPAT]`, `[KOTA]`, `[VENUE]`, `[NAMA TEMPAT]`, `[TUJUAN]` | `tempat` |
| tanggal contoh (17.10.26, 17 Oktober 2026, 17/10/26, 17 OKT 2026, ...) | `tanggal` (tulis apa adanya dari user) |
| `[CATATAN]`, `[PESAN]`, `[STATUS]`, `[TEKS]`, `[JUDUL ...]`, `[KETERANGAN]` | `catatan` |

Kurung siku lain tanpa field yang cocok (`[A]`/`[B]` inisial, `[TAHUN]`, `[KELAS]`, `[SKILL]`, `[ITEM]`, `[JUMLAH]`, `[NAMA BAND]`, `[LABEL]`, ...):
pakai field paling dekat bila masuk akal (inisial = huruf pertama `nama`/`nama2`, `[TAHUN]` = tahun dari teks tanggal kalau ada 4 digit, `[NAMA BAND]`/`[NAMA GENG]` = `nama`),
selain itu teks tetap pendek yang kalem dan cocok dengan tema (huruf kecil kecuali gaya desain memang kapital). **Jangan pernah** menggambar teks berkurung siku apa adanya di hasil.
Field kosong: sembunyikan elemen itu (atau pakai fallback netral), jangan sisakan tanda baca atau label yang menggantung.
Teks yang lebarnya mengikuti isi (pil, badge, kotak): hitung dengan `measure()`, jangan pakai lebar tetap desain.

## Jangan
- Mengubah file bersama: `src/templates/paint.ts`, `src/render/*`, `src/templates/types.ts`, `src/templates/index.ts`, `src/templates/designs/*`, kategori lain, `scripts/design/*`.
  Helper tambahan taruh di folder kategorimu sendiri (mis. `src/templates/<vibe>/helpers.ts`). Bug di file bersama: laporkan, jangan perbaiki sendiri.
- Menjalankan/mematikan dev server, `npm install`, atau mengubah `package.json`.
- Menyerah dengan "kira-kira": ukur.

## Pelajaran dari pemindahan set 145 template (2026-10-21)
- Desain baru umumnya memberi kotak FOTO `box-shadow: inset 0 0 0 1px rgba(0,0,0,.12), inset 0 3px 8px rgba(0,0,0,.16)`:
  `insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 0, spread: 1, color: 'rgba(0,0,0,.12)' }, { dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,.16)' }], radius)` di `draw.over`.
  `spread` kini didukung, dan varian blur tidak lagi membocorkan garis hitam di tepi bentuk bulat.
- Elemen `data-detail="1"` (kilau, vinyet, titik halus) ikut digambar sesuai urutannya di DOM (biasanya `draw.over`/`draw.top`).
- `filter: drop-shadow(... blur)` dan `filter: blur()` memakai deviasi standar: `shadowBlur` canvas = **2×** nilai CSS (box-shadow tetap 1×).
- `-webkit-text-stroke` + `paint-order: stroke fill` + `text-shadow`: Chrome menggambar garis tepi → bayangan (bentuk isi saja) → isi.
- Elemen ber-`transform: scale()` dibulatkan Chrome ke piksel penuh: angka pecahan dari dump/measure bisa meleset ±0,5px.
  `measure.mjs` sekarang mencatat `scale`/`rotate` slot dan w/h yang sudah diskala (radius belum).
- Gradien canvas tidak diinterpolasi premultiplied seperti CSS: stop buram → rgba transparan berwarna lain menghasilkan pita gelap.
  `linear()`/`radial()` sengaja dibiarkan apa adanya (template yang ada sudah disetel dengan perilaku ini); tambahkan stop antara di helper kategorimu.
- Dashed 3px Chrome (diukur di tiket-wahana): jumlah dash = round((panjang + lebar) / (3 × lebar)), posisi boleh pecahan.
- Font yang hanya dimuat dengan bobot tertentu (mis. Caveat 700, Outfit 500/700) tampil dengan bobot yang dimuat walau CSS menulis 400: pakai bobot itu.
- Slot elips (`border-radius: 50%` pada kotak tidak persegi) belum didukung tipe `Slot`: pakai radius terbesar, lalu timpa sudut di luar elips di `draw.over`.
- Scratchpad dipakai bersama banyak agen: simpan skrip bantu di subfolder sendiri (`scratchpad/<kategori>/`).
