import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { SplitScreen, BackIcon } from '../components/Screen'
import { StepIndicator } from '../components/StepIndicator'
import { TemplateThumb } from '../components/TemplateThumb'
import { CategoryList, Chips, PickBar, PickPanel, TemplateGrid, categoryName, categoryOptions, sizeLabel } from '../components/TemplatePicker'
import { FORMATS, VIBES, templateById, templatesFor, type CatalogTemplate } from '../templates'
import { useApp } from '../state/AppState'
import { useDesktop } from '../state/useDesktop'

/** label header "4 foto · ganti": kembali ke pilih jumlah foto */
function CountLabel({ count, onChange }: { count: number; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-[14px] whitespace-nowrap active:bg-ivory lg:hover:bg-[#EFEDE8]"
      aria-label={`${count} foto, ganti jumlah foto`}
    >
      <span>
        <span className="font-semibold">{count} foto</span> · <span className="underline underline-offset-2">ganti</span>
      </span>
    </button>
  )
}

export function TemplateScreen() {
  const desktop = useDesktop()
  return desktop ? <DesktopTemplateScreen /> : <MobileTemplateScreen />
}

// ======================= HP / tablet (tata letak lama) =======================

function MobileTemplateScreen() {
  const { count, category, setCategory, templateId, setTemplate, go, back } = useApp()
  if (!count) return null
  const list = templatesFor(count, category)
  const countOf = (id: string | null) => templatesFor(count, id).length
  const selected = templateById(templateId)
  const detail = selected && `${categoryName(selected.category)} · ${sizeLabel(selected)}`
  // layar ini selalu dibuka dari pilih jumlah foto, jadi "ganti" = kembali satu langkah
  const changeCount = back

  return (
    <SplitScreen
      title="pilih template"
      subtitle={`semua template di sini untuk ${count} foto.`}
      headerExtra={<CountLabel count={count} onChange={changeCount} />}
      sidebar={
        <section>
          <h2 className="label-mono mb-3 text-muted">kategori</h2>
          <CategoryList value={category} onChange={setCategory} countOf={countOf} />
        </section>
      }
      desktopFooter={<PickPanel selected={selected} detail={detail} onUse={() => go('text')} />}
      mobileFooter={<PickBar selected={selected} onUse={() => go('text')} />}
    >
      <div className="mb-4 lg:hidden">
        <Chips label="kategori" options={categoryOptions(countOf)} value={category} onChange={setCategory} />
      </div>
      <div className="label-mono mb-4 text-muted">
        {categoryName(category)} · {list.length} template
      </div>
      <TemplateGrid list={list} selectedId={templateId} onPick={setTemplate} meta={(t) => (category ? FORMATS[t.format].label : `${categoryName(t.category)} · ${FORMATS[t.format].label}`)} />
    </SplitScreen>
  )
}

// ======================= desktop (≥1024px) =======================

type Sort = 'populer' | 'terbaru'
const SORT_KEY = 'bilik:urut-template'

/** warna khas kategori untuk swatch kotak: warna paling "berwarna", atau yang tergelap kalau semuanya netral */
function swatchColor(colors: string[]) {
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const chroma = (h: string) => Math.max(...rgb(h)) - Math.min(...rgb(h))
  const best = [...colors].sort((a, b) => chroma(b) - chroma(a))[0]
  if (chroma(best) > 40) return best
  return [...colors].sort((a, b) => rgb(a).reduce((s, v) => s + v, 0) - rgb(b).reduce((s, v) => s + v, 0))[0]
}

const ratioOf = (t: CatalogTemplate) => FORMATS[t.format].label
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent'

function DesktopTemplateScreen() {
  const { count, category, setCategory, templateId, setTemplate, go, back } = useApp()
  const [sort, setSortState] = useState<Sort>(() => {
    try {
      return sessionStorage.getItem(SORT_KEY) === 'terbaru' ? 'terbaru' : 'populer'
    } catch {
      return 'populer'
    }
  })
  const setSort = (s: Sort) => {
    setSortState(s)
    try {
      sessionStorage.setItem(SORT_KEY, s)
    } catch {
      // storage diblokir: urutan hanya berlaku di layar ini
    }
  }
  const grid = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(4)

  // jumlah kolom mengikuti lebar (4 kolom di atas 1280px, 3 kolom di 1280px ke bawah)
  useEffect(() => {
    const m = matchMedia('(min-width: 1281px)')
    const on = () => setCols(m.matches ? 4 : 3)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])

  if (!count) return null
  const countOf = (id: string | null) => templatesFor(count, id).length
  // kategori aktif yang tidak punya template untuk jumlah ini → tampilkan semua
  const activeCategory = category && countOf(category) > 0 ? category : null
  const base = templatesFor(count, activeCategory)
  // tidak ada data popularitas/tanggal: "populer" = urutan kurasi, "terbaru" = yang terakhir ditambahkan dulu
  const list = sort === 'terbaru' ? [...base].reverse() : base
  const selected = templateById(templateId)
  const use = () => selected && go('text')

  const pick = (t: CatalogTemplate) => setTemplate(t.id)
  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }
    const cur = Math.max(0, list.findIndex((t) => t.id === templateId))
    if (e.key === 'Enter') {
      e.preventDefault()
      if (templateId && list.some((t) => t.id === templateId)) use()
      else if (list[cur]) pick(list[cur])
      return
    }
    let next = cur
    if (e.key in keys) next = cur + keys[e.key]
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = list.length - 1
    else return
    e.preventDefault()
    next = Math.min(list.length - 1, Math.max(0, next))
    const t = list[next]
    if (!t) return
    pick(t)
    grid.current?.querySelector<HTMLElement>(`[data-id="${t.id}"]`)?.focus()
  }

  const rows: { id: string | null; name: string; color?: string }[] = [
    { id: null, name: 'semua' },
    ...VIBES.map((v) => ({ id: v.id, name: v.name.toLowerCase(), color: swatchColor(v.swatch) })),
  ]
  // elemen yang bisa difokus di grid: yang terpilih, atau kartu pertama
  const focusId = list.some((t) => t.id === templateId) ? templateId : list[0]?.id

  return (
    <div className="grid h-dvh grid-cols-[340px_minmax(0,1fr)] overflow-hidden text-ink">
      {/* ================= sidebar ================= */}
      <aside className="flex h-dvh min-h-0 flex-col border-r border-line bg-ivory">
        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-line px-6">
          <button
            type="button"
            onClick={back}
            aria-label="kembali"
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line bg-white hover:bg-[#EFEDE8] ${focusRing}`}
          >
            <BackIcon />
          </button>
          <StepIndicator step="template" compact />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
          <h1 className="heading text-[38px] leading-none font-extrabold tracking-[-0.04em]">pilih template</h1>
          <p className="mt-2.5 flex items-center gap-2 text-[14px] text-muted">
            untuk
            <span className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[13px] font-bold text-ink">{count} foto</span>
            <button type="button" onClick={back} className={`text-[13px] font-bold text-ink underline underline-offset-2 ${focusRing}`} aria-label={`ganti jumlah foto (sekarang ${count})`}>
              ganti
            </button>
          </p>

          <h2 className="mt-4 border-b border-line pb-1.5 font-mono text-[11px] text-muted">kategori</h2>
          <div className="-mx-2 mt-1.5 flex min-h-0 flex-col gap-0.5 overflow-y-auto px-2 pb-1 [scrollbar-width:thin]" role="radiogroup" aria-label="kategori">
            {rows.map((r) => {
              const n = countOf(r.id)
              const on = r.id === activeCategory
              return (
                <button
                  key={r.id ?? 'semua'}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={n === 0}
                  onClick={() => setCategory(r.id)}
                  className={`flex h-9 shrink-0 items-center gap-3 rounded-[10px] px-3 text-left text-[15px] transition-colors disabled:cursor-default disabled:opacity-40 ${focusRing} ${
                    on ? 'bg-ink text-white' : 'hover:bg-[#EFEDE8] disabled:hover:bg-transparent'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${r.color ? 'border border-black/10' : `border ${on ? 'border-white/60' : 'border-ink/40'}`}`}
                    style={r.color ? { background: r.color } : undefined}
                    aria-hidden="true"
                  />
                  <span className="flex-1 font-medium">{r.name}</span>
                  <span className={`font-mono text-[12px] ${on ? 'text-white/75' : 'text-muted'}`}>{n}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ringkasan template terpilih, menempel di dasar sidebar */}
        <div className="shrink-0 border-t border-line px-6 pt-3 pb-4">
          <div className="rounded-[16px] border border-line bg-white p-3.5">
            {selected ? (
              <div className="flex items-center gap-3">
                <span className="block h-[60px] w-[48px] shrink-0 overflow-hidden rounded-[6px] bg-line ring-2 ring-accent ring-offset-2 ring-offset-white">
                  <span className="flex h-full w-full items-center justify-center">
                    <span className="block h-full" style={{ aspectRatio: `${selected.width} / ${selected.height}` }}>
                      <TemplateThumb template={selected} width={Math.round((60 * selected.width) / selected.height)} className="h-full" alt="" />
                    </span>
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] text-muted">terpilih</span>
                  <span className="block truncate text-[18px] leading-tight font-bold">{selected.name}</span>
                  <span className="block truncate font-mono text-[11px] text-muted">
                    {categoryName(selected.category)} · {ratioOf(selected)} · {selected.width}×{selected.height}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[14px] text-muted">belum ada template yang dipilih.</p>
            )}
            <button
              type="button"
              disabled={!selected}
              onClick={use}
              className={`mt-3 flex h-[54px] w-full items-center justify-center rounded-full bg-accent text-[18px] font-bold tracking-[-0.01em] text-white transition-[filter] hover:brightness-[0.92] disabled:bg-[#D9D6CF] disabled:text-muted disabled:hover:brightness-100 ${focusRing}`}
            >
              {selected ? 'pakai template ini' : 'pilih satu template'}
            </button>
          </div>
        </div>
      </aside>

      {/* ================= area grid ================= */}
      <main className="flex h-dvh min-h-0 flex-col bg-[#ECEAE5]">
        <div className="flex h-[84px] shrink-0 items-center justify-between gap-4 border-b border-line px-9">
          <div className="flex min-w-0 items-baseline gap-3">
            <h2 className="heading truncate text-[26px] font-extrabold tracking-[-0.03em]">{categoryName(activeCategory)}</h2>
            <span className="shrink-0 font-mono text-[12px] text-muted">
              {list.length} template · {count} foto
            </span>
          </div>
          <div className="inline-flex shrink-0 rounded-full border border-line bg-white p-1" role="radiogroup" aria-label="urutkan">
            {(['populer', 'terbaru'] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sort === s}
                onClick={() => setSort(s)}
                className={`h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${focusRing} ${sort === s ? 'bg-ink text-white' : 'hover:bg-ivory'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-9 pt-6 pb-10 [scrollbar-width:thin]">
          <div
            ref={grid}
            role="listbox"
            aria-label="template"
            aria-orientation="horizontal"
            onKeyDown={onGridKey}
            className="grid gap-x-6 gap-y-7"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {list.map((t) => {
              const on = t.id === templateId
              return (
                <div
                  key={t.id}
                  data-id={t.id}
                  role="option"
                  aria-selected={on}
                  aria-label={`${t.name}, ${categoryName(t.category)}, ${ratioOf(t)}`}
                  tabIndex={t.id === focusId ? 0 : -1}
                  onClick={() => pick(t)}
                  onDoubleClick={() => {
                    pick(t)
                    go('text')
                  }}
                  className={`group flex cursor-pointer flex-col gap-2.5 rounded-[14px] outline-none ${focusRing}`}
                >
                  {/* kotak setinggi rasio 4:5: template dimuat utuh, strip & 4r tidak membuat baris jadi sangat tinggi */}
                  <div className="flex aspect-[4/5] items-end justify-center">
                    <div
                      className={`relative h-full max-w-full rounded-[12px] motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 group-hover:-translate-y-0.5 ${
                        on
                          ? 'shadow-[0_0_0_3px_#FF3E8A,0_10px_28px_-8px_rgba(255,62,138,0.45)]'
                          : 'shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_rgba(0,0,0,0.08)] group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_12px_26px_rgba(0,0,0,0.14)]'
                      }`}
                      style={{ aspectRatio: `${t.width} / ${t.height}` }}
                    >
                      <TemplateThumb template={t} width={Math.round((320 * t.width) / t.height)} className="h-full rounded-[12px]" alt="" lazy />
                      {on && (
                        <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 px-0.5">
                    <span className={`truncate text-[16px] font-bold ${on ? 'text-[#C4125F]' : ''}`}>{t.name}</span>
                    <span className="shrink-0 font-mono text-[11px] text-muted">{categoryName(t.category)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
