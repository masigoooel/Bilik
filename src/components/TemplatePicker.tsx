// Bagian bersama layar "pilih template" dan galeri template: chip/sidebar kategori, grid kartu, bar pilihan.
import type { ReactNode } from 'react'
import { FORMATS, VIBES, vibeById, type CatalogTemplate } from '../templates'
import { Button } from './Button'
import { TemplateThumb } from './TemplateThumb'

export const categoryName = (id: string | null) => (id ? (vibeById(id)?.name.toLowerCase() ?? id) : 'semua')

/** deretan warna khas kategori */
export function Swatch({ colors, className = 'h-2' }: { colors: string[]; className?: string }) {
  return (
    <div className={`flex overflow-hidden rounded-full border border-black/10 ${className}`} aria-hidden="true">
      {colors.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  )
}

type Option<T> = { value: T; label: string; count?: number }

/** chip geser horizontal (HP) */
export function Chips<T extends string | number | null>({ label, options, value, onChange }: { label: string; options: Option<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="radiogroup"
      aria-label={label}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={String(o.value)}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium whitespace-nowrap transition-colors ${
              on ? 'bg-ink text-white' : 'border border-line bg-white active:bg-ivory'
            }`}
          >
            {o.label}
            {o.count !== undefined && <span className={`label-mono ${on ? 'text-white/75' : 'text-muted'}`}>{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

/** daftar kategori vertikal (sidebar desktop) */
export function CategoryList({ value, onChange, countOf }: { value: string | null; onChange: (id: string | null) => void; countOf: (id: string | null) => number }) {
  const rows: { id: string | null; name: string; swatch?: string[] }[] = [{ id: null, name: 'semua' }, ...VIBES.map((v) => ({ id: v.id, name: v.name.toLowerCase(), swatch: v.swatch }))]
  return (
    <div className="flex flex-col gap-0.5" role="radiogroup" aria-label="kategori">
      {rows.map((r) => {
        const on = r.id === value
        return (
          <button
            key={r.id ?? 'semua'}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(r.id)}
            className={`flex h-10 items-center gap-3 rounded-[10px] px-3 text-left text-[15px] transition-colors ${on ? 'bg-ink text-white' : 'hover:bg-[#EFEDE8]'}`}
          >
            {r.swatch ? <Swatch colors={r.swatch} className="h-3 w-8 shrink-0" /> : <span className="h-3 w-8 shrink-0" aria-hidden="true" />}
            <span className="flex-1 font-medium">{r.name}</span>
            <span className={`label-mono ${on ? 'text-white/75' : 'text-muted'}`}>{countOf(r.id)}</span>
          </button>
        )
      })}
    </div>
  )
}

/** opsi chip kategori: semua + 12 kategori, dengan jumlah template */
export function categoryOptions(countOf: (id: string | null) => number): Option<string | null>[] {
  return [{ value: null, label: 'semua', count: countOf(null) }, ...VIBES.map((v) => ({ value: v.id as string | null, label: v.name.toLowerCase(), count: countOf(v.id) }))]
}

/** grid kartu template. HP 2 kolom, desktop 3 kolom */
export function TemplateGrid({ list, selectedId, onPick, meta }: { list: CatalogTemplate[]; selectedId: string | null; onPick: (id: string) => void; meta: (t: CatalogTemplate) => string }) {
  if (!list.length) return <p className="rounded-[16px] border border-dashed border-line p-4 text-[14px] text-muted">belum ada template untuk pilihan ini.</p>
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4" role="radiogroup" aria-label="template">
      {list.map((t) => {
        const active = selectedId === t.id
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={active}
            onClick={() => onPick(t.id)}
            className={`flex flex-col rounded-[18px] border bg-white p-3 text-left transition-all ${
              active ? 'border-ink ring-1 ring-ink' : 'border-line active:bg-ivory lg:hover:border-[#CFCCC4]'
            }`}
          >
            {/* kotak 5:6 supaya template 4:5 / 4r / strip selalu muat tanpa meluber */}
            <div className="flex aspect-[5/6] items-center justify-center rounded-xl bg-ivory p-3">
              <div className="h-full shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)]" style={{ aspectRatio: `${t.width} / ${t.height}` }}>
                <TemplateThumb template={t} width={Math.round((296 * t.width) / t.height)} className="h-full" alt={t.name} lazy />
              </div>
            </div>
            <span className="heading mt-3 px-0.5 text-[17px] font-bold">{t.name}</span>
            <span className="label-mono mt-0.5 px-0.5 text-muted">{meta(t)}</span>
          </button>
        )
      })}
    </div>
  )
}

export const sizeLabel = (t: CatalogTemplate) => `${FORMATS[t.format].label} · ${t.width}×${t.height} px`

/** bar bawah HP: nama template + kategori + tombol pakai */
export function PickBar({ selected, detail, onUse }: { selected: CatalogTemplate | null; detail?: ReactNode; onUse: () => void }) {
  return (
    <div className="flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur">
      <div className="min-w-0 flex-1">
        {selected ? (
          <>
            <div className="heading truncate text-[17px] font-bold">{selected.name}</div>
            <div className="label-mono mt-0.5 truncate text-muted">{detail ?? categoryName(selected.category)}</div>
          </>
        ) : (
          <div className="text-[14px] text-muted">pilih satu template</div>
        )}
      </div>
      <Button full={false} disabled={!selected} onClick={onUse} className="w-[120px] shrink-0">
        pakai
      </Button>
    </div>
  )
}

/** bagian bawah sidebar desktop: template terpilih + tombol pakai */
export function PickPanel({ selected, detail, onUse }: { selected: CatalogTemplate | null; detail?: ReactNode; onUse: () => void }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-4">
      {selected ? (
        <div>
          <div className="heading text-[20px] font-bold">{selected.name}</div>
          <div className="label-mono mt-1 text-muted">{detail ?? categoryName(selected.category)}</div>
        </div>
      ) : (
        <p className="text-[14px] text-muted">belum ada template yang dipilih.</p>
      )}
      <Button disabled={!selected} onClick={onUse}>
        pakai
      </Button>
    </div>
  )
}
