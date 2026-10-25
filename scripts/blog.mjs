// Блог из файлов content/blog/*.md.
// Запускается перед сборкой (npm run build). Статья с датой не позже сегодняшней
// (по Москве) получает страницу blog/<адрес>/, карточку в blog/index.html,
// строку в sitemap.xml и llms.txt. Статья с будущей датой ждёт своего дня,
// уже опубликованная страница с тем же адресом до этого дня не меняется.
// Ошибка в одном файле не останавливает сборку: файл пропускается с предупреждением.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'content', 'blog')
const SITE = 'https://www.mayak-legal.ru'
const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
const COVERS = {
  'Проверка квартиры': 'linear-gradient(135deg,#FBEEDA,#F3D9A6)',
  'Деньги и договор': 'linear-gradient(135deg,#E3EFF5,#BDD8E5)',
  'Стройка и участок': 'linear-gradient(135deg,#F7E7E2,#E9C4BA)',
  'Чек-листы': 'linear-gradient(135deg,#E4F1EA,#BFDCCB)'
}

const warn = (m) => console.warn('⚠ блог: ' + m)
const read = (p) => readFileSync(p, 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Сегодня по Москве в виде ГГГГ-ММ-ДД. BLOG_TODAY=2026-10-20 позволяет проверить будущий день.
function today() {
  if (/^\d{4}-\d{2}-\d{2}$/.test(process.env.BLOG_TODAY || '')) return process.env.BLOG_TODAY
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}
function ruDate(iso) { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}` }
function ruToIso(text) {
  const m = /(\d{1,2}) ([а-я]+) (\d{4})/.exec(text || ''); if (!m) return '0000-00-00'
  const mi = MONTHS.indexOf(m[2]) + 1
  return `${m[3]}-${String(mi).padStart(2, '0')}-${m[1].padStart(2, '0')}`
}
// JSON в том же виде, что уже стоит на страницах (пробел после запятой и двоеточия).
function pyJson(v) {
  if (Array.isArray(v)) return '[' + v.map(pyJson).join(', ') + ']'
  if (v && typeof v === 'object') return '{' + Object.keys(v).map((k) => JSON.stringify(k) + ': ' + pyJson(v[k])).join(', ') + '}'
  return JSON.stringify(v)
}

function parse(file) {
  const raw = read(file).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw)
  if (!m) throw new Error('нет блока --- с заголовком, описанием, адресом и датой')
  const meta = {}
  for (const line of m[1].split('\n')) {
    const kv = /^([a-zA-Z_]+)\s*:\s*(.*)$/.exec(line); if (!kv) continue
    meta[kv[1].toLowerCase()] = kv[2].trim().replace(/^(["'])(.*)\1$/, '$2')
  }
  if (meta.url && !meta.slug) meta.slug = meta.url
  meta.slug = (meta.slug || '').replace(/^.*\/blog\//, '').replace(/^\/+|\/+$/g, '')
  for (const k of ['title', 'description', 'slug', 'date']) if (!meta[k]) throw new Error('не заполнено поле ' + k)
  if (!/^[a-z0-9-]+$/.test(meta.slug)) throw new Error('адрес (slug) только латиница, цифры и дефис: ' + meta.slug)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error('дата в виде 2026-10-20: ' + meta.date)
  if (meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) throw new Error('updated в виде 2026-10-20')
  meta.category = meta.category || 'Проверка квартиры'
  meta.excerpt = meta.excerpt || meta.description
  const body = m[2].trim()
  if (!body) throw new Error('пустой текст статьи')
  meta.body = body.startsWith('<') ? body : markdown(body)
  if (!meta.read) {
    const words = meta.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    meta.read = Math.max(1, Math.round(words / 180)) + ' мин'
  }
  return meta
}

// Простой Markdown: заголовки ##/###, абзацы, списки, жирный, курсив, ссылки. Строки с HTML идут как есть.
function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => /^https?:/.test(u)
      ? `<a href="${u}" target="_blank" rel="noopener">${t}</a>` : `<a href="${u}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
}
function markdown(md) {
  const out = []
  for (const block of md.split(/\n\s*\n/)) {
    const b = block.trim(); if (!b) continue
    if (b.startsWith('<')) { out.push(b); continue }
    const h = /^(#{2,3})\s+(.*)$/.exec(b)
    if (h && !b.includes('\n')) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue }
    const lines = b.split('\n')
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) { out.push('<ul>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*[-*]\s+/, '')) + '</li>').join('') + '</ul>'); continue }
    if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) { out.push('<ol>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*\d+[.)]\s+/, '')) + '</li>').join('') + '</ol>'); continue }
    if (/^>\s?/.test(b)) { out.push('<blockquote><p>' + inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' ')) + '</p></blockquote>'); continue }
    out.push('<p>' + inline(lines.join(' ')) + '</p>')
  }
  return out.join('\n')
}

// Оформление статьи: картинки из постов в соцсетях (публичный бакет mayak-posts),
// выделенное первое предложение вводного абзаца. Новую статью с картинками добавьте в IMAGES:
// cover — обложка 1200x630, cards — карточки 1080x1350 в порядке карусели.
const IMG_BASE = 'https://storage.yandexcloud.net/mayak-posts/'
const IMAGES = {
 "chistaya-vypiska-ne-chistaya-kvartira": {
  "cover": "1-1-cover",
  "cards": [
   "1-1"
  ]
 },
 "otchayannye-domohozyajki-pozhar-u-soseda": {
  "cover": null,
  "cards": [
   "1-2"
  ]
 },
 "riski-pokupki-kvartiry": {
  "cover": "1-3-cover",
  "cards": [
   "1-3-1",
   "1-3-2",
   "1-3-3",
   "1-3-4",
   "1-3-5"
  ]
 },
 "registraciya-dogovora-do-2013-goda": {
  "cover": null,
  "cards": [
   "1-5"
  ]
 },
 "notarius-proveril-kvartiru-mif": {
  "cover": null,
  "cards": [
   "1-7"
  ]
 },
 "virdzhin-river-kvartira-ne-kak-v-obyavlenii": {
  "cover": null,
  "cards": [
   "1-8"
  ]
 },
 "prodavec-toropit-s-avansom": {
  "cover": null,
  "cards": [
   "1-9"
  ]
 },
 "red-flagi-kvartiry-na-vtorichke": {
  "cover": null,
  "cards": [
   "1-10-1",
   "1-10-2",
   "1-10-3"
  ]
 },
 "ipotechnye-kalkulyatory": {
  "cover": null,
  "cards": [
   "1-13"
  ]
 },
 "avans-v-den-prosmotra": {
  "cover": null,
  "cards": [
   "0-4-1",
   "0-4-2",
   "0-4-3",
   "0-4-4",
   "0-4-5"
  ]
 },
 "semejnaya-ipoteka-s-1-oktyabrya-2026": {
  "cover": null,
  "cards": [
   "0-5-1",
   "0-5-2"
  ]
 }
}
function img(name, w, h, alt, eager) {
  return `<img src="${IMG_BASE}${name}.jpg" width="${w}" height="${h}" alt="${alt}" decoding="async"${eager ? '' : ' loading="lazy"'}>`
}
function enhance(slug, body, title) {
  const t = esc(title)
  const set = IMAGES[slug] || { cover: null, cards: [] }
  let hasLead = false
  const m = /^\s*<p>([\s\S]*?)<\/p>/.exec(body)
  if (m && m[1].replace(/<[^>]+>/g, '').length > 120) {
    hasLead = true
    let lead = m[1]
    if (!lead.includes('<b>')) lead = lead.replace(/^(.+?[.!?])(\s|$)/, '<b>$1</b>$2')
    body = body.slice(0, m.index) + `<p class="art-lead">${lead}</p>` + body.slice(m.index + m[0].length)
  }
  let media = ''
  if (set.cards.length === 1) media = `<figure class="art-fig">${img(set.cards[0], 1080, 1350, t)}</figure>`
  else if (set.cards.length > 1) media = '<figure class="art-gal"><div class="art-gal-in">' +
    set.cards.map((c, i) => img(c, 1080, 1350, `${t}, карточка ${i + 1} из ${set.cards.length}`)).join('') +
    '</div><figcaption>Карточки из наших публикаций в Telegram и ВКонтакте · листайте</figcaption></figure>'
  if (media) body = hasLead ? body.replace('</p>', '</p>\n' + media) : media + '\n' + body
  if (set.cover) body = `<figure class="art-cover">${img(set.cover, 1200, 630, t, true)}</figure>\n` + body
  return body
}

function page(tpl, p) {
  const url = `${SITE}/blog/${p.slug}/`
  const bread = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: 'Блог', item: SITE + '/blog/' },
    { '@type': 'ListItem', position: 3, name: p.title, item: url }] }
  const art = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description,
    datePublished: p.date, dateModified: p.updated || p.date, inLanguage: 'ru', mainEntityOfPage: url,
    image: (IMAGES[p.slug] && (IMAGES[p.slug].cover || IMAGES[p.slug].cards[0])) ? IMG_BASE + (IMAGES[p.slug].cover || IMAGES[p.slug].cards[0]) + '.jpg' : SITE + '/og-image.png',
    author: { '@type': 'Organization', name: 'Маяк', url: SITE + '/' },
    publisher: { '@type': 'Organization', name: 'Маяк', url: SITE + '/' } }
  const map = { TITLE: esc(p.title), DESC: esc(p.description), URL: url, CAT: esc(p.category), READ: esc(p.read),
    DATE_ISO: p.date, DATE_LONG: ruDate(p.date) + ' года', LD_BREAD: pyJson(bread).replace(/</g, '\\u003c'),
    LD_ARTICLE: pyJson(art).replace(/</g, '\\u003c'), BODY: enhance(p.slug, p.body, p.title) }
  return tpl.replace(/\{\{([A-Z_]+)\}\}/g, (all, k) => (k in map ? map[k] : all))
}

function card(p) {
  return `<a class="post rv in" href="/blog/${p.slug}/" data-c="${esc(p.category)}"><div class="post-cover" style="background:${COVERS[p.category] || COVERS['Проверка квартиры']}"></div>` +
    `<div class="post-body"><span class="post-cat">${esc(p.category)}</span><h3 class="post-h">${esc(p.title)}</h3><p>${esc(p.excerpt)}</p>` +
    `<div class="post-meta"><span>${ruDate(p.date)}</span><span>${esc(p.read)}</span></div></div></a>`
}

function updateIndex(posts) {
  const file = join(ROOT, 'blog', 'index.html')
  const lines = read(file).split('\n')
  const i = lines.findIndex((l) => l.includes('id="blogPosts"'))
  if (i < 0) { warn('в blog/index.html не найден список статей, карточки не обновлены'); return }
  const line = lines[i]
  const open = line.indexOf('>', line.indexOf('id="blogPosts"')) + 1
  const close = line.lastIndexOf('</div>')
  const inner = line.slice(open, close)
  const own = new Set(posts.map((p) => `/blog/${p.slug}/`))
  const cards = inner.split('</a>').filter((c) => c.trim()).map((c) => c + '</a>')
    .filter((c) => !own.has((/href="([^"]+)"/.exec(c) || [])[1]))
    .map((c) => ({ html: c, date: ruToIso((/<div class="post-meta"><span>([^<]*)</.exec(c) || [])[1]) }))
  for (const p of posts) cards.push({ html: card(p), date: p.date })
  cards.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  lines[i] = line.slice(0, open) + cards.map((c) => c.html).join('') + line.slice(close)
  writeFileSync(file, lines.join('\n'))
}

function updateSitemap(posts) {
  const file = join(ROOT, 'public', 'sitemap.xml'); if (!existsSync(file)) return
  let xml = read(file)
  for (const p of posts) {
    const loc = `${SITE}/blog/${p.slug}/`, mod = p.updated || p.date
    const re = new RegExp(`(<url><loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc><lastmod>)([^<]*)(</lastmod>)`)
    if (re.test(xml)) { xml = xml.replace(re, (all, a, d, b) => (d < mod ? a + mod + b : all)); continue }
    const entry = ` <url><loc>${loc}</loc><lastmod>${mod}</lastmod><priority>0.7</priority></url>\n`
    const lines = xml.split('\n'); let last = -1
    lines.forEach((l, k) => { if (l.includes(`<loc>${SITE}/blog/`)) last = k })
    if (last >= 0) { lines.splice(last + 1, 0, entry.replace(/\n$/, '')); xml = lines.join('\n') } else xml = xml.replace('</urlset>', entry + '</urlset>')
  }
  writeFileSync(file, xml)
}

function updateLlms(posts) {
  const file = join(ROOT, 'public', 'llms.txt'); if (!existsSync(file)) return
  const lines = read(file).split('\n')
  const h = lines.findIndex((l) => l.trim() === '## Статьи'); if (h < 0) return
  let end = h + 1; while (end < lines.length && lines[end].startsWith('- ')) end++
  const add = posts.filter((p) => !lines.slice(h, end).some((l) => l.includes(`/blog/${p.slug}/`)))
    .sort((a, b) => (a.date < b.date ? -1 : 1)).map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/)`)
  if (!add.length) return
  lines.splice(end, 0, ...add)
  writeFileSync(file, lines.join('\n'))
}

function main() {
  if (!existsSync(SRC)) return
  const tplFile = join(SRC, '_template.html')
  if (!existsSync(tplFile)) { warn('нет content/blog/_template.html, блог не обновлён'); return }
  const tpl = read(tplFile)
  const now = today()
  const published = [], waiting = [], seen = new Set()
  for (const name of readdirSync(SRC).filter((n) => n.endsWith('.md') && !n.startsWith('_')).sort()) {
    let p
    try { p = parse(join(SRC, name)) } catch (e) { warn(`${name} пропущен: ${e.message}`); continue }
    if (seen.has(p.slug)) { warn(`${name} пропущен: адрес ${p.slug} уже занят другим файлом`); continue }
    seen.add(p.slug)
    if (p.date > now) { waiting.push(`${p.date} ${p.slug}`); continue }
    try {
      const dir = join(ROOT, 'blog', p.slug)
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'index.html'), page(tpl, p))
      published.push(p)
    } catch (e) { warn(`${name} пропущен: ${e.message}`) }
  }
  try { updateIndex(published) } catch (e) { warn('карточки блога: ' + e.message) }
  try { updateSitemap(published) } catch (e) { warn('sitemap.xml: ' + e.message) }
  try { updateLlms(published) } catch (e) { warn('llms.txt: ' + e.message) }
  console.log(`блог: сегодня ${now}, на сайте ${published.length}, ждут даты ${waiting.length}` + (waiting.length ? ' (' + waiting.join(', ') + ')' : ''))
}

try { main() } catch (e) { warn('скрипт блога остановлен, сайт собирается без изменений блога: ' + e.message) }
