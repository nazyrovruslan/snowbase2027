#!/usr/bin/env node
// Готовит сборку dist/ (DSFC/1) к размещению. Два режима:
//
//   node scripts/export.mjs django [--static-url /static/] [--prefix frontends] [--out export/django]
//     → export/django/static/<prefix>/<name>/<version>/   файлы для Django Static Files (или nginx)
//     → export/django/templates/<prefix>/<name>/index.html Django-шаблон с блоками seo / head_extra / body_start / body_end
//
//   node scripts/export.mjs static --base /snowbase/ [--site-url URL] [--canonical URL] [--noindex] [--metrika ID] [--out export/static]
//     → обычная статика для nginx / GitHub Pages: index.html + assets/ + public/ по адресу --base
//
// dist/ не меняется. Перед экспортом проверяется, что файлы совпадают с dsfc-manifest.json (sha256).
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const TOKEN = '/__DSFC_BASE__/'
const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.svg', '.txt', '.xml'])
const MARKERS = { head: '<!--dsfc:head-->', bodyStart: '<!--dsfc:body-start-->', bodyEnd: '<!--dsfc:body-end-->' }
const SEO_TAG = /<title\b[^>]*data-dsfc="seo"[^>]*>[\s\S]*?<\/title>|<script\b[^>]*data-dsfc="seo"[^>]*>[\s\S]*?<\/script>|<(?:meta|link)\b[^>]*data-dsfc="seo"[^>]*>/gi

const [mode, ...rest] = process.argv.slice(2)
const opt = (name, def) => {
  const i = rest.indexOf(`--${name}`)
  return i === -1 ? def : rest[i + 1]
}
const flag = (name) => rest.includes(`--${name}`)
const die = (msg) => { console.error(`export: ${msg}`); process.exit(1) }
const slash = (s) => (s.endsWith('/') ? s : s + '/')

if (mode !== 'django' && mode !== 'static') die('укажите режим: django или static')

const dist = path.resolve(opt('dist', 'dist'))
const out = path.resolve(opt('out', `export/${mode}`))
const manifestPath = path.join(dist, 'dsfc-manifest.json')
if (!fs.existsSync(manifestPath)) die(`нет ${manifestPath}, сначала npm run build`)
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

// целостность: в dist ровно файлы из манифеста, без правок после сборки
for (const f of manifest.files) {
  const buf = fs.readFileSync(path.join(dist, f.path))
  if (crypto.createHash('sha256').update(buf).digest('hex') !== f.sha256) die(`${f.path} изменён после сборки`)
}

/** Копирует файлы сборки в dir, заменяя токен базы на base во всех текстовых файлах. index.html не копирует. */
function copyBuild(dir, base) {
  fs.rmSync(dir, { recursive: true, force: true })
  for (const f of [...manifest.files.map((x) => x.path), 'dsfc-manifest.json']) {
    if (f === manifest.entry) continue
    const src = path.join(dist, f)
    const dst = path.join(dir, f)
    fs.mkdirSync(path.dirname(dst), { recursive: true })
    if (TEXT.has(path.extname(f).toLowerCase())) fs.writeFileSync(dst, fs.readFileSync(src, 'utf8').replaceAll(TOKEN, base))
    else fs.copyFileSync(src, dst)
  }
}

const page = fs.readFileSync(path.join(dist, manifest.entry), 'utf8')
for (const m of Object.values(MARKERS)) if (page.split(m).length !== 2) die(`в index.html должен быть ровно один ${m}`)

if (mode === 'django') {
  const staticUrl = slash(opt('static-url', '/static/'))
  const prefix = opt('prefix', 'frontends').replace(/^\/|\/$/g, '')
  const rel = `${prefix}/${manifest.name}/${manifest.version}/`
  const base = staticUrl + rel
  fs.rmSync(out, { recursive: true, force: true })
  copyBuild(path.join(out, 'static', rel), base)

  // Django-шаблон: весь HTML сборки внутри {% verbatim %} (Django не трогает ни одного символа),
  // SEO-теги по умолчанию — в {% block seo %}, маркеры — пустые блоки для вставок со стороны Django.
  const html = page.replaceAll(TOKEN, base)
  const seo = (html.match(SEO_TAG) ?? []).join('\n')
  const v = (s) => (s ? `{% verbatim %}${s}{% endverbatim %}` : '')
  const [beforeHead, afterHead] = html.replace(SEO_TAG, '').split(MARKERS.head)
  const [beforeBody, afterBodyStart] = afterHead.split(MARKERS.bodyStart)
  const [app, tail] = afterBodyStart.split(MARKERS.bodyEnd)
  const template = [
    `{% comment %}${manifest.name} ${manifest.version} — собрано ${manifest.builtAt}, не редактировать вручную (npm run export:django){% endcomment %}`,
    v(beforeHead.replace(/\n\s*\n/g, '\n')),
    `{% block seo %}${v(seo)}{% endblock %}`,
    '{% block head_extra %}{% endblock %}',
    v(beforeBody),
    '{% block body_start %}{% endblock %}',
    v(app),
    '{% block body_end %}{% endblock %}',
    v(tail),
  ].join('')
  const tplDir = path.join(out, 'templates', prefix, manifest.name)
  fs.mkdirSync(tplDir, { recursive: true })
  fs.writeFileSync(path.join(tplDir, 'index.html'), template + '\n')
  console.log(`django: ${path.relative(process.cwd(), out)}/static/${rel} (STATIC_URL ${staticUrl})`)
  console.log(`django: ${path.relative(process.cwd(), tplDir)}/index.html → {% extends "${prefix}/${manifest.name}/index.html" %}`)
} else {
  const base = opt('base')
  if (!base || !base.startsWith('/')) die('для static нужен --base, например --base /snowbase/')
  const b = slash(base)
  copyBuild(out, b)
  let html = page.replaceAll(TOKEN, b)
  const siteUrl = opt('site-url')
  const canonical = opt('canonical')
  const metrika = opt('metrika')
  // превью ссылок требует абсолютный адрес картинки
  if (siteUrl) html = html.replaceAll(`content="${b}public/`, `content="${slash(siteUrl)}public/`)
  if (flag('noindex')) html = html.replace(/(<meta data-dsfc="seo" name="robots" content=")[^"]*"/, '$1noindex, nofollow"')
  let head = ''
  let bodyStart = ''
  if (canonical) head += `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">`
  if (metrika) {
    if (!/^\d+$/.test(metrika)) die('--metrika: нужен числовой ID счётчика')
    // тот же счётчик и параметры, что на southhub.ru
    head += `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${metrika},"init",{defer:true,webvisor:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});</script>`
    bodyStart += `<noscript><div><img src="https://mc.yandex.ru/watch/${metrika}" style="position:absolute; left:-9999px;" alt=""></div></noscript>`
  }
  html = html.replace(MARKERS.head, head).replace(MARKERS.bodyStart, bodyStart).replace(MARKERS.bodyEnd, '')
  fs.writeFileSync(path.join(out, 'index.html'), html)
  console.log(`static: ${path.relative(process.cwd(), out)} → отдавать по адресу ${b}`)
}
