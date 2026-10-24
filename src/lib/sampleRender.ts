// Render template dengan foto contoh ke url gambar (jpeg), sekali per template & resolusi. Dipakai etalase beranda & laman tentang.
import type { Template } from '../templates'
import { renderTemplate } from '../render/renderTemplate'
import { samplePhotos } from './samples'
import { SAMPLE_TEXTS } from '../components/TemplateThumb'

const images = new Map<string, Promise<string>>()

/** `px` = tinggi render; `offset` = foto contoh pertama (supaya kartu bersebelahan tidak memakai foto yang sama) */
export function sampleRender(t: Template, px: number, offset: number) {
  const key = `${t.id}@${px}`
  let p = images.get(key)
  if (!p) {
    p = samplePhotos().then(async (photos) => {
      const shots = Array.from({ length: t.photoCount }, (_, i) => photos[(offset + i) % photos.length])
      const canvas = await renderTemplate(t, { photos: shots, texts: SAMPLE_TEXTS, scale: px / t.height })
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.9))
      canvas.width = canvas.height = 0
      return blob ? URL.createObjectURL(blob) : ''
    })
    images.set(key, p)
  }
  return p
}
