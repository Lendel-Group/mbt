import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// GitHub Pages репозитория Lendel-Group/mbt на домене организации: https://lendel.app/mbt/
// Адрес зашит в Android-приложение (version.json, страница загрузки — budget-spec, spec/06): не менять без новой версии.
export default defineConfig({
  site: 'https://lendel.app',
  base: '/mbt',
  trailingSlash: 'always',
  // Сжатие убирает пробел между текстом и ссылкой на следующей строке («черезRSS-ленту»)
  compressHTML: false,
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
})
