import { marked } from 'marked'
import pwaChangelog from '../data/changelog-pwa.md?raw'
import { androidReleases } from './site'

export interface Entry {
  platform: 'android' | 'pwa'
  version: string
  /** YYYY-MM-DD */
  date: string
  html: string
}

/** Ссылки на разделы спецификации — для разработчиков, читателю сайта не нужны: «(budget-spec, spec/05)». */
const stripSpecRefs = (md: string) => md.replace(/\s*\((?:budget-spec|spec\/)[^()]*\)/g, '')

export const renderMd = (md: string) => marked.parse(stripSpecRefs(md), { async: false })

/** Разделы Keep a Changelog: «## [1.28.0] — 2026-11-07». «Не выпущено» пропускается. */
export function parseChangelog(md: string, platform: Entry['platform']): Entry[] {
  const out: Entry[] = []
  const parts = md.split(/^## /m).slice(1)
  for (const part of parts) {
    const nl = part.indexOf('\n')
    const head = part.slice(0, nl)
    const m = /^\[(\d+\.\d+\.\d+)\]\s*[—–-]\s*(\d{4}-\d{2}-\d{2})/.exec(head)
    if (!m) continue
    out.push({ platform, version: m[1], date: m[2], html: renderMd(part.slice(nl + 1).trim()) })
  }
  return out
}

export const androidEntries: Entry[] = androidReleases.map((r) => ({
  platform: 'android',
  version: r.versionName,
  date: r.date,
  html: renderMd(r.notes),
}))

export const pwaEntries: Entry[] = parseChangelog(pwaChangelog, 'pwa')

export const PLATFORM_NAME: Record<Entry['platform'], string> = { android: 'Android', pwa: 'Веб и iPhone' }
