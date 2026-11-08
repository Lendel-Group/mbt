import releases from '../data/android-releases.json'

/** Ссылка внутри сайта с учётом подпути GitHub Pages. */
export const href = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`

/** Веб-версия (PWA) — подкаталог этого сайта: сборка Lendel-Group/PWA-Budget, см. .github/workflows/deploy.yml. */
export const APP_URL = href('pwa/')
/** Почта поддержки — та же, что в карточке Google Play. */
export const SUPPORT_EMAIL = 'support@lendel.app'
export const PWA_SOURCE_URL = 'https://github.com/Lendel-Group/PWA-Budget'
export const SPEC_URL = 'https://github.com/Lendel-Group/budget-spec'
export const RATES_URL = 'https://al-writer.github.io/nbk-rates/'
/** Пока приложения нет в Google Play — null. */
export const PLAY_URL: string | null = null

export interface AndroidRelease {
  versionName: string
  versionCode: number
  date: string
  notes: string
  apkUrl: string
  apkSize: number
  sha256: string | null
  releaseUrl: string
}

export const androidReleases = releases as AndroidRelease[]
export const latestAndroid: AndroidRelease | undefined = androidReleases[0]

export const NAV = [
  { path: '', label: 'Главная' },
  { path: 'download/', label: 'Скачать' },
  { path: 'docs/', label: 'Инструкция' },
  { path: 'changes/', label: 'Что нового' },
  { path: 'privacy/', label: 'Конфиденциальность' },
] as const

/** «12,3 МБ» */
export const formatSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`

/** «7 ноября 2026» */
export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).replace(/\s*г\.$/, '')
