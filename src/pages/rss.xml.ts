import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { androidEntries, PLATFORM_NAME, pwaEntries } from '../lib/changelog'
import { href } from '../lib/site'

// Лента выпусков: у приложений нет уведомлений с сервера, о новых версиях можно узнать отсюда.
export function GET(context: APIContext) {
  const items = [...androidEntries, ...pwaEntries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40)
    .map((e) => ({
      title: `${PLATFORM_NAME[e.platform]} ${e.version}`,
      pubDate: new Date(`${e.date}T12:00:00Z`),
      link: `${href('changes/')}#${e.platform}-${e.version}`,
      content: e.html,
    }))
  return rss({
    title: 'MBT: My Budget Tracker — что нового',
    description: 'Новые версии MBT для Android, веба и iPhone',
    site: context.site!,
    items,
    customData: '<language>ru</language>',
  })
}
