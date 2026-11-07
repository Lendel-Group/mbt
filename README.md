# MBT: My Budget Tracker — сайт

Общий сайт приложения: лендинг, загрузка, инструкция, «Что нового», политика конфиденциальности.
Публикуется на GitHub Pages репозитория `Lendel-Group/mbt` на домене организации: **https://lendel.app/mbt/**.

| Страница | Что это |
|---|---|
| `/` | Лендинг |
| `/download/` | APK для Android, ссылка на веб-версию, перенос данных. **Адрес зашит в Android-приложение.** |
| `/docs/` | Инструкция (скриншоты — `public/docs/img`) |
| `/changes/` | «Что нового» для Android и веб-версии, `/rss.xml` — то же лентой |
| `/privacy/` | Политика конфиденциальности (ссылка для Google Play) |
| `/pwa/` | Веб-версия (PWA) — сборка `Lendel-Group/PWA-Budget`. **Данные привязаны к адресу.** |
| `/android/version.json` | Последняя версия Android-приложения. **Адрес зашит в приложение.** |

Код веб-приложения — в [Lendel-Group/PWA-Budget](https://github.com/Lendel-Group/PWA-Budget). Сайт собирает его
`main` с `BASE_PATH=/mbt/pwa/` в `dist/pwa` (`scripts/build-pwa.sh`, шаг в `deploy.yml`). Данные PWA (IndexedDB)
привязаны к адресу, поэтому подкаталог `/pwa/` не менять. Прежний адрес `lendel.app/PWA-Budget/` перенаправляет сюда.

## Команды
```bash
npm ci
npm run dev       # данные + сервер разработки
npm run build     # данные + статическая сборка в dist/
scripts/build-pwa.sh ../PWA-Budget   # + веб-версия в dist/pwa (клон PWA-Budget рядом)
npm run preview
```
Стек: Astro, Tailwind CSS v4. Без счётчиков, cookie, внешних шрифтов и CDN.

## Откуда данные
`scripts/fetch-data.mjs` перед сборкой скачивает:
- **выпуски Android** — релизы этого репозитория с тегом `android-vX.Y.Z`;
- **CHANGELOG веб-версии** — `CHANGELOG.md` из `Lendel-Group/PWA-Budget`.

Ошибка сети валит сборку — на Pages остаётся прошлая версия. Сайт пересобирается при пуше в `main`, при публикации
релиза, по событию `pwa-updated` от деплоя PWA-Budget, раз в сутки и вручную (Actions → Deploy → Run workflow).

## Выпуск Android
`Lendel-Group/android-budget` закрыт, поэтому APK публикуется релизом **сюда**. Его workflow Release создаёт релиз:
- тег `android-vX.Y.Z`, название `Android X.Y.Z`;
- описание — раздел этой версии из `CHANGELOG.md` (без заголовка `## [X.Y.Z]`); оно же показывается в «Что нового»;
- вложение — подписанный APK `mbt-X.Y.Z.apk` (сборка `site`).

Релиз создаётся токеном с правом `contents: write` на этот репозиторий (fine-grained PAT, секрет в android-budget):
релиз, созданный стандартным `GITHUB_TOKEN`, не запускает пересборку сайта.

После сборки сайт сам обновит кнопку «Скачать APK» и `android/version.json`
(`{ "versionName", "versionCode", "date" }`, формат — budget-spec, spec/06 «Новая версия»).
`versionCode = MAJOR·10000 + MINOR·100 + PATCH`, как в android-budget.
