import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** file statis di public/ yang ikut disimpan untuk offline (model wajah di models/ tidak: baru diunduh & disimpan saat efeknya dipakai) */
function publicFiles(dir = 'public', base = ''): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? publicFiles(`${dir}/${d.name}`, `${base}${d.name}/`) : [`${base}${d.name}`],
  )
}

/**
 * Service worker untuk PWA/offline, tanpa dependensi: daftar file hasil build disisipkan ke sw.template.js.
 * Font .woff lama dilewati (browser modern memakai .woff2).
 */
function serviceWorker(): Plugin {
  return {
    name: 'bilik-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const built = Object.keys(bundle).filter((f) => !f.endsWith('.map') && !f.endsWith('.woff'))
      // index.html dibuat Vite setelah tahap ini, jadi ditambahkan manual (dipakai saat offline)
      const files = ['/', '/index.html', ...[...built.filter((f) => f !== 'index.html'), ...publicFiles().filter((f) => !f.startsWith('models/'))].map((f) => `/${f}`)]
      const version = createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 10)
      const source = readFileSync('sw.template.js', 'utf8').replace("'__VERSION__'", `'${version}'`).replace('= __PRECACHE__', `= ${JSON.stringify(files)}`)
      this.emitFile({ type: 'asset', fileName: 'sw.js', source })
    },
  }
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }

export default defineConfig({
  plugins: [react(), tailwindcss(), serviceWorker()],
  // worker deteksi wajah memakai import modul (MediaPipe memuat mesin wasm dengan import())
  worker: { format: 'es' },
  // versi app (dari package.json) untuk tautan "kirim masukan · versi …"
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
})
