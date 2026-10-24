import { SplitScreen } from '../components/Screen'
import { CategoryList, Chips, PickBar, PickPanel, TemplateGrid, categoryName, categoryOptions, sizeLabel } from '../components/TemplatePicker'
import { FORMATS, PHOTO_COUNTS, templateById, templatesFor, type PhotoCount } from '../templates'
import { useApp } from '../state/AppState'

/**
 * Galeri template (pintu kedua, dari beranda): semua template dengan filter jumlah foto & kategori.
 * "pakai" memilih template sekaligus jumlah fotonya, lalu langsung ke isi teks.
 */
export function GalleryScreen() {
  const { galleryCount, setGalleryCount, galleryCategory, setGalleryCategory, galleryPick, setGalleryPick, setTemplate, go } = useApp()
  const list = templatesFor(galleryCount, galleryCategory)
  const picked = templateById(galleryPick)
  const countOptions = [
    { value: null as PhotoCount | null, label: 'semua', count: templatesFor(null, galleryCategory).length },
    ...PHOTO_COUNTS.map((n) => ({ value: n as PhotoCount | null, label: `${n} foto`, count: templatesFor(n, galleryCategory).length })),
  ]
  const categoryCount = (id: string | null) => templatesFor(galleryCount, id).length
  const detail = picked && `${categoryName(picked.category)} · ${picked.photoCount} foto · ${sizeLabel(picked)}`
  const use = () => {
    if (!picked) return
    setTemplate(picked.id)
    go('text')
  }

  return (
    <SplitScreen
      title="galeri template"
      subtitle="jumlah foto ikut template yang kamu pakai."
      sidebar={
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="label-mono mb-3 text-muted">jumlah foto</h2>
            <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="jumlah foto">
              {countOptions.map((o) => {
                const on = o.value === galleryCount
                return (
                  <button
                    key={String(o.value)}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setGalleryCount(o.value)}
                    className={`h-11 rounded-full text-[15px] font-semibold transition-colors ${o.value === null ? 'col-span-5' : ''} ${
                      on ? 'bg-ink text-white' : 'border border-line bg-white hover:bg-[#EFEDE8]'
                    }`}
                  >
                    {o.value ?? 'semua'}
                  </button>
                )
              })}
            </div>
          </section>
          <section>
            <h2 className="label-mono mb-3 text-muted">kategori</h2>
            <CategoryList value={galleryCategory} onChange={setGalleryCategory} countOf={categoryCount} />
          </section>
        </div>
      }
      desktopFooter={<PickPanel selected={picked} detail={detail} onUse={use} />}
      mobileFooter={<PickBar selected={picked} detail={picked && `${categoryName(picked.category)} · ${picked.photoCount} foto`} onUse={use} />}
    >
      <div className="mb-4 flex flex-col gap-2 lg:hidden">
        <Chips label="jumlah foto" options={countOptions} value={galleryCount} onChange={setGalleryCount} />
        <Chips label="kategori" options={categoryOptions(categoryCount)} value={galleryCategory} onChange={setGalleryCategory} />
      </div>
      <div className="label-mono mb-4 text-muted">
        {categoryName(galleryCategory)} · {galleryCount ? `${galleryCount} foto` : 'semua jumlah foto'} · {list.length} template
      </div>
      <TemplateGrid
        list={list}
        selectedId={galleryPick}
        onPick={setGalleryPick}
        meta={(t) => (galleryCategory ? `${t.photoCount} foto · ${FORMATS[t.format].label}` : `${categoryName(t.category)} · ${t.photoCount} foto`)}
      />
    </SplitScreen>
  )
}
