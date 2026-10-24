import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BackIcon } from '../components/Screen'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { TEXT_FIELDS, TextFields } from '../components/TextFields'
import { renderTemplate } from '../render/renderTemplate'
import { FILTERS, applyFilter, filterById } from '../render/filters'
import { blobToCanvas, refilterPhoto, toPhotoSources, type Photo } from '../lib/photo'
import { cameraSupport } from '../lib/camera'
import { fieldsOf, templateById, type Template, type TextValues } from '../templates'
import { useApp } from '../state/AppState'
import { useStartCamera } from '../state/useStartCamera'
import { UploadIcon, useUpload } from '../state/useUpload'
import { useDesktop } from '../state/useDesktop'

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5A2.5 2.5 0 016.5 6h1.6l1.4-2h5l1.4 2h1.6A2.5 2.5 0 0120 8.5v8A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/** preview gabungan (template + foto), dimuat utuh (contain) di area yang tersedia */
function Composite({
  template,
  photos,
  texts,
  hue,
  className = '',
}: {
  template: Template
  photos: (Photo | null)[]
  texts: TextValues
  hue: number
  className?: string
}) {
  const area = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [src, setSrc] = useState<string | null>(null)

  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    const fit = () => {
      const r = el.getBoundingClientRect()
      const k = Math.min(r.width / template.width, r.height / template.height)
      setBox({ w: Math.floor(template.width * k), h: Math.floor(template.height * k) })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [template])

  // resolusi render dibulatkan supaya tidak render ulang tiap perubahan ukuran kecil
  const px = Math.max(200, Math.ceil((box.h * Math.min(2, window.devicePixelRatio || 1)) / 100) * 100)
  useEffect(() => {
    if (!box.h) return
    let alive = true
    toPhotoSources(photos)
      .then((srcs) => renderTemplate(template, { photos: srcs, texts, scale: px / template.height, hue }))
      .then((c) => alive && setSrc(c.toDataURL('image/jpeg', 0.9)))
    return () => {
      alive = false
    }
  }, [template, photos, texts, hue, px, box.h])

  return (
    <div ref={area} className={`flex min-h-0 items-center justify-center ${className}`}>
      <div className="bg-line shadow-[0_24px_60px_-24px_rgba(17,17,17,0.45)]" style={{ width: box.w, height: box.h }}>
        {src && <img src={src} alt="preview hasil" className="h-full w-full" />}
      </div>
    </div>
  )
}

/** thumbnail kecil tiap filter dari foto pertama (versi mentah), untuk dialog filter */
function useFilterThumbs(photo: Photo | null, enabled: boolean) {
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!enabled || !photo?.raw) return
    let alive = true
    ;(async () => {
      const full = await blobToCanvas(photo.raw!)
      const S = 96
      const base = document.createElement('canvas')
      base.width = S
      base.height = Math.round((S * full.height) / full.width)
      base.getContext('2d')!.drawImage(full, 0, 0, base.width, base.height)
      full.width = full.height = 0
      const tmp = document.createElement('canvas')
      tmp.width = base.width
      tmp.height = base.height
      const tc = tmp.getContext('2d', { willReadFrequently: true })!
      const out: Record<string, string> = {}
      for (const f of FILTERS) {
        if (!alive) return
        tc.drawImage(base, 0, 0)
        applyFilter(tc, f, { seed: 7 })
        out[f.id] = tmp.toDataURL('image/jpeg', 0.75)
        if (Object.keys(out).length % 8 === 0) {
          setThumbs({ ...out })
          await new Promise((r) => setTimeout(r, 0))
        }
      }
      if (alive) setThumbs(out)
    })()
    return () => {
      alive = false
    }
  }, [photo, enabled])
  return thumbs
}

const pill =
  'flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13px] font-bold text-ink transition-colors hover:bg-[#EFEDE8] disabled:opacity-50'

export function ReviewScreen() {
  const { templateId, photos, renderTexts, texts, showDate, hue, setRetake, setPhoto, setFilter, clearPhotos, go, back } = useApp()
  const t = templateById(templateId)
  const start = useStartCamera()
  const { upload, busy: uploading, error: uploadError } = useUpload()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState(0)
  const [dialog, setDialog] = useState<null | 'teks' | 'filter' | 'ulang-semua'>(null)
  const [filtering, setFiltering] = useState<{ done: number; total: number } | null>(null)
  const camera = cameraSupport() === null
  const desktop = useDesktop()
  const close = useCallback(() => setDialog(null), [])
  const thumbs = useFilterThumbs(photos[0] ?? null, dialog === 'filter')

  const retake = (i: number) => {
    setRetake(i)
    go('camera')
  }
  const replace = (i: number) => {
    setUploadTarget(i)
    fileRef.current?.click()
  }

  // R = ulang foto terakhir
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialog || e.repeat || e.metaKey || e.ctrlKey || e.altKey || !camera) return
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'r' || e.key === 'R') {
        const last = photos.reduce<number>((acc, p, i) => (p ? i : acc), -1)
        if (last >= 0) retake(last)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!t) return null
  const complete = t.slots.every((_, i) => photos[i])
  const count = t.photoCount
  const currentFilter = filterById(photos.find(Boolean)?.filter ?? 'normal')
  const used = fieldsOf(t)

  /** ganti filter semua foto (dari versi mentah, resolusi penuh); preview ikut berubah */
  const applyFilterAll = async (id: string) => {
    setFilter(id)
    const list = photos.slice(0, count)
    setFiltering({ done: 0, total: list.length })
    for (const [i, p] of list.entries()) {
      if (p && p.filter !== id) setPhoto(i, await refilterPhoto(p, id, 1))
      setFiltering({ done: i + 1, total: list.length })
    }
    setFiltering(null)
  }

  const retakeAll = () => {
    setDialog(null)
    clearPhotos()
    void start({ fresh: true })
  }

  // ---------- bagian bersama desktop & HP ----------
  const tools = (
    <>
      <button type="button" className={pill} onClick={() => go('template')}>
        ganti template
      </button>
      <button type="button" className={pill} onClick={() => setDialog('teks')}>
        ubah teks
      </button>
      <button type="button" className={pill} onClick={() => setDialog('filter')} disabled={!!filtering}>
        filter: {filtering ? `menerapkan ${filtering.done}/${filtering.total}` : currentFilter.name}
      </button>
    </>
  )

  const summary = (
    <dl className="text-[14px]">
      {used.map((f) => {
        const label = TEXT_FIELDS.find((x) => x.id === f)!.label
        const value = f === 'tanggal' && !showDate ? 'disembunyikan' : texts[f] || 'kosong'
        return (
          <div key={f} className="flex items-baseline gap-3 border-b border-line py-2">
            <dt className="w-[72px] shrink-0 font-mono text-[12px] text-muted">{label}</dt>
            <dd className={`min-w-0 flex-1 truncate ${texts[f] && !(f === 'tanggal' && !showDate) ? 'font-semibold' : 'text-muted'}`}>{value}</dd>
            <button
              type="button"
              onClick={() => setDialog('teks')}
              className="shrink-0 text-[13px] font-bold underline underline-offset-2"
              aria-label={`ubah ${label}`}
            >
              ubah
            </button>
          </div>
        )
      })}
      <div className="flex items-baseline gap-3 border-b border-line py-2">
        <dt className="w-[72px] shrink-0 font-mono text-[12px] text-muted">ukuran</dt>
        <dd className="flex-1 font-semibold">
          {t.width} × {t.height} px
        </dd>
      </div>
    </dl>
  )

  const primary = (
    <>
      <button
        type="button"
        disabled={!complete || !!filtering}
        onClick={() => go('rendering')}
        className="flex h-[60px] w-full items-center justify-center rounded-full bg-accent text-[19px] font-bold tracking-[-0.01em] text-white transition-[filter] hover:brightness-[0.92] disabled:opacity-50"
      >
        jadikan foto
      </button>
      <button type="button" onClick={() => setDialog('ulang-semua')} className="mx-auto mt-2 block py-2 text-[14px] font-bold underline underline-offset-4">
        ambil ulang semua
      </button>
    </>
  )

  const photoRow = (p: Photo | null, i: number) => (
    <li key={i} className="flex items-center gap-3 rounded-[16px] border border-line bg-white p-3">
      <div className="relative h-[104px] w-[84px] shrink-0 overflow-hidden rounded-[10px] bg-[#E9E7E1]">
        {p ? (
          <img src={p.url} alt={`foto ${i + 1}`} className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[12px] text-muted">kosong</span>
        )}
        <span className="absolute top-1.5 left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 font-mono text-[11px] leading-none text-white">
          {i + 1}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <span className="text-[16px] font-bold">foto {i + 1}</span>
        <div className="flex flex-wrap gap-2">
          {camera && (
            <button type="button" className={pill} onClick={() => retake(i)} aria-label={`${p ? 'ulang' : 'ambil'} foto ${i + 1}`}>
              <CameraIcon /> {p ? 'ulang' : 'ambil'}
            </button>
          )}
          <button type="button" className={pill} onClick={() => replace(i)} disabled={uploading} aria-label={`ganti file foto ${i + 1}`}>
            <span className="[&_svg]:h-4 [&_svg]:w-4">
              <UploadIcon />
            </span>{' '}
            ganti file
          </button>
        </div>
      </div>
    </li>
  )

  return (
    <div className="min-h-dvh bg-ivory text-ink lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_440px] lg:overflow-hidden">
      {/* ================= kiri / HP atas: preview ================= */}
      <section
        className="flex flex-col bg-[#ECEAE5] lg:h-dvh"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 48%, rgba(255,62,138,0.08), transparent 60%)' }}
      >
        <header className="pt-safe flex h-14 shrink-0 items-center justify-between px-3 lg:h-[84px] lg:px-9 lg:pt-0">
          <button
            type="button"
            onClick={back}
            aria-label="kembali"
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-black/5 lg:hidden"
          >
            <BackIcon />
          </button>
          <span className="hidden lg:block">
            <Logo size={26} />
          </span>
          <span className="font-mono text-[12px] text-muted lg:hidden">
            {t.name} · {count} foto
          </span>
          <span className="w-11 lg:hidden" aria-hidden="true" />
        </header>
        <Composite template={t} photos={photos} texts={renderTexts} hue={hue} className="h-[55dvh] px-4 lg:h-auto lg:flex-1 lg:px-9" />
        <div className="-mb-px flex shrink-0 gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] lg:justify-center lg:px-9 lg:pt-6 lg:pb-9">{tools}</div>
      </section>

      {/* ================= kanan / HP bawah: panel ================= */}
      <aside className="flex flex-col bg-ivory px-4 pt-5 pb-[calc(140px+env(safe-area-inset-bottom))] lg:h-dvh lg:min-h-0 lg:px-8 lg:pt-7 lg:pb-0">
        <div className="hidden items-center justify-between gap-3 lg:flex">
          <button
            type="button"
            onClick={back}
            aria-label="kembali"
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white hover:bg-[#EFEDE8]"
          >
            <BackIcon />
          </button>
          <span className="min-w-0 truncate font-mono text-[12px] text-muted">
            {t.name} · {count} foto
          </span>
        </div>

        <div className="lg:mt-5">
          <h1 className="heading text-[34px] leading-[1.02] font-extrabold tracking-[-0.04em] lg:text-[44px]">cek hasil</h1>
          <p className="mt-1.5 text-[15px] leading-snug text-muted">{complete ? 'kurang pas? ulang satu per satu.' : 'masih ada foto yang kosong.'}</p>
        </div>

        {/* desktop: daftar foto (scroll di dalam daftar saja kalau banyak) */}
        {desktop && (
          <ul className="-mx-1 mt-5 hidden min-h-0 shrink flex-col gap-2.5 overflow-y-auto px-1 pb-1 [scrollbar-width:thin] lg:flex" aria-label="daftar foto">
            {t.slots.map((_, i) => photoRow(photos[i] ?? null, i))}
          </ul>
        )}

        {/* HP: strip thumbnail */}
        {!desktop && (
          <ul className="-mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden" aria-label="daftar foto">
            {t.slots.map((_, i) => {
              const p = photos[i]
              return (
                <li key={i} className="relative h-[104px] w-[84px] shrink-0 overflow-hidden rounded-[10px] bg-[#E9E7E1]">
                  {p && <img src={p.url} alt={`foto ${i + 1}`} className="h-full w-full object-cover" />}
                  <span className="absolute top-1.5 left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 font-mono text-[11px] leading-none text-white">
                    {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => (camera ? retake(i) : replace(i))}
                    aria-label={`${camera ? 'ulang' : 'ganti file'} foto ${i + 1}`}
                    className="absolute right-1.5 bottom-1.5 flex h-6 items-center rounded-full bg-white px-2 text-[11px] font-bold text-ink shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                  >
                    ↺ {camera ? 'ulang' : 'ganti'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {uploadError && (
          <p role="alert" className="mt-3 text-[14px] text-[#8A1F4B]">
            {uploadError}
          </p>
        )}

        <div className="mt-4 shrink-0">{summary}</div>

        {/* desktop: menempel di dasar panel */}
        <div className="hidden flex-1 lg:block" aria-hidden="true" />
        <div className="hidden shrink-0 pt-4 pb-5 lg:block">{primary}</div>
      </aside>

      {/* HP: tombol utama menempel di bawah layar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ivory px-4 pt-3 lg:hidden">{primary}</div>

      {dialog === 'teks' && (
        <Dialog title="ubah teks" onClose={close} footer={<Button onClick={close}>selesai</Button>}>
          <TextFields template={t} onSubmit={close} onlyUsed={used.length > 0} />
        </Dialog>
      )}
      {dialog === 'filter' && (
        <Dialog
          title="filter"
          onClose={close}
          wide
          footer={<Button onClick={close}>{filtering ? `menerapkan ${filtering.done}/${filtering.total}…` : 'selesai'}</Button>}
        >
          <p className="mb-4 text-[14px] text-muted">berlaku untuk semua foto. preview langsung berubah.</p>
          <div className="grid grid-cols-4 gap-x-3 gap-y-4 sm:grid-cols-6" role="radiogroup" aria-label="filter">
            {FILTERS.map((f) => {
              const on = currentFilter.id === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={!!filtering}
                  onClick={() => void applyFilterAll(f.id)}
                  className="flex flex-col items-center gap-1.5 disabled:opacity-60"
                >
                  <span
                    className="block aspect-square w-full overflow-hidden rounded-[14px] bg-line"
                    style={on ? { boxShadow: '0 0 0 3px #F7F6F2, 0 0 0 5px #111111' } : undefined}
                  >
                    {thumbs[f.id] && <img src={thumbs[f.id]} alt="" className="h-full w-full object-cover" />}
                  </span>
                  <span className={`w-full truncate text-center text-[12px] ${on ? 'font-bold' : 'text-muted'}`}>{f.name}</span>
                </button>
              )
            })}
          </div>
        </Dialog>
      )}
      {dialog === 'ulang-semua' && (
        <Dialog
          title="ambil ulang semua?"
          onClose={close}
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={close}>
                batal
              </Button>
              <Button onClick={retakeAll}>hapus & ulang</Button>
            </div>
          }
        >
          <p className="text-[15px] leading-snug text-muted">semua {count} foto akan dihapus, lalu kamu berfoto lagi dari foto 1.</p>
        </Dialog>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files, uploadTarget)
          e.target.value = ''
        }}
      />
    </div>
  )
}
