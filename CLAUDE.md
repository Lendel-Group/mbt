# Правила для ИИ-агентов

Сайт приложения MBT. Поведение приложений задаёт спецификация `Lendel-Group/budget-spec`; сайт его описывает.

- Язык — русский. Названия кнопок и экранов в инструкции — дословно из `budget-spec/spec/05-screens.md`.
- Сайт — https://lendel.app/mbt/ (GitHub Pages репозитория `Lendel-Group/mbt` на домене организации). Не менять
  адреса `/download/`, `/android/version.json`, `/docs/`, `/privacy/` и базу `/mbt/`: они зашиты в Android-приложение
  и Google Play. Веб-версия — `/mbt/pwa/` (сборка `Lendel-Group/PWA-Budget` в deploy.yml): данные PWA привязаны к адресу.
  Формат `version.json` — `budget-spec/spec/06-platforms.md`, «Новая версия».
- Не добавлять счётчики, аналитику, cookie, внешние шрифты, CDN и сторонние виджеты.
- Политика конфиденциальности (`src/pages/privacy.astro`) должна совпадать с тем, что приложения делают в сети
  (`budget-spec/spec/00`, «Принципы»; `spec/06`).
- Данные из сети — только в `scripts/fetch-data.mjs`; страницы читают `src/data/*` (не коммитится).
- Ссылки внутри сайта — через `href()` из `src/lib/site.ts`.
- Перед коммитом: `npm run build` проходит.
