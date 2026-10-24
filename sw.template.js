// Service worker bilik (dibuat saat build oleh plugin di vite.config.ts; versi & daftar file diisi otomatis).
// Tujuan: aplikasi tetap bisa dibuka & dipakai tanpa sinyal setelah sekali dibuka saat online.
// Foto tidak pernah lewat sini: kamera & render semuanya di perangkat.
const VERSION = '__VERSION__'
const PRECACHE = __PRECACHE__
const APP = `bilik-app-${VERSION}`
const RUNTIME = 'bilik-runtime-v1'

// sumber luar yang boleh disimpan untuk offline: font template (Google Fonts) & deteksi wajah (MediaPipe)
const CACHEABLE = [/^https:\/\/fonts\.googleapis\.com\//, /^https:\/\/fonts\.gstatic\.com\//, /^https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe\//, /^https:\/\/storage\.googleapis\.com\/mediapipe-models\//]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(APP)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('bilik-app-') && k !== APP).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

async function fromCache(req) {
  return (await caches.match(req, { ignoreSearch: false })) ?? null
}

async function cacheFirst(req) {
  const hit = await fromCache(req)
  if (hit) return hit
  const res = await fetch(req)
  if (res.ok || res.type === 'opaque') (await caches.open(RUNTIME)).put(req, res.clone())
  return res
}

// halaman: coba jaringan dulu (versi terbaru), kalau offline pakai index.html tersimpan
async function page(req) {
  try {
    const res = await fetch(req)
    if (res.ok) (await caches.open(APP)).put('/index.html', res.clone())
    return res
  } catch {
    return (await caches.match('/index.html')) ?? Response.error()
  }
}

// CSS Google Fonts: pakai yang tersimpan, perbarui di belakang
async function staleWhileRevalidate(req) {
  const hit = await fromCache(req)
  const update = fetch(req)
    .then(async (res) => {
      if (res.ok) (await caches.open(RUNTIME)).put(req, res.clone())
      return res
    })
    .catch(() => null)
  return hit ?? (await update) ?? Response.error()
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (req.mode === 'navigate' && url.origin === self.location.origin) return e.respondWith(page(req))
  if (url.origin === self.location.origin) return e.respondWith(cacheFirst(req))
  if (url.hostname === 'fonts.googleapis.com') return e.respondWith(staleWhileRevalidate(req))
  if (CACHEABLE.some((r) => r.test(req.url))) return e.respondWith(cacheFirst(req))
})
