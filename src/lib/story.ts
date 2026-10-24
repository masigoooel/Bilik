// Versi story 9:16 (IG/TikTok/WA story) dari hasil foto: hasil di tengah, latar = hasil yang sama diburamkan.
import { loadImage } from './photo'

export const STORY = { width: 1080, height: 1920 }

/** blur murah & sama di semua browser (Safari tidak punya ctx.filter): perkecil lalu perbesar dengan smoothing */
function blurredCover(img: HTMLImageElement, W: number, H: number) {
  const k = Math.max(W / img.naturalWidth, H / img.naturalHeight)
  const w = img.naturalWidth * k
  const h = img.naturalHeight * k
  const small = document.createElement('canvas')
  small.width = Math.max(1, Math.round(W / 28))
  small.height = Math.max(1, Math.round(H / 28))
  const sx = small.getContext('2d')!
  sx.imageSmoothingQuality = 'high'
  sx.drawImage(img, (W - w) / 2 / 28, (H - h) / 2 / 28, w / 28, h / 28)
  return small
}

export async function makeStory(src: Blob): Promise<Blob> {
  const url = URL.createObjectURL(src)
  try {
    const img = await loadImage(url)
    const { width: W, height: H } = STORY
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const x = c.getContext('2d', { alpha: false })!
    x.imageSmoothingEnabled = true
    x.imageSmoothingQuality = 'high'
    x.drawImage(blurredCover(img, W, H), 0, 0, W, H)
    // latar sedikit diredupkan supaya hasilnya menonjol
    x.fillStyle = 'rgba(17,17,17,0.18)'
    x.fillRect(0, 0, W, H)

    // hasil dimuat utuh: maks 84% lebar, tinggi menyisakan ruang aman atas/bawah untuk UI story
    const k = Math.min((W * 0.84) / img.naturalWidth, (H - 2 * 250) / img.naturalHeight)
    const w = Math.round(img.naturalWidth * k)
    const h = Math.round(img.naturalHeight * k)
    const px = Math.round((W - w) / 2)
    const py = Math.round((H - h) / 2)
    x.save()
    x.shadowColor = 'rgba(0,0,0,0.35)'
    x.shadowBlur = 60
    x.shadowOffsetY = 24
    x.fillStyle = '#ffffff'
    x.fillRect(px, py, w, h)
    x.restore()
    x.drawImage(img, px, py, w, h)

    return await new Promise<Blob>((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('story gagal'))), 'image/jpeg', 0.92))
  } finally {
    URL.revokeObjectURL(url)
  }
}
