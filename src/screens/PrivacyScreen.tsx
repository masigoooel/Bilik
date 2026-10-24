import { useId } from 'react'
import { Icon, InfoScreen, pinkButton, type InfoRow } from '../components/InfoScreen'
import { useApp } from '../state/AppState'

const ROWS: InfoRow[] = [
  {
    icon: (
      <Icon>
        <path d="M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.3-1.5A4.5 4.5 0 0 1 17.5 18H7z" />
        <path d="M4 4l16 16" />
      </Icon>
    ),
    title: 'foto tidak pernah diunggah',
    body: 'kamera, filter, lensa, template, dan deteksi wajah untuk efek semuanya diproses di perangkatmu. tidak ada server yang menerima fotomu, dan data wajah tidak disimpan.',
  },
  {
    icon: (
      <Icon>
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </Icon>
    ),
    title: 'kamera hanya menyala saat berfoto',
    body: 'kamera aktif di layar izin & kamera saja, dan langsung dimatikan begitu kamu pindah layar.',
  },
  {
    icon: (
      <Icon>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18M10 13l4 4M14 13l-4 4" />
      </Icon>
    ),
    title: 'foto hilang saat tab ditutup',
    body: 'foto disimpan sementara di memori tab ini. yang tersimpan di perangkatmu hanya file yang kamu unduh atau bagikan sendiri.',
  },
  {
    icon: (
      <Icon>
        <path d="M6 4h12v16l-6-4-6 4z" />
      </Icon>
    ),
    title: 'pilihanmu disimpan di tab ini',
    body: 'jumlah foto, template, tulisan, dan filter disimpan di sessionStorage supaya tidak hilang saat halaman dimuat ulang, lalu terhapus saat tab ditutup. setelan mode booth disimpan di perangkat sampai dimatikan.',
  },
  {
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z" />
      </Icon>
    ),
    title: 'yang diambil dari internet',
    body: 'font template dimuat dari google fonts (seperti situs biasa, google bisa melihat alamat ip-mu). saat kamu memakai efek wajah atau "ikuti wajah", mesin deteksi wajah diunduh dari jsdelivr dan modelnya dari google atau dari bilik sendiri. yang diunduh hanya programnya; tidak ada gambar yang ikut terkirim.',
  },
]

/** laptop berisi foto, perisai pink bercentang, dan awan yang dicoret */
function PrivacyArt() {
  // id unik per salinan: visual dirender dua kali (desktop & HP), dan referensi ke defs di salinan yang tersembunyi tidak tergambar
  const id = useId().replace(/:/g, '')
  const photo = `pv-photo-${id}`
  const shadow = `pv-shadow-${id}`
  return (
    <svg viewBox="0 0 420 300" className="absolute inset-0 m-auto h-full max-h-[440px] w-full max-w-[600px]" aria-hidden="true">
      <defs>
        <linearGradient id={photo} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6D5C4" />
          <stop offset="1" stopColor="#E9A99A" />
        </linearGradient>
        <filter id={shadow} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#111111" floodOpacity="0.18" />
        </filter>
      </defs>
      {/* awan dicoret */}
      <g transform="translate(326 14)" opacity="0.9">
        <path d="M18 52a18 18 0 0 1-2-36 26 26 0 0 1 49-6 20 20 0 0 1 9 42z" fill="#FFFFFF" stroke="#B9B6AE" strokeWidth="4" strokeLinejoin="round" />
        <path d="M6 66L78 0" stroke="#6B6B6B" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* laptop */}
      <g filter={`url(#${shadow})`}>
        <rect x="78" y="58" width="236" height="152" rx="14" fill="#111111" />
        <rect x="90" y="70" width="212" height="128" rx="5" fill="#FFFFFF" />
        <path d="M48 214h296l-14 18a10 10 0 0 1-8 4H70a10 10 0 0 1-8-4z" fill="#D9D6CF" />
        <rect x="170" y="214" width="52" height="7" rx="3.5" fill="#BDBBB5" />
      </g>
      {/* foto di layar */}
      <rect x="104" y="82" width="184" height="104" rx="4" fill={`url(#${photo})`} />
      <circle cx="196" cy="122" r="17" fill="#FFFFFF" fillOpacity="0.75" />
      <path d="M160 186c4-24 20-36 36-36s32 12 36 36z" fill="#FFFFFF" fillOpacity="0.75" />
      <circle cx="262" cy="100" r="7" fill="#FFD36F" />
      {/* perisai */}
      <g transform="translate(276 150)" filter={`url(#${shadow})`}>
        <path d="M34 0l34 13v24c0 21-14 38-34 47C14 75 0 58 0 37V13z" fill="#FF3E8A" />
        <path d="M20 41l10 10 19-20" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export function PrivacyScreen() {
  const { back } = useApp()
  return (
    <InfoScreen
      title="privasi"
      subtitle="singkatnya: fotomu tetap di perangkatmu."
      visual={<PrivacyArt />}
      caption="foto → diproses di perangkat → kamu yang simpan"
      rows={ROWS}
      footer={
        <button type="button" onClick={back} className={pinkButton}>
          mengerti
        </button>
      }
    />
  )
}
