import { useRef, useState, type DragEvent } from 'react'
import { Screen, Stage } from '../components/Screen'
import { Button } from '../components/Button'
import { BlockedHelp } from '../components/BlockedHelp'
import { CAMERA_ERROR_TEXT, cameraErrorOf, cameraSupport, openCamera, type CameraError } from '../lib/camera'
import { templateById } from '../templates'
import { useApp } from '../state/AppState'
import { UploadIcon, useUpload } from '../state/useUpload'

function CameraIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5A2.5 2.5 0 016.5 6h1.2l1.3-2h6l1.3 2h1.2A2.5 2.5 0 0120 8.5v8A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-8z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12.5" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function PermissionScreen() {
  const { go, templateId } = useApp()
  const t = templateById(templateId)
  const [error, setError] = useState<CameraError | null>(() => cameraSupport())
  const [asking, setAsking] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { upload, busy, error: uploadError } = useUpload()

  const ask = async () => {
    setAsking(true)
    try {
      await openCamera('user')
      go('camera', { replace: true })
    } catch (e) {
      setError(cameraErrorOf(e))
    } finally {
      setAsking(false)
    }
  }

  const onFiles = async (files: FileList | File[] | null) => {
    if (await upload(files)) go('review', { replace: true })
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    onFiles(e.dataTransfer.files)
  }

  const n = t?.photoCount ?? 1
  const blocked = error === 'insecure' || error === 'unsupported' || error === 'notfound'

  return (
    <Screen
      title="izinkan kamera"
      subtitle={
        <>
          kamera dipakai untuk berfoto saja. foto diproses di perangkatmu dan tidak pernah diunggah.{' '}
          <button type="button" onClick={() => go('privasi')} className="text-ink underline underline-offset-2">
            soal privasi
          </button>
        </>
      }
      stage={
        <Stage>
          <div
            onDragOver={(e) => (e.preventDefault(), setDragging(true))}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex h-[60dvh] w-full max-w-[560px] flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed text-center transition-colors ${
              dragging ? 'border-ink bg-white' : 'border-[#CFCCC4]'
            }`}
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-ink">
              <CameraIcon />
            </span>
            <p className="heading text-[24px] font-bold">atau tarik foto ke sini</p>
            <p className="label-mono text-muted">
              {n} foto · jpg, png, webp
            </p>
          </div>
        </Stage>
      }
      footer={
        <div className="flex flex-col gap-3">
          {!blocked && (
            <Button onClick={ask} disabled={asking || busy}>
              {asking ? 'menunggu izin…' : error === 'denied' || error === 'busy' || error === 'unknown' ? 'coba lagi' : 'izinkan kamera'}
            </Button>
          )}
          <Button
            variant={blocked ? 'primary' : 'secondary'}
            icon={<UploadIcon />}
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? 'memproses foto…' : (
              <>
                <span className="lg:hidden">unggah dari galeri</span>
                <span className="hidden lg:inline">unggah dari file</span>
              </>
            )}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple={n > 1}
            className="hidden"
            onChange={(e) => {
              onFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className={`items-center gap-4 rounded-[20px] border border-line bg-white p-4 lg:hidden ${error ? 'hidden' : 'flex'}`}>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ivory text-ink">
            <CameraIcon size={28} />
          </span>
          <p className="text-[15px] leading-snug text-muted">
            nanti browser akan bertanya. pilih <span className="font-semibold text-ink">izinkan</span> supaya kamera bisa
            dipakai.
          </p>
        </div>
        <p className="hidden text-[15px] leading-snug text-muted lg:block">
          browser akan menampilkan permintaan akses. pilih <span className="font-semibold text-ink">izinkan</span>. tidak
          punya webcam? unggah {n > 1 ? `${n} foto` : 'satu foto'} dari file, atau tarik ke panel kiri.
        </p>
        {(error || uploadError) && (
          <p role="alert" className="rounded-[16px] bg-[#FFE8F1] p-4 text-[15px] leading-snug text-[#8A1F4B]">
            {uploadError ?? CAMERA_ERROR_TEXT[error!]}
          </p>
        )}
        {error !== 'insecure' && error !== 'unsupported' && <BlockedHelp open={error === 'denied'} />}
      </div>
    </Screen>
  )
}
