// Penghubung stiker wajah ↔ kamera: tipe wajah dari detektor, peta koordinat video → kanvas, dan penghalus
// multi-wajah. Gambar stikernya sendiri ada di src/effects/faceStickers.ts.
import { W, type Head } from '../effects/faceStickers'

/** efek mati */
export const NO_MOTION = 'tanpa'

type P = { x: number; y: number }

/** peta titik video mentah (0–1) → piksel kanvas keluaran (sudah memperhitungkan crop & cermin) */
export type FrameMap = (fx: number, fy: number) => [number, number]

/** wajah dari deteksi wajah biasa (lensa "ikuti wajah"): semua 0–1 relatif frame video mentah */
export type RawFace = { x: number; y: number; w: number; h: number; eyes?: [P, P]; nose?: P; mouth?: P }

/** wajah dari Face Landmarker: titik 0–1 relatif video mentah (pusat kepala, pipi kiri & kanan, dahi, dagu) */
export type MeshFace = { cx: number; cy: number; left: P; right: P; top: P; chin: P }

/**
 * HEAD untuk stiker (koordinat kanvas acuan W): titik tengah kepala, r = setengah lebar wajah pipi ke pipi,
 * sudut miring dari garis pipi. `w` = lebar kanvas yang sedang digambar.
 */
export function headFrom(f: MeshFace, map: FrameMap, w: number): Head {
  const k = w / W
  const [x, y] = map(f.cx, f.cy)
  let [lx, ly] = map(f.left.x, f.left.y)
  let [rx, ry] = map(f.right.x, f.right.y)
  // setelah dicerminkan pipi kiri bisa ada di kanan: sudut selalu dari kiri layar ke kanan layar
  if (lx > rx) [lx, ly, rx, ry] = [rx, ry, lx, ly]
  return { x: x / k, y: y / k, r: Math.hypot(rx - lx, ry - ly) / 2 / k, angle: Math.atan2(ry - ly, rx - lx) }
}

type MeshIn = { face: MeshFace; seenAt: number; lostAt: number | null } | null
export type MeshShown = { slot: number; face: MeshFace; vis: number }

/**
 * Penghalus multi-wajah: lerp ±0,3 per frame (dihitung untuk 30 fps) ke hasil deteksi terbaru, dan pudar per wajah
 * (wajah hilang → stiker memudar habis, muncul lagi saat terdeteksi). Hanya preview yang memajukan (`sample`);
 * jepret & rekaman memakai keadaan yang sedang tampil (`peek`), jadi hasil sama dengan yang terlihat.
 */
export class MeshSmoother {
  private shown: (MeshFace | null)[] = []
  private vis: number[] = []
  private out: MeshShown[] = []
  private last = 0

  peek() {
    return this.out
  }

  sample(slots: MeshIn[], now = performance.now()): MeshShown[] {
    const dt = this.last ? Math.min(0.25, (now - this.last) / 1000) : 1
    this.last = now
    const k = 1 - Math.pow(0.7, dt * 30)
    const fade = 1 - Math.exp(-dt / 0.25)
    const lerp = (a: number, b: number) => a + (b - a) * k
    const lp = (a: P, b: P) => ({ x: lerp(a.x, b.x), y: lerp(a.y, b.y) })
    this.out = []
    const n = Math.max(slots.length, this.shown.length)
    for (let i = 0; i < n; i++) {
      const s = slots[i] ?? null
      const prev = this.shown[i] ?? null
      const seen = !!s && s.lostAt === null
      const vis = (this.vis[i] ?? 0) + ((seen ? 1 : 0) - (this.vis[i] ?? 0)) * fade
      this.vis[i] = vis
      let next = prev
      if (s && seen) {
        const f = s.face
        // muncul lagi setelah hilang: langsung di posisi baru (tidak meluncur dari posisi lama)
        next =
          prev && vis > 0.05
            ? { cx: lerp(prev.cx, f.cx), cy: lerp(prev.cy, f.cy), left: lp(prev.left, f.left), right: lp(prev.right, f.right), top: lp(prev.top, f.top), chin: lp(prev.chin, f.chin) }
            : f
      }
      this.shown[i] = vis < 0.01 && !seen ? null : next
      if (next && vis >= 0.01) this.out.push({ slot: i, face: next, vis })
    }
    return this.out
  }
}
