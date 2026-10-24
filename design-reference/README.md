# Template bilik (145 template)

- `manifest.json`: daftar semua template (id, nama, kategori, file, ukuran asli px, jumlah foto, font).
- Slot foto = placeholder berikon kamera dengan label `FOTO 1`, `FOTO 2`, dst. Beberapa template memakai label lain
  (`STILL`, `DEPAN`, `SAMPING`, `ADEGAN`, `PLAT`, `SPESIMEN`, `POTRET`); urutannya mengikuti urutan kemunculan di HTML.
- Teks dalam kurung siku (`[NAMA]`, `[TEMPAT]`, `[KOTA]`, `[BAND]`, dll) = teks yang bisa diganti user.
- `{{bg}}`, `{{c}}`, `{{c2}}`, `{{accent}}` = warna yang bisa diganti; default dan pilihannya ada di atribut
  `data-props` (tag script di akhir file).
- `usesLoops: true` = template memakai `sc-for`; daftar datanya perlu ditulis langsung sekali sebelum dipakai.
