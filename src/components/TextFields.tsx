// Isian tulisan template (nama, nama 2, tempat, tanggal, catatan + saklar tanggal).
// Dipakai langkah "isi teks" dan dialog "ubah teks" di cek hasil, supaya keduanya sama persis.
import { useState } from 'react'
import { fieldsOf, type Template, type TextField } from '../templates'
import { useApp } from '../state/AppState'
import { todayLabel } from '../lib/date'

export const TEXT_FIELDS: { id: TextField; label: string; placeholder: string; max: number }[] = [
  { id: 'nama', label: 'nama', placeholder: 'mis. igul', max: 24 },
  { id: 'nama2', label: 'nama 2', placeholder: 'mis. jerico', max: 24 },
  { id: 'tempat', label: 'tempat', placeholder: 'mis. jakarta', max: 28 },
  { id: 'tanggal', label: 'tanggal', placeholder: 'mis. 19 okt 2026', max: 20 },
  { id: 'catatan', label: 'catatan', placeholder: 'mis. hari yang baik', max: 60 },
]

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[16px] border border-line bg-white px-4 text-left"
    >
      <span className="text-[16px] font-medium">{label}</span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-ink' : 'bg-[#CFCCC4]'}`} aria-hidden="true">
        <span className={`absolute top-1 left-1 h-5 w-5 rounded-full transition-transform ${checked ? 'translate-x-5 bg-accent' : 'bg-white'}`} />
      </span>
    </button>
  )
}

/** `onlyUsed`: tampilkan field yang dipakai template saja (dialog di cek hasil) */
export function TextFields({ template, onSubmit, onlyUsed = false }: { template: Template; onSubmit: () => void; onlyUsed?: boolean }) {
  const { texts, setText, showDate, setShowDate } = useApp()
  const used = new Set(fieldsOf(template))
  const fields = onlyUsed ? TEXT_FIELDS.filter((f) => used.has(f.id)) : TEXT_FIELDS

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => (e.preventDefault(), onSubmit())}>
      {fields.map((f) => {
        const off = f.id === 'tanggal' && !showDate
        return (
          <div key={f.id} className="flex flex-col gap-1.5">
            {f.id === 'tanggal' && (
              <div className="mb-2.5">
                <Switch checked={showDate} onChange={setShowDate} label="tampilkan tanggal" />
              </div>
            )}
            <label htmlFor={`f-${f.id}`} className="flex items-baseline justify-between gap-3">
              <span className="label-mono text-muted">{f.label}</span>
              {!used.has(f.id) && <span className="label-mono text-muted">tidak tampil di template ini</span>}
            </label>
            <input
              id={`f-${f.id}`}
              value={texts[f.id]}
              onChange={(e) => setText(f.id, e.target.value)}
              placeholder={f.placeholder}
              maxLength={f.max}
              disabled={off}
              autoCapitalize="none"
              autoComplete="off"
              enterKeyHint="next"
              className="h-14 rounded-[16px] border border-line bg-white px-4 text-[17px] outline-none placeholder:text-muted focus:border-ink disabled:bg-[#EFEDE8] disabled:text-muted"
            />
          </div>
        )
      })}
      <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
    </form>
  )
}

// ---------- isi teks v2 (langkah 3/3) ----------

const ring = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent'

/** saklar mini di samping label */
function MiniSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`-my-1 flex items-center gap-2 rounded-full py-1 pl-1 font-mono text-[11px] text-muted ${ring}`}
    >
      tampilkan
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-ink' : 'bg-[#CFCCC4]'}`} aria-hidden="true">
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform ${checked ? 'translate-x-4 bg-accent' : 'bg-white'}`} />
      </span>
    </button>
  )
}

/** "a", "a dan b", "a, b, dan c" */
const listJoin = (xs: string[]) => (xs.length < 3 ? xs.join(' dan ') : `${xs.slice(0, -1).join(', ')}, dan ${xs.at(-1)}`)

/** isian teks: hanya field yang dipakai template; field lain digabung jadi satu baris yang bisa dibuka */
export function TextForm({ template, onSubmit }: { template: Template; onSubmit: () => void }) {
  const { texts, setText, showDate, setShowDate } = useApp()
  const used = new Set(fieldsOf(template))
  const shown = TEXT_FIELDS.filter((f) => used.has(f.id))
  const unused = TEXT_FIELDS.filter((f) => !used.has(f.id))
  const today = todayLabel()
  // kolom tak terpakai yang sudah diisi (mis. sebelum ganti template) langsung terlihat
  const [openUnused, setOpenUnused] = useState(() => unused.some((f) => f.id !== 'tanggal' && texts[f.id]))

  const field = (f: (typeof TEXT_FIELDS)[number]) => {
    const isDate = f.id === 'tanggal'
    const off = isDate && !showDate
    const value = texts[f.id]
    return (
      <div key={f.id} className={`flex flex-col gap-1.5 transition-opacity ${off ? 'opacity-50' : ''}`}>
        <div className="flex min-h-5 items-center justify-between gap-3">
          <label htmlFor={`f-${f.id}`} className="text-[14px] font-bold text-ink">
            {f.label}
          </label>
          {isDate ? (
            <MiniSwitch checked={showDate} onChange={setShowDate} label="tampilkan tanggal" />
          ) : (
            <span className="font-mono text-[11px] text-muted">maks. {f.max} huruf</span>
          )}
        </div>
        <div className="relative">
          <input
            id={`f-${f.id}`}
            value={value}
            onChange={(e) => setText(f.id, e.target.value)}
            placeholder={f.placeholder}
            maxLength={f.max}
            disabled={off}
            autoCapitalize="none"
            autoComplete="off"
            enterKeyHint="next"
            aria-describedby={isDate && value === today ? 'f-tanggal-hari-ini' : undefined}
            className={`h-[52px] w-full rounded-[14px] border bg-white px-4 text-[16px] text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,62,138,0.15)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-not-allowed ${
              value && !off ? 'border-accent shadow-[0_0_0_3px_rgba(255,62,138,0.15)]' : 'border-line'
            } ${isDate && value === today ? 'pr-24' : ''}`}
          />
          {isDate && value === today && (
            <span
              id="f-tanggal-hari-ini"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-[#FFE3EE] px-2.5 py-1 font-mono text-[11px] text-[#B0104F]"
            >
              hari ini
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-3.5" onSubmit={(e) => (e.preventDefault(), onSubmit())}>
      {shown.map(field)}
      {unused.length > 0 && (
        <>
          <button
            type="button"
            aria-expanded={openUnused}
            aria-controls="kolom-tidak-dipakai"
            onClick={() => setOpenUnused((o) => !o)}
            className={`flex min-h-11 items-center justify-between gap-3 rounded-[14px] border border-dashed border-[#CFCCC4] px-4 py-2.5 text-left font-mono text-[12px] text-muted hover:border-muted ${ring}`}
          >
            <span>{listJoin(unused.map((f) => f.label))} tidak dipakai template ini</span>
            <span aria-hidden="true" className={`text-[16px] leading-none transition-transform ${openUnused ? 'rotate-90' : ''}`}>
              ›
            </span>
          </button>
          {openUnused && (
            <div id="kolom-tidak-dipakai" className="flex flex-col gap-3.5">
              {unused.map(field)}
            </div>
          )}
        </>
      )}
      <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
    </form>
  )
}
