// Setelan mode booth (untuk operator acara). Dibuka lewat /?booth atau tekan lama logo di beranda.
import { useState } from 'react'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { TEMPLATES, VIBES, type TextField } from '../templates'
import { useApp } from '../state/AppState'
import { RESET_CHOICES, type BoothSettings } from '../state/booth'

const FIELDS: { id: TextField; label: string; placeholder: string }[] = [
  { id: 'nama', label: 'nama', placeholder: 'mis. nama acara / pengantin' },
  { id: 'nama2', label: 'nama 2', placeholder: 'mis. nama pasangan' },
  { id: 'tempat', label: 'tempat', placeholder: 'mis. bandung' },
  { id: 'tanggal', label: 'tanggal', placeholder: 'kosong = tanggal hari itu' },
  { id: 'catatan', label: 'catatan', placeholder: 'mis. terima kasih sudah datang' },
]

function Toggle({ label, note, checked, onChange }: { label: string; note?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[16px] border border-line bg-white px-4 py-2 text-left"
    >
      <span>
        <span className="block text-[16px] font-medium">{label}</span>
        {note && <span className="block text-[13px] text-muted">{note}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-ink' : 'bg-[#CFCCC4]'}`} aria-hidden="true">
        <span className={`absolute top-1 left-1 h-5 w-5 rounded-full transition-transform ${checked ? 'translate-x-5 bg-accent' : 'bg-white'}`} />
      </span>
    </button>
  )
}

export function BoothScreen() {
  const { booth, setBooth, go } = useApp()
  const [b, setB] = useState<BoothSettings>(booth)
  const set = (p: Partial<BoothSettings>) => setB((x) => ({ ...x, ...p }))
  const save = () => {
    setBooth(b)
    go('home', { replace: true })
  }

  return (
    <Screen
      title="mode booth"
      subtitle="untuk acara: satu perangkat dipakai bergantian. tiap tamu mulai dari awal, fotonya dihapus setelah selesai."
      footer={<Button onClick={save}>simpan</Button>}
    >
      <div className="flex flex-col gap-6">
        <Toggle label="aktifkan mode booth" checked={b.on} onChange={(on) => set({ on })} />

        <section className="flex flex-col gap-3">
          <h2 className="label-mono text-muted">tulisan acara (terisi otomatis)</h2>
          {FIELDS.map((f) => (
            <label key={f.id} className="flex flex-col gap-1.5">
              <span className="label-mono text-muted">{f.label}</span>
              <input
                value={b.texts[f.id] ?? ''}
                onChange={(e) => set({ texts: { ...b.texts, [f.id]: e.target.value } })}
                placeholder={f.placeholder}
                maxLength={f.id === 'catatan' ? 60 : 28}
                autoComplete="off"
                className="h-12 rounded-[14px] border border-line bg-white px-4 text-[16px] outline-none placeholder:text-muted focus:border-ink"
              />
            </label>
          ))}
          <Toggle label="tamu boleh ubah tulisan" note="kalau mati, langkah isi teks dilewati" checked={b.editText} onChange={(editText) => set({ editText })} />
        </section>

        <section className="flex flex-col gap-2">
          <label htmlFor="booth-template" className="label-mono text-muted">
            template
          </label>
          <select
            id="booth-template"
            value={b.templateId ?? ''}
            onChange={(e) => set({ templateId: e.target.value || null })}
            className="h-12 rounded-[14px] border border-line bg-white px-3 text-[16px] outline-none focus:border-ink"
          >
            <option value="">tamu pilih sendiri</option>
            {VIBES.map((v) => (
              <optgroup key={v.id} label={v.name.toLowerCase()}>
                {TEMPLATES.filter((t) => t.category === v.id).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · {t.photoCount} foto
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </section>

        <section className="flex flex-col gap-2">
          <span className="label-mono text-muted">kembali ke awal setelah hasil tidak disentuh</span>
          <div className="inline-flex self-start rounded-full border border-line bg-white p-1" role="radiogroup" aria-label="kembali ke awal">
            {RESET_CHOICES.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={b.resetSeconds === n}
                onClick={() => set({ resetSeconds: n })}
                className={`h-9 rounded-full px-4 text-[14px] font-medium ${b.resetSeconds === n ? 'bg-ink text-white' : 'hover:bg-ivory'}`}
              >
                {n} d
              </button>
            ))}
          </div>
        </section>

        <Toggle label="layar penuh" note="diminta saat tamu menekan mulai foto" checked={b.fullscreen} onChange={(fullscreen) => set({ fullscreen })} />

        <p className="text-[13px] leading-snug text-muted">
          buka lagi halaman ini dengan menekan lama logo bilik di beranda, atau lewat alamat <span className="font-mono">/?booth</span>.
        </p>
      </div>
    </Screen>
  )
}
