import { useEffect, useState } from 'react'
import { Shell, Stage } from '../components/Screen'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { renderTemplate, type PhotoSource } from '../render/renderTemplate'
import { canvasToPng, loadImage } from '../lib/photo'
import { templateById } from '../templates'
import { useApp } from '../state/AppState'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
/** layar ini tampil minimal segini supaya tidak sekadar berkedip */
const MIN_MS = 900

export function RenderingScreen() {
  const { templateId, photos, renderTexts, hue, setResult, go, back } = useApp()
  const t = templateById(templateId)
  const [progress, setProgress] = useState(0.04)
  const [caption, setCaption] = useState('menyiapkan foto')
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!t) return
    let alive = true
    const started = performance.now()
    setFailed(false)
    setProgress(0.04)
    ;(async () => {
      try {
        const n = t.photoCount
        const sources: PhotoSource[] = []
        for (let i = 0; i < n; i++) {
          const p = photos[i]
          if (!p) throw new Error(`foto ${i + 1} kosong`)
          setCaption(n > 1 ? `menyiapkan foto ${i + 1}/${n}` : 'menyiapkan foto')
          const img = await loadImage(p.url)
          if (!alive) return
          sources.push({ source: img, width: img.naturalWidth, height: img.naturalHeight })
          setProgress(0.08 + 0.52 * ((i + 1) / n))
        }
        setCaption('menyusun template')
        setProgress(0.72)
        await sleep(16)
        const canvas = await renderTemplate(t, { photos: sources, texts: renderTexts, hue })
        if (!alive) return
        setCaption('menyimpan sebagai png')
        setProgress(0.88)
        await sleep(16)
        const blob = await canvasToPng(canvas)
        canvas.width = canvas.height = 0
        if (!alive) return
        setProgress(1)
        setCaption('selesai')
        await sleep(Math.max(250, MIN_MS - (performance.now() - started)))
        if (!alive) return
        setResult({ blob, url: URL.createObjectURL(blob) })
        // ganti entri history: tombol kembali dari hasil langsung ke cek hasil
        go('result', { replace: true })
      } catch {
        if (alive) setFailed(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [attempt])

  if (!t) return null
  const pct = Math.round(progress * 100)

  const status = (
    <div className="w-full max-w-[360px]">
      <h1 className="heading text-[34px] font-extrabold lg:text-[40px]">{failed ? 'gagal merender.' : 'merender…'}</h1>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="progres render"
        className="mt-6 h-2 w-full overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="label-mono text-muted" aria-live="polite">
          {failed ? 'ada yang tidak beres saat menyusun foto.' : caption}
        </p>
        <span className="label-mono text-muted">{pct}%</span>
      </div>
      {failed ? (
        <div className="mt-8 flex flex-col gap-3">
          <Button onClick={() => setAttempt((a) => a + 1)}>coba lagi</Button>
          <Button variant="secondary" onClick={back}>
            kembali ke cek hasil
          </Button>
        </div>
      ) : (
        <p className="mt-8 text-[14px] leading-snug text-muted">
          {t.width}×{t.height} px, diproses di perangkatmu. tidak ada yang diunggah.
        </p>
      )}
    </div>
  )

  return (
    <Shell
      stage={
        <Stage hideLogo>
          <Logo size={96} animated={!failed} />
        </Stage>
      }
    >
      <div className="pt-safe pb-safe flex min-h-dvh flex-col items-center justify-center px-4 lg:min-h-full lg:items-start lg:px-10">
        <Logo size={48} animated={!failed} className="mb-8 lg:hidden" />
        {status}
      </div>
    </Shell>
  )
}
