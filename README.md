# Snow BASE 2027 — лендинг

Лендинг Snow BASE 2027 (макеты «Snow BASE DESC» / «Snow BASE MOB» в Figma, страница «Анонс SB 2027»).
Стек: Nuxt 3 + Vue 3, без UI-библиотек.

- Прод: **https://southhub.ru/snowbase/** (заменяет текущую страницу Snow BASE)
- Тест: https://nazyrovruslan.github.io/snowbase2027/ — деплоится автоматически из `main`, не индексируется, без Метрики

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm run dev
```

Откроется на http://localhost:3000/snowbase/

## Сборка для прода (southhub.ru/snowbase/)

```bash
NUXT_PUBLIC_ENABLE_METRIC=true npm run generate
```

Статика окажется в `.output/public` — её нужно отдать по адресу `/snowbase/`.

| Переменная | По умолчанию | Что делает |
|---|---|---|
| `NUXT_APP_BASE_URL` | `/snowbase/` | адрес страницы (slug) |
| `NUXT_PUBLIC_ENABLE_METRIC` | `false` | Яндекс Метрика 89187152, как на southhub.ru |
| `NUXT_PUBLIC_INDEXABLE` | `true` | `robots: index, follow`; `false` → `noindex, nofollow` |

## Docker-образ для прода

Образ собирается автоматически в GitHub Actions (`.github/workflows/docker.yml`) при каждом пуше в `main`
и при теге `v*`, проходит проверку (страница, Метрика, редиректы, кэш, 404) и публикуется в GitHub Container Registry:

```bash
docker pull ghcr.io/nazyrovruslan/snowbase2027:latest
docker run -d --restart unless-stopped -p 127.0.0.1:8080:8080 ghcr.io/nazyrovruslan/snowbase2027:latest
```

- внутри: nginx без root, порт **8080**, страница по пути **`/snowbase/`**, проверка здоровья — `GET /healthz`
- собран с продовыми настройками: Метрика 89187152 включена, `robots: index, follow`
- теги: `latest` (последний `main`), `sha-<коммит>`, `v1.0.0` (для релизных тегов)
- пример запуска — `docker-compose.yml`

Основной nginx southhub.ru должен проксировать `/snowbase/` в контейнер без изменения пути:

```nginx
location /snowbase/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
}
```

Собрать образ вручную (с другими настройками — через `--build-arg`):

```bash
docker build -t snowbase .
docker build --build-arg NUXT_PUBLIC_ENABLE_METRIC=false -t snowbase:nometrika .
```

## Что перенесено с southhub.ru

- slug `/snowbase/`, canonical `https://southhub.ru/snowbase/`, `og:site_name` Southuuub
- SEO: title, description, Open Graph (+ картинка `public/og.jpg` 1200×630), Twitter Card, robots, JSON-LD (Organization, WebSite, WebPage, Event)
- Яндекс Метрика 89187152: webvisor, clickmap, trackLinks, accurateTrackBounce, ecommerce `dataLayer` + noscript-пиксель.
  Модули `tag_ec`, `tag_phono` и пиксель programmatic.ru Метрика подгружает сама.
- проброс UTM-меток (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) в ссылки на southhub.ru
- баннер cookies; согласие хранится в `localStorage` под ключом `isVisibleCookieAlert`, общим с southhub.ru

## Как устроено

- Десктоп свёрстан в ширину 1920px, мобильная версия — 390px; обе масштабируются под ширину окна через CSS `zoom` (`app.vue`).
- `components/SbHero.vue`, `MobHero.vue` — первый экран; при наведении на «Подать заявку» (на мобилке — после 30% прокрутки) фото меняется на закат.
- `components/SbPattern.vue`, `MobPattern.vue` + `composables/useUWave.js` — блок с буквами U, анимация как на southhub.ru.
- `components/SbFooter.vue`, `MobFooter.vue` — блок median.agency и футер с southhub.ru.
- `components/VideoModal.vue`, `MapModal.vue`, `CookieBanner.vue` — шоурил, карта Архыза, баннер cookies.
- `plugins/metrika.client.js`, `plugins/utm.client.js` — Метрика и UTM-метки.
- `assets/fonts` — шрифт Mont (лицензия South HUB).
