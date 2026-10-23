# Snow BASE 2027 — лендинг

Лендинг Snow BASE 2027 (макеты «Snow BASE DESC» / «Snow BASE MOB» в Figma, страница «Анонс SB 2027»).

Стек: **Vue 3 + Vite + TypeScript + vite-ssg** (статическая генерация, без Nuxt и без Node.js в проде).
Сборка соответствует контракту **Django Static Frontend Contract v1 (DSFC/1)** и встраивается в Django/Wagtail как обычный шаблон —
подробная инструкция для backend: **[docs/DJANGO.md](docs/DJANGO.md)**.

- Прод: **https://southhub.ru/snowbase/**
- Тест: https://nazyrovruslan.github.io/snowbase2027/ — деплоится автоматически из `main`, не индексируется, без Метрики

## Команды

Нужен Node.js 20+ (только для разработки и сборки).

```bash
npm install
npm run dev            # http://localhost:5173/__DSFC_BASE__/
npm run typecheck      # vue-tsc
npm run build          # vite-ssg build + постобработка → dist/
npm run check          # проверки DSFC/1: tools/dsfc_check.py (статика) и tools/dsfc_smoke.mjs (браузер, нужен Playwright)
npm run preview        # готовая сборка на http://localhost:4173/__DSFC_BASE__/

npm run export:django -- --static-url /static/   # dist/ → export/django/ (шаблон + статика для Django)
npm run export:static -- --base /snowbase/       # dist/ → export/static/ (обычная статика для nginx / GitHub Pages)
```

## Что получается после `npm run build`

```text
dist/
├── index.html            # уже отрендеренная страница (весь текст, заголовки, ссылки — в HTML)
├── dsfc-manifest.json    # имя, версия, SEO по умолчанию, настройки для CMS, список файлов с sha256
├── assets/               # JS, CSS, шрифты, картинки, видео — с хешем в имени
└── public/               # файлы с постоянными именами: og.jpg, фавиконки, site.webmanifest
```

- Все локальные адреса начинаются с токена `/__DSFC_BASE__/`; его заменяет на реальный адрес `scripts/export.mjs` (или импортёр на стороне Django).
- В `index.html` нет `{{`, `{%`, `{#` (постобработка `scripts/dsfc-postbuild.mjs` экранирует их, если появятся в тексте).
- Маркеры `<!--dsfc:head-->`, `<!--dsfc:body-start-->`, `<!--dsfc:body-end-->` — места для SEO, аналитики и конфигурации из Django.
- SEO по умолчанию (`title`, description, Open Graph, Twitter, robots, JSON-LD) помечено `data-dsfc="seo"`; JS `<head>` не трогает.
- Метрики и других счётчиков в сборке нет: их подключает Django (а для статики — `export.mjs --metrika`).

## Как устроено

```text
src/
├── main.ts                       # ViteSSG(App, …, { hydration: true, useHead: false })
├── App.vue                       # масштаб макетов 1920/390, применение настроек из CMS, UTM
├── components/
│   ├── sections/                 # SbHero / MobHero (первый экран), SbPattern / MobPattern (блок с U)
│   ├── layout/                   # SiteFooter, CookieBanner
│   ├── modals/                   # VideoModal (шоурил), MapModal (Яндекс Карта)
│   ├── ui/SbLogo.vue
│   └── widgets/TicketWidget.vue  # продажа билетов через API Django (выключен по умолчанию)
├── composables/                  # useSiteConfig (настройки из CMS), useModals, useScrollLock, useUWave, useAutoplayWhenVisible
├── services/api.ts               # запросы к API Django (только в браузере, только тот же домен)
├── utils/utm.ts                  # проброс UTM-меток в ссылки на southhub.ru
├── styles/main.css
└── assets/                       # шрифт Mont (лицензия South HUB), картинки, видео
dsfc.config.json                  # имя сборки, SEO по умолчанию, настройки для CMS (config), внешние домены
```

- Десктоп свёрстан в ширину 1920px, мобильная версия — 390px; обе масштабируются под ширину окна через CSS `zoom`.
  Масштаб зависит от окна, поэтому при SSG он равен 1 и пересчитывается сразу после монтирования (так же было в Nuxt-версии).
- Всё, что зависит от браузера (масштаб, баннер cookies из `localStorage`, анимации, видео), запускается в `onMounted` — первый рендер одинаков при SSG и гидратации.
- Ссылки «Подать заявку», «Войти», «Задать вопрос», Telegram, даты и ссылка на Google Календарь — настройки из `dsfc.config.json → config`,
  редактор может менять их в Wagtail без пересборки.

## Docker-образ (старый способ прода, без Django)

Образ по-прежнему собирается в GitHub Actions (`.github/workflows/docker.yml`) при пуше в `main` и тегах `v*`:
nginx без root, порт **8080**, страница по пути **`/snowbase/`**, `/healthz`, Метрика 89187152, `robots: index, follow`.

```bash
docker pull ghcr.io/nazyrovruslan/snowbase2027:latest
docker run -d --restart unless-stopped -p 127.0.0.1:8080:8080 ghcr.io/nazyrovruslan/snowbase2027:latest
docker build --build-arg METRIKA_ID= --build-arg INDEXABLE=false -t snowbase:test .   # без Метрики, noindex
```

## Что перенесено с southhub.ru

- slug `/snowbase/`, SEO (title, description, Open Graph с картинкой `public/og.jpg` 1200×630, Twitter Card, robots, JSON-LD Organization + Event)
- проброс UTM-меток (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) в ссылки на southhub.ru
- баннер cookies; согласие хранится в `localStorage` под ключом `isVisibleCookieAlert`, общим с southhub.ru
- Яндекс Метрика 89187152 — теперь подключается не из сборки, а на стороне Django (см. docs/DJANGO.md) или флагом `--metrika` при экспорте в статику
