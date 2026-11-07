// Данные для сборки: выпуски Android и CHANGELOG PWA.
// Android-репозиторий (Lendel-Group/android-budget) закрыт, поэтому его CI публикует APK в релизы ЭТОГО репозитория (тег android-vX.Y.Z,
// описание релиза — раздел CHANGELOG этой версии). Отсюда берутся ссылка на APK, version.json и «Что нового».
// Запускается перед `astro build`. Любая ошибка сети валит сборку — на GitHub Pages остаётся прошлая версия сайта.
import { mkdir, writeFile } from 'node:fs/promises'

const apiHeaders = { 'User-Agent': 'mbt-build', Accept: 'application/vnd.github+json' }
if (process.env.GITHUB_TOKEN) apiHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const REPO = process.env.GITHUB_REPOSITORY ?? 'Lendel-Group/mbt'
const PWA_CHANGELOG = 'https://raw.githubusercontent.com/Lendel-Group/PWA-Budget/main/CHANGELOG.md'

async function get(url) {
  // Токен — только для API: raw.githubusercontent.com с чужим токеном отвечает 404
  const res = await fetch(url, { headers: url.startsWith('https://api.github.com/') ? apiHeaders : { 'User-Agent': 'mbt-build' } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res
}

// versionCode = MAJOR·10000 + MINOR·100 + PATCH — как в android-budget/app/build.gradle.kts
export function versionCode(name) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(name)
  if (!m) return null
  const [maj, min, pat] = m.slice(1).map(Number)
  if (min > 99 || pat > 99) return null
  return maj * 10000 + min * 100 + pat
}

async function androidReleases() {
  const res = await get(`https://api.github.com/repos/${REPO}/releases?per_page=100`)
  const list = []
  for (const r of await res.json()) {
    if (r.draft || r.prerelease || !String(r.tag_name).startsWith('android-v')) continue
    const versionName = String(r.tag_name).slice('android-v'.length)
    const code = versionCode(versionName)
    const apk = (r.assets ?? []).find((a) => a.name.endsWith('.apk'))
    if (code === null || !apk) {
      console.warn(`Выпуск ${r.tag_name} пропущен: нет APK или версия не X.Y.Z`)
      continue
    }
    list.push({
      versionName,
      versionCode: code,
      date: String(r.published_at).slice(0, 10),
      notes: String(r.body ?? ''),
      apkUrl: apk.browser_download_url,
      apkSize: apk.size,
      sha256: typeof apk.digest === 'string' && apk.digest.startsWith('sha256:') ? apk.digest.slice(7) : null,
      releaseUrl: r.html_url,
    })
  }
  return list.sort((a, b) => b.versionCode - a.versionCode)
}

await mkdir('src/data', { recursive: true })
await writeFile('src/data/changelog-pwa.md', await (await get(PWA_CHANGELOG)).text())

const releases = await androidReleases()
await writeFile('src/data/android-releases.json', JSON.stringify(releases, null, 2) + '\n')
const latest = releases[0]
if (latest) {
  // Формат — budget-spec, spec/06 «Новая версия»
  await mkdir('public/android', { recursive: true })
  const { versionName, versionCode: code, date } = latest
  await writeFile('public/android/version.json', JSON.stringify({ versionName, versionCode: code, date }) + '\n')
}
console.log(latest ? `Android ${latest.versionName} (${latest.versionCode})` : 'Выпусков Android пока нет')
