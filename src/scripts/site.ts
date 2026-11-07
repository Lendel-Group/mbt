// Поведение страниц сайта: шапка, появление блоков, вкладки платформ, оглавление и увеличение скриншотов инструкции.

// Шапка: фон появляется после начала прокрутки
const header = document.querySelector<HTMLElement>('[data-header]')
const onScroll = () => header?.toggleAttribute('data-scrolled', window.scrollY > 8)
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

// Меню на телефоне закрывается кликом мимо и Esc
const menu = document.querySelector<HTMLDetailsElement>('[data-menu]')
document.addEventListener('click', (e) => {
  if (menu?.open && !menu.contains(e.target as Node)) menu.open = false
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.open) menu.open = false
})

// Плавное появление блоков при прокрутке
const items = document.querySelectorAll<HTMLElement>('.reveal')
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-visible')
        io.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  )
  items.forEach((el) => io.observe(el))
} else {
  items.forEach((el) => el.classList.add('is-visible'))
}

// Вкладки платформ (установка, «Что нового»): открываем вкладку под устройство посетителя
const ua = navigator.userAgent
const visitor =
  /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
    ? 'ios'
    : /Android/.test(ua)
      ? 'android'
      : 'desktop'
document.querySelectorAll<HTMLElement>('[role="tablist"][data-tabs]').forEach((list) => {
  const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
  const select = (tab: HTMLButtonElement) => {
    for (const t of tabs) {
      const active = t === tab
      t.setAttribute('aria-selected', String(active))
      t.tabIndex = active ? 0 : -1
      document.getElementById(t.getAttribute('aria-controls')!)?.toggleAttribute('hidden', !active)
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t))
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
      next.focus()
      select(next)
    })
  })
  // data-platform — список платформ через пробел, для которых вкладка открывается сама
  const preferred = tabs.find((t) => t.dataset.platform?.split(' ').includes(visitor))
  if (preferred) select(preferred)
})

// Инструкция: подсветка текущего раздела в оглавлении
const links = new Map<string, HTMLAnchorElement[]>()
document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]').forEach((a) => {
  const id = a.hash.slice(1)
  links.set(id, [...(links.get(id) ?? []), a])
})
const sections = [...links.keys()].map((id) => document.getElementById(id)).filter((s): s is HTMLElement => s !== null)
const setActive = (id: string) => {
  links.forEach((list, key) => list.forEach((a) => a.setAttribute('aria-current', String(key === id))))
}
// Активен последний раздел, чей заголовок уже ушёл под шапку (с запасом на липкое оглавление на телефоне)
const spy = () => {
  if (sections.length === 0) return
  const line = window.innerHeight * 0.3
  let current = sections[0]
  for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s
  setActive(current.id)
}
window.addEventListener('scroll', spy, { passive: true })
window.addEventListener('hashchange', spy)
window.addEventListener('load', () => requestAnimationFrame(spy))
spy()

// Мобильное оглавление: сначала свернуть, потом прокрутить — иначе заголовок уедет вверх
const mobileToc = document.querySelector<HTMLDetailsElement>('[data-mobile-toc]')
mobileToc?.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
  if (!link) return
  e.preventDefault()
  mobileToc.open = false
  requestAnimationFrame(() => {
    document.getElementById(link.hash.slice(1))?.scrollIntoView()
    history.pushState(null, '', link.hash)
    spy()
  })
})

// Скриншот по нажатию открывается крупно; закрывается кликом или Esc
const dialog = document.querySelector<HTMLDialogElement>('dialog.zoom')
const zoomImg = dialog?.querySelector('img')
document.querySelectorAll<HTMLButtonElement>('.shot button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img')
    if (!dialog || !zoomImg || !img) return
    zoomImg.src = img.currentSrc || img.src
    zoomImg.alt = img.alt
    dialog.showModal()
  })
})
dialog?.addEventListener('click', () => dialog.close())

// Кнопка «Скопировать» у контрольной суммы
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    void navigator.clipboard?.writeText(btn.dataset.copy!).then(() => {
      const label = btn.textContent
      btn.textContent = 'Скопировано'
      setTimeout(() => (btn.textContent = label), 1500)
    })
  })
})
