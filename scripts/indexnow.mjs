// IndexNow: сообщить Bing, Яндексу и другим участникам протокола об изменённых страницах.
//
//   node scripts/indexnow.mjs prepare   — ДО выкладки: какие адреса из dist/sitemap.xml
//                                          изменились против живого сайта → .indexnow-urls.txt
//   node scripts/indexnow.mjs send      — ПОСЛЕ выкладки: отправить этот список
//
// Изменённой считается страница, чей собранный файл не совпадает побайтно с тем, что сейчас
// отдаёт сайт (сборка детерминированная: два прогона одного коммита дают одинаковый dist).
// Если на сайте ещё нет файла-ключа — первый запуск: отправляются все адреса карты сайта.
//
// Скрипт никогда не роняет выкладку: любая ошибка — строка в журнале CI и код 0.
// Ключ IndexNow не секрет: по протоколу он лежит открыто в корне сайта (public/<ключ>.txt).

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const HOST = 'www.mayak-legal.ru'
const KEY = '21651c3fd8526d32b05e661042ccf191'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const LIVE = (process.env.INDEXNOW_LIVE || `https://${HOST}`).replace(/\/$/, '')
const ENDPOINTS = (process.env.INDEXNOW_ENDPOINTS || 'https://api.indexnow.org/indexnow https://yandex.com/indexnow').split(/\s+/).filter(Boolean)
const DIST = process.env.INDEXNOW_DIST || 'dist'
const LIST = process.env.INDEXNOW_LIST || '.indexnow-urls.txt'   // вне dist: в бакет не уезжает

const log = (...a) => console.log('IndexNow:', ...a)
const sha = b => createHash('sha256').update(b).digest('hex')

async function get(url, ms = 10000) {
  const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(ms), headers: { 'user-agent': 'mayak-indexnow-ci' } })
  return { status: r.status, body: Buffer.from(await r.arrayBuffer()) }
}

function sitemapPaths() {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  const out = []
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    let u
    try { u = new URL(m[1]) } catch { log('пропущен негодный адрес в карте сайта:', m[1]); continue }
    if (u.host !== HOST) { log('пропущен адрес чужого хоста:', m[1]); continue }
    out.push(u.pathname)
  }
  return out
}

function distFile(path) {
  const rel = decodeURIComponent(path).replace(/^\//, '')
  return join(DIST, path.endsWith('/') ? rel + 'index.html' : rel)
}

async function prepare() {
  const paths = sitemapPaths()
  let first = false
  try {
    const k = await get(`${LIVE}/${KEY}.txt`)
    first = !(k.status === 200 && k.body.toString('utf8').trim() === KEY)
  } catch (e) { first = true; log('файл-ключ на сайте не прочитан (' + e.message + ') — считаю запуск первым') }
  if (!existsSync(join(DIST, KEY + '.txt'))) { log('в сборке нет файла-ключа ' + KEY + '.txt — отправлять нечем'); writeFileSync(LIST, ''); return }

  const changed = []
  let same = 0, missing = 0
  for (const p of paths) {
    const f = distFile(p)
    if (!existsSync(f)) { missing++; log('в сборке нет файла для', p); continue }
    if (first) { changed.push(p); continue }
    try {
      const live = await get(LIVE + p)
      if (live.status === 200 && sha(live.body) === sha(readFileSync(f))) same++
      else changed.push(p)
    } catch (e) { changed.push(p); log('не прочитана живая страница', p, '(' + e.message + ') — считаю изменённой') }
  }
  writeFileSync(LIST, changed.map(p => `https://${HOST}${p}`).join('\n') + (changed.length ? '\n' : ''))
  log(`${first ? 'первый запуск, ' : ''}в карте сайта ${paths.length}, изменилось ${changed.length}, без изменений ${same}` + (missing ? `, нет в сборке ${missing}` : ''))
  for (const p of changed) log('  →', p)
}

async function send() {
  if (!existsSync(LIST)) { log('списка ' + LIST + ' нет — подготовка не выполнялась, отправка пропущена'); return }
  const urls = readFileSync(LIST, 'utf8').split('\n').map(s => s.trim()).filter(Boolean)
  if (!urls.length) { log('изменённых страниц нет — отправлять нечего'); return }
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls.slice(0, 10000) })
  for (const ep of ENDPOINTS) {
    try {
      const r = await fetch(ep, { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body, signal: AbortSignal.timeout(20000) })
      const t = (await r.text()).slice(0, 200).replace(/\s+/g, ' ')
      // 200 и 202 — принято; 403 — ключ не найден на сайте; 422 — адреса не того хоста; 429 — слишком часто
      log(`${ep} → ${r.status}${r.status === 200 || r.status === 202 ? ' принято' : ''}, адресов ${urls.length}${t ? ' · ' + t : ''}`)
    } catch (e) { log(`${ep} → не отправлено (${e.message})`) }
  }
}

const mode = process.argv[2]
try {
  if (mode === 'prepare') await prepare()
  else if (mode === 'send') await send()
  else log('режим: prepare или send')
} catch (e) { log('сбой: ' + e.message + ' — выкладка не затронута') }
process.exit(0)
