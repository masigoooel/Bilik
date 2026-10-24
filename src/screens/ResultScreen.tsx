import { useEffect, useMemo, useRef, useState } from 'react'
import { Screen, Stage } from '../components/Screen'
import { Button } from '../components/Button'
import { fileStamp } from '../lib/date'
import { STORY, makeStory } from '../lib/story'
import { printResult } from '../lib/print'
import { bakeStickers, type Sticker } from '../lib/stickers'
import { StickerEditor } from '../components/StickerEditor'
import { useIdleCountdown } from '../state/booth'
import { BOOMERANG_SIDE, canBoomerang, makeBoomerang } from '../lib/boomerang'
import type { Template, TextValues } from '../templates'
import type { Photo } from '../lib/photo'
import { templateById } from '../templates'
import { useApp } from '../state/AppState'
import { useStartCamera } from '../state/useStartCamera'

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 9V4h10v5M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 14h10v6H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V4m0 0L8 8m4-4l4 4M6 12v6a2 2 0 002 2h8a2 2 0 002-2v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Format = 'asli' | 'story' | 'boomerang'

/** versi story 9:16 dibuat sekali per hasil, saat pertama dipilih */
function useStory(blob: Blob | undefined, wanted: boolean) {
  const [story, setStory] = useState<{ src: Blob; blob: Blob; url: string } | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!wanted || !blob || story?.src === blob) return
    let alive = true
    setFailed(false)
    makeStory(blob)
      .then((b) => alive && setStory({ src: blob, blob: b, url: URL.createObjectURL(b) }))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [blob, wanted, story])
  useEffect(() => () => void (story && URL.revokeObjectURL(story.url)), [story])
  return { story: story?.src === blob ? story : null, failed }
}

/** boomerang (GIF) dibuat sekali per hasil, saat pertama dipilih */
function useBoomerang(key: Blob | undefined, t: Template | null, photos: (Photo | null)[], texts: Partial<TextValues>, hue: number, stickers: Sticker[], wanted: boolean) {
  const [gif, setGif] = useState<{ src: Blob; blob: Blob; url: string } | null>(null)
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const busy = useRef(false)
  useEffect(() => {
    if (!wanted || !key || !t || gif?.src === key || busy.current) return
    busy.current = true
    setFailed(false)
    setProgress(0)
    makeBoomerang(t, photos as Photo[], texts, hue, stickers, setProgress)
      .then((b) => setGif({ src: key, blob: b, url: URL.createObjectURL(b) }))
      .catch(() => setFailed(true))
      .finally(() => (busy.current = false))
  }, [key, t, photos, texts, hue, stickers, wanted, gif])
  useEffect(() => () => void (gif && URL.revokeObjectURL(gif.url)), [gif])
  return { gif: gif?.src === key ? gif : null, progress, failed }
}

export function ResultScreen() {
  const { result, templateId, reset, go, clearPhotos, photos, renderTexts, hue, setResult, booth } = useApp()
  // mode booth: kembali ke awal (foto dihapus) setelah hasil tidak disentuh; berhenti selama editor stiker terbuka
  const finishBooth = () => {
    reset()
    go('home', { replace: true })
  }
  const again = useStartCamera()
  const t = templateById(templateId)
  const [shareError, setShareError] = useState(false)
  const [format, setFormat] = useState<Format>('asli')
  const stamp = useMemo(() => `bilik-${fileStamp()}`, [])
  const { story, failed: storyFailed } = useStory(result?.blob, format === 'story')
  const boomerangOk = !!t && canBoomerang(photos, t.photoCount)
  // stiker: selalu disatukan ulang dari hasil asli (tanpa stiker), jadi edit berulang tidak menumpuk
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [editing, setEditing] = useState(false)
  const [base, setBase] = useState<{ blob: Blob; url: string } | null>(null)
  useEffect(() => () => void (base && URL.revokeObjectURL(base.url)), [base])
  const openStickers = () => {
    if (!result) return
    if (!base) setBase({ blob: result.blob, url: URL.createObjectURL(result.blob) })
    setEditing(true)
  }
  const applyStickers = async (list: Sticker[]) => {
    setEditing(false)
    const src = base?.blob ?? result?.blob
    if (!src) return
    setStickers(list)
    const blob = list.length ? await bakeStickers(src, list) : src
    setResult({ blob, url: URL.createObjectURL(blob) })
  }
  const boom = useBoomerang(result?.blob, t, photos, renderTexts, hue, stickers, format === 'boomerang')
  const boothLeft = useIdleCountdown(booth.on && !editing ? booth.resetSeconds : null, finishBooth)
  const gifScale = t ? BOOMERANG_SIDE / Math.max(t.width, t.height) : 1

  // yang sedang dipilih: hasil asli (png) atau versi story (jpg)
  const current =
    format === 'story'
      ? story
        ? { blob: story.blob, url: story.url, name: `${stamp}-story.jpg`, type: 'image/jpeg', w: STORY.width, h: STORY.height }
        : null
      : format === 'boomerang'
        ? boom.gif && t
          ? { blob: boom.gif.blob, url: boom.gif.url, name: `${stamp}-boomerang.gif`, type: 'image/gif', w: Math.round(t.width * gifScale), h: Math.round(t.height * gifScale) }
          : null
        : result && t
          ? { blob: result.blob, url: result.url, name: `${stamp}.png`, type: 'image/png', w: t.width, h: t.height }
          : null
  const name = current?.name ?? `${stamp}.png`

  const file = useMemo(() => (current ? new File([current.blob], current.name, { type: current.type }) : null), [current?.blob, current?.name, current?.type])
  // tombol bagikan hanya muncul kalau browser bisa membagikan file
  const canShare = useMemo(() => {
    if (!file || typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return false
    try {
      return navigator.canShare({ files: [file] })
    } catch {
      return false
    }
  }, [file])

  if (!result || !t) return null

  const download = () => {
    if (!current) return
    const a = document.createElement('a')
    a.href = current.url
    a.download = name
    document.body.append(a)
    a.click()
    a.remove()
  }

  const share = async () => {
    setShareError(false)
    try {
      await navigator.share({ files: [file!], title: 'bilik' })
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setShareError(true)
    }
  }

  const image = (cls: string) =>
    current ? (
      <img
        src={current.url}
        alt={format === 'story' ? 'hasil foto bilik versi story' : format === 'boomerang' ? 'boomerang bilik' : 'hasil foto bilik'}
        className={`shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] ${cls}`}
        style={{ aspectRatio: `${current.w} / ${current.h}` }}
      />
    ) : (
      <div
        className={`flex items-center justify-center bg-line/60 ${cls}`}
        style={{ aspectRatio: format === 'story' ? `${STORY.width} / ${STORY.height}` : `${t.width} / ${t.height}` }}
      >
        <span className="label-mono px-3 text-center text-muted">
          {format === 'story'
            ? storyFailed
              ? 'gagal membuat story'
              : 'menyiapkan story...'
            : boom.failed
              ? 'gagal membuat boomerang'
              : `membuat boomerang ${Math.round(boom.progress * 100)}%`}
        </span>
      </div>
    )

  const formats: { id: Format; label: string }[] = [
    { id: 'asli', label: 'asli' },
    { id: 'story', label: 'story 9:16' },
    // boomerang hanya kalau semua foto diambil dari kamera (foto unggahan tidak punya rekaman)
    ...(boomerangOk ? [{ id: 'boomerang' as const, label: 'boomerang' }] : []),
  ]
  const picker = (
    <div className="inline-flex rounded-full border border-line bg-white p-1" role="radiogroup" aria-label="format">
      {formats.map((f) => (
        <button
          key={f.id}
          role="radio"
          aria-checked={format === f.id}
          onClick={() => setFormat(f.id)}
          className={`h-9 rounded-full px-4 text-[14px] font-medium transition-colors ${format === f.id ? 'bg-ink text-white' : 'active:bg-ivory lg:hover:bg-ivory'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )

  return (
    <Screen
      title="sudah jadi."
      subtitle="simpan ke perangkatmu, atau langsung bagikan."
      stage={<Stage>{image('h-[78dvh] max-w-full object-contain')}</Stage>}
      footer={
        <div className="flex flex-col gap-3">
          <Button icon={<DownloadIcon />} onClick={download} disabled={!current}>
            {format === 'story' ? 'unduh story' : format === 'boomerang' ? 'unduh gif' : 'unduh png'}
          </Button>
          <div className="flex gap-3">
            {canShare && (
              <Button variant="secondary" icon={<ShareIcon />} onClick={share} disabled={!current}>
                bagikan
              </Button>
            )}
            {/* cetak selalu hasil asli (story & gif bukan untuk kertas), di kertas 4R */}
            <Button variant="secondary" icon={<PrintIcon />} onClick={() => void printResult(result.url, t.format)}>
              cetak 4r
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              clearPhotos()
              again({ fresh: true })
            }}
          >
            foto lagi
          </Button>
        </div>
      }
    >
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {picker}
        <button
          type="button"
          onClick={openStickers}
          className="flex h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-medium active:bg-ivory lg:hover:bg-ivory"
        >
          {stickers.length ? `stiker (${stickers.length})` : 'tambah stiker'}
        </button>
      </div>
      {editing && (base || result) && (
        <StickerEditor
          src={(base ?? result).url}
          width={t.width}
          height={t.height}
          initial={stickers}
          category={t?.category}
          onDone={(l) => void applyStickers(l)}
          onCancel={() => setEditing(false)}
        />
      )}
      <div className="flex justify-center lg:hidden">{image('max-h-[56dvh] w-auto max-w-full rounded-[4px]')}</div>
      {shareError && (
        <p role="alert" className="mt-4 text-[14px] text-[#8A1F4B]">
          gagal membagikan. coba unduh saja.
        </p>
      )}
      <p className="label-mono mt-5 text-center text-muted lg:text-left">
        {format === 'story'
          ? `${STORY.width}×${STORY.height} px · jpg · untuk story`
          : format === 'boomerang'
            ? `${current?.w ?? ''}×${current?.h ?? ''} px · gif${boom.gif ? ` · ${(boom.gif.blob.size / 1e6).toFixed(1)} mb` : ''}`
            : `${t.width}×${t.height} px · png`}
      </p>
      <p className="mt-2 text-center text-[13px] leading-snug text-muted lg:hidden">
        di iphone, kamu juga bisa tekan lama gambarnya lalu pilih simpan ke foto.
      </p>
      {booth.on && boothLeft !== null && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-[16px] border border-line bg-white p-4" role="status">
          <span className="text-[14px] text-muted">kembali ke awal dalam {boothLeft} d</span>
          <button type="button" onClick={finishBooth} className="h-10 rounded-full bg-ink px-4 text-[14px] font-semibold text-white">
            selesai
          </button>
        </div>
      )}
      <div className="mt-6 text-center lg:text-left">
        <button
          onClick={() => {
            reset()
            go('home')
          }}
          className="text-[15px] font-medium text-ink underline decoration-line underline-offset-4"
        >
          mulai dari awal
        </button>
      </div>
    </Screen>
  )
}
