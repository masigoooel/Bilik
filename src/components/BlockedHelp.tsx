type Tip = { id: string; title: string; steps: string[] }

const TIPS: Tip[] = [
  {
    id: 'chrome',
    title: 'chrome / edge di laptop',
    steps: ['klik ikon pengaturan situs (gembok) di kiri alamat', 'pilih izin situs, lalu kamera: izinkan', 'muat ulang halaman'],
  },
  {
    id: 'safari-mac',
    title: 'safari di mac',
    steps: ['buka menu safari → pengaturan → situs web', 'pilih kamera di daftar kiri', 'ubah situs ini ke izinkan, lalu muat ulang'],
  },
  {
    id: 'firefox',
    title: 'firefox',
    steps: ['klik ikon kamera bercoret di kiri alamat', 'hapus blokir kamera', 'muat ulang halaman'],
  },
  {
    id: 'ios',
    title: 'safari di iphone / ipad',
    steps: [
      'ketuk aA di kolom alamat → pengaturan situs web',
      'kamera: izinkan',
      'kalau masih gagal: pengaturan iphone → safari → kamera → izinkan',
    ],
  },
  {
    id: 'android',
    title: 'chrome di android',
    steps: ['ketuk ikon di kiri alamat → izin', 'nyalakan kamera', 'muat ulang halaman'],
  },
  {
    id: 'os',
    title: 'masih diblokir sistem?',
    steps: [
      'windows: pengaturan → privasi & keamanan → kamera, nyalakan akses untuk aplikasi desktop',
      'mac: pengaturan sistem → privasi & keamanan → kamera, centang browser kamu',
    ],
  },
]

function detect(): string {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  if (/Firefox\//.test(ua)) return 'firefox'
  if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome|Chromium|Edg\//.test(ua)) return 'safari-mac'
  return 'chrome'
}

function TipBlock({ tip }: { tip: Tip }) {
  return (
    <div>
      <div className="text-[15px] font-semibold">{tip.title}</div>
      <ol className="mt-1.5 flex list-decimal flex-col gap-1 pl-5 text-[14px] leading-snug text-muted">
        {tip.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  )
}

/** petunjuk membuka blokir kamera, browser yang terdeteksi ditampilkan paling atas */
export function BlockedHelp({ open }: { open: boolean }) {
  const mine = detect()
  const first = TIPS.find((t) => t.id === mine)!
  const others = TIPS.filter((t) => t.id !== mine)

  return (
    <details open={open} className="group rounded-[16px] border border-line bg-white">
      <summary className="flex h-14 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        kamera diblokir?
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-open:rotate-180" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="flex flex-col gap-4 border-t border-line px-4 pt-4 pb-4">
        <TipBlock tip={first} />
        <details className="group/more">
          <summary className="label-mono cursor-pointer list-none text-muted underline underline-offset-4 [&::-webkit-details-marker]:hidden">
            browser lain
          </summary>
          <div className="mt-3 flex flex-col gap-4">
            {others.map((t) => (
              <TipBlock key={t.id} tip={t} />
            ))}
          </div>
        </details>
        <button
          onClick={() => location.reload()}
          className="h-11 self-start rounded-full border border-line px-4 text-[14px] font-semibold hover:bg-ivory"
        >
          muat ulang halaman
        </button>
        <p className="label-mono -mt-2 text-muted">pilihan template & tulisanmu tetap tersimpan.</p>
      </div>
    </details>
  )
}
