#!/usr/bin/env bash
# Веб-версия (PWA) — подкаталог сайта: https://lendel.app/mbt/pwa/.
# Собирает Lendel-Group/PWA-Budget из папки $1 (клон, по умолчанию ../PWA-Budget) с BASE_PATH=/mbt/pwa/
# и кладёт результат в dist/pwa. Запускать после `npm run build` (astro build очищает dist/).
set -euo pipefail
src="$(cd "${1:-../PWA-Budget}" && pwd)"
site="$(cd "$(dirname "$0")/.." && pwd)"
[[ -d "$site/dist" ]] || { echo "Нет dist/ — сначала npm run build" >&2; exit 1; }
(cd "$src" && npm ci --no-audit --no-fund && BASE_PATH=/mbt/pwa/ npm run build)
rm -rf "$site/dist/pwa"
cp -R "$src/dist" "$site/dist/pwa"
echo "PWA $(node -p "require('$src/package.json').version") → dist/pwa"
