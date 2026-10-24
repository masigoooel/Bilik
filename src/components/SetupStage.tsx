import { useEffect, useState } from 'react'
import type { Template, TextValues } from '../templates'
import { FORMATS, TEMPLATES, templateById, templatesFor, vibeById } from '../templates'
import { useApp } from '../state/AppState'
import { Stage } from './Screen'
import { TemplateThumb } from './TemplateThumb'

/** tinggi stage desktop dalam px, dipakai untuk resolusi render preview */
function useStageHeight(ratio = 0.74) {
  const [h, setH] = useState(() => Math.round(window.innerHeight * ratio))
  useEffect(() => {
    let t: number | undefined
    const on = () => {
      clearTimeout(t)
      t = window.setTimeout(() => setH(Math.round(window.innerHeight * ratio)), 200)
    }
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [ratio])
  return h
}

export function BigPreview({ template, texts, hue }: { template: Template; texts?: Partial<TextValues>; hue?: number }) {
  const h = useStageHeight()
  const w = Math.round((h * template.width) / template.height)
  return (
    <div className="flex max-h-full max-w-full flex-col items-center">
      <div
        className="max-w-full shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
        style={{ height: h, aspectRatio: `${template.width} / ${template.height}` }}
      >
        <TemplateThumb template={template} width={w} texts={texts} hue={hue} className="h-full" alt={`preview template ${template.name}`} />
      </div>
    </div>
  )
}

/** stage kiri untuk langkah setup: preview template sesuai pilihan sejauh ini */
export function SetupStage({ live = false }: { live?: boolean }) {
  const { count, category, templateId, renderTexts, hue } = useApp()
  const t =
    templateById(templateId) ??
    (count && category ? templatesFor(count, category)[0] : null) ??
    (count ? templatesFor(count)[0] : null) ??
    templateById('klasik-strip-klasik') ??
    TEMPLATES[0]
  const vibe = vibeById(t.category)

  return (
    <Stage>
      <BigPreview template={t} texts={live ? renderTexts : undefined} hue={live ? hue : 0} />
      <div className="label-mono absolute bottom-6 left-8 text-muted">
        {vibe?.name.toLowerCase()} · {t.name} · {FORMATS[t.format].label} · {t.width}×{t.height}
      </div>
    </Stage>
  )
}
