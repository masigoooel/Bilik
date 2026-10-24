// Tekstur noise yang dipakai hampir semua file desain (data-texture="1"):
// SVG 300x300 feTurbulence fractalNoise baseFrequency 0.9, numOctaves 2, desaturasi.
// Dirasterisasi sekali oleh browser supaya identik dengan desain.

const SVG =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22300%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%222%22%20stitchTiles%3D%22stitch%22/%3E%3CfeColorMatrix%20type%3D%22saturate%22%20values%3D%220%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23n%29%22/%3E%3C/svg%3E"

let tile: Promise<HTMLCanvasElement> | null = null

/** noise cadangan kalau browser menolak membaca hasil SVG (kanvas "tainted") */
function fallback() {
  const c = document.createElement('canvas')
  c.width = c.height = 300
  const x = c.getContext('2d')!
  const img = x.createImageData(300, 300)
  let s = 1234567
  for (let i = 0; i < img.data.length; i += 4) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const v = 60 + ((s >> 8) % 140)
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  x.putImageData(img, 0, 0)
  return c
}

export function designTexture(): Promise<HTMLCanvasElement> {
  tile ??= new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = c.height = 300
      const x = c.getContext('2d', { willReadFrequently: true })!
      try {
        x.drawImage(img, 0, 0, 300, 300)
        x.getImageData(0, 0, 1, 1) // lempar error kalau tainted → jangan sampai mencemari kanvas hasil
        resolve(c)
      } catch {
        resolve(fallback())
      }
    }
    img.onerror = () => resolve(fallback())
    img.src = SVG
  })
  return tile
}
