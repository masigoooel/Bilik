// Rekaman pendek dari kamera selama hitung mundur, untuk boomerang.
// Frame direkam dengan lensa tapi tanpa filter (filter diterapkan saat boomerang dibuat),
// jadi boomerang ikut kalau filter diganti di cek hasil.

const LONG_SIDE = 360
const EVERY_MS = 83 // ±12 fps
const RING = 14

export class BurstRecorder {
  private ring: HTMLCanvasElement[] = []
  /** lapisan stiker wajah per frame (transparan); `hasLayer` = frame itu punya stiker */
  private layers: HTMLCanvasElement[] = []
  private hasLayer: boolean[] = []
  private head = 0
  private filled = 0
  private timer = 0

  /**
   * mulai merekam. `draw` menggambar satu frame (orientasi & lensa foto akhir, tanpa filter) ke kanvas w×h,
   * dan stiker wajah (kalau ada) ke `layer` yang transparan; mengembalikan false kalau kamera belum siap,
   * atau { stickers } = ada stiker yang digambar. `aspect` = rasio slot.
   */
  start(draw: (dst: HTMLCanvasElement, layer: HTMLCanvasElement, w: number, h: number) => false | { stickers: boolean }, aspect: number) {
    this.stop()
    this.head = 0
    this.filled = 0
    const w = Math.round(aspect >= 1 ? LONG_SIDE : LONG_SIDE * aspect)
    const h = Math.round(aspect >= 1 ? LONG_SIDE / aspect : LONG_SIDE)
    this.timer = window.setInterval(() => {
      let dst = this.ring[this.head]
      if (!dst) dst = this.ring[this.head] = document.createElement('canvas')
      let layer = this.layers[this.head]
      if (!layer) layer = this.layers[this.head] = document.createElement('canvas')
      if (layer.width !== w || layer.height !== h) {
        layer.width = w
        layer.height = h
      } else layer.getContext('2d')!.clearRect(0, 0, w, h)
      const res = draw(dst, layer, w, h)
      if (!res) return
      this.hasLayer[this.head] = res.stickers
      this.head = (this.head + 1) % RING
      this.filled = Math.min(RING, this.filled + 1)
    }, EVERY_MS)
  }

  stop() {
    clearInterval(this.timer)
    this.timer = 0
  }

  /**
   * `n` frame terakhir (lama → baru) sebagai JPEG kecil, plus lapisan stiker PNG per frame kalau ada stiker;
   * encode di luar main thread lewat toBlob
   */
  async take(n = 10): Promise<{ frames: Blob[]; stickers?: Blob[] }> {
    const count = Math.min(n, this.filled)
    const idx: number[] = []
    for (let i = count; i >= 1; i--) idx.push((this.head - i + RING) % RING)
    const enc = (c: HTMLCanvasElement, type: string, q?: number) => new Promise<Blob | null>((r) => c.toBlob(r, type, q))
    const frames = await Promise.all(idx.map((i) => enc(this.ring[i], 'image/jpeg', 0.85)))
    const ok = frames.every((b) => !!b)
    if (!ok) return { frames: frames.filter((b): b is Blob => !!b) }
    if (!idx.some((i) => this.hasLayer[i])) return { frames: frames as Blob[] }
    const stickers = await Promise.all(idx.map((i) => enc(this.layers[i], 'image/png')))
    return stickers.every((b) => !!b) ? { frames: frames as Blob[], stickers: stickers as Blob[] } : { frames: frames as Blob[] }
  }

  dispose() {
    this.stop()
    for (const c of [...this.ring, ...this.layers]) c.width = c.height = 0
    this.ring = []
    this.layers = []
  }
}
