# MBT: My Budget Tracker — сайт

Общий сайт приложения: лендинг, загрузка, инструкция, «Что нового», политика конфиденциальности.
Публикуется на GitHub Pages: **https://al-writer.github.io/mbt-site/**.

| Страница | Что это |
|---|---|
| `/` | Лендинг |
| `/download/` | APK для Android, ссылка на веб-версию, перенос данных. **Адрес зашит в Android-приложение.** |
| `/docs/` | Инструкция (скриншоты — `public/docs/img`) |
| `/changes/` | «Что нового» для Android и веб-версии, `/rss.xml` — то же лентой |
| `/privacy/` | Политика конфиденциальности (ссылка для Google Play) |
| `/android/version.json` | Последняя версия Android-приложения. **Адрес зашит в приложение.** |

Само веб-приложение (PWA) остаётся в [al-writer/PWA-Budget](https://github.com/al-writer/PWA-Budget) по адресу
`/PWA-Budget/app/`: его данные (IndexedDB) привязаны к адресу, переносить нельзя.

## Команды
```bash
npm ci
npm run dev       # данные + сервер разработки
npm run build     # данные + статическая сборка в dist/
npm run preview
```
Стек: Astro, Tailwind CSS v4. Без счётчиков, cookie, внешних шрифтов и CDN.

## Откуда данные
`scripts/fetch-data.mjs` перед сборкой скачивает:
- **выпуски Android** — релизы этого репозитория с тегом `android-vX.Y.Z`;
- **CHANGELOG веб-версии** — `CHANGELOG.md` из `al-writer/PWA-Budget`.

Ошибка сети валит сборку — на Pages остаётся прошлая версия. Сайт пересобирается при пуше в `main`, при публикации
релиза, раз в сутки и вручную (Actions → Deploy → Run workflow).

## Выпуск Android
`al-writer/android-budget` закрыт, поэтому APK публикуется релизом **сюда**. Его CI по тегу `vX.Y.Z` создаёт релиз:
- тег `android-vX.Y.Z`, название `Android X.Y.Z`;
- описание — раздел этой версии из `CHANGELOG.md` (без заголовка `## [X.Y.Z]`); оно же показывается в «Что нового»;
- вложение — подписанный APK `mbt-X.Y.Z.apk` (сборка `site`).

Релиз создаётся токеном с правом `contents: write` на этот репозиторий (fine-grained PAT, секрет в android-budget):
релиз, созданный стандартным `GITHUB_TOKEN`, не запускает пересборку сайта.

После сборки сайт сам обновит кнопку «Скачать APK» и `android/version.json`
(`{ "versionName", "versionCode", "date" }`, формат — budget-spec, spec/06 «Новая версия»).
`versionCode = MAJOR·10000 + MINOR·100 + PATCH`, как в android-budget.
