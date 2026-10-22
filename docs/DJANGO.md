# Интеграция Snow BASE 2027 в Django/Wagtail

Vue отвечает только за интерфейс. Django/Wagtail отдаёт страницу, управляет SEO, аналитикой и настройками.
Node.js нужен только для сборки; в проде работают Django и nginx.

Сборка соответствует контракту DSFC/1 (`CONTRACT.md` в комплекте django-contract). Ниже — два способа подключения:
**А** — через готовый Django-шаблон из `scripts/export.mjs` (проще, ничего не нужно писать на backend),
**Б** — через универсальный импортёр DSFC/1 (если он уже есть в проекте).

## 1. Production build

```bash
npm ci
npm run build                 # → dist/ (версия сборки: dist/dsfc-manifest.json → version)
python3 tools/dsfc_check.py dist   # статическая проверка, должно быть «совместима с dsfc/1»
```

Версию можно задать явно: `DSFC_VERSION=2027.02.01-1 npm run build` (по умолчанию дата и время сборки).

## 2. Какие файлы переносить в Django

```bash
npm run export:django -- --static-url /static/ --prefix frontends
```

```text
export/django/
├── static/frontends/snowbase2027/<версия>/   # assets/, public/, dsfc-manifest.json → в STATIC_ROOT (или отдавать nginx)
└── templates/frontends/snowbase2027/index.html   # Django-шаблон → в каталог шаблонов (TEMPLATES → DIRS)
```

- `--static-url` — ваш `STATIC_URL` (адрес вшивается в JS и CSS, поэтому указывается при экспорте). Если статика на CDN — укажите адрес CDN.
- Каждая сборка лежит в своей папке с версией: новые файлы не перезаписывают старые, откат — это вернуть предыдущий шаблон.
- Шаблон и папку статики выкладывайте вместе и перезапускайте Django: при `DEBUG=False` шаблоны кэшируются, и старый шаблон будет ссылаться на старую версию файлов.
- Файлы в `assets/` имеют хеш в имени, их можно отдавать с `Cache-Control: public, max-age=31536000, immutable`.
- Видео (`assets/*.mp4`) отдавайте через nginx или WhiteNoise: Safari не проигрывает видео без поддержки Range, а `django.views.static.serve` её не умеет.
- `ManifestStaticFilesStorage` не мешает (исходные имена после `collectstatic` остаются), но и не нужен: имена уже с хешем.
  Удобнее положить папку прямо в `STATIC_ROOT` или отдать отдельным `location` в nginx:

```nginx
location /static/frontends/ {
    alias /srv/app/static/frontends/;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## 3. `index.html` как Django-шаблон

`export/django/templates/frontends/snowbase2027/index.html` — это `dist/index.html`, в котором:

- весь HTML сборки обёрнут в `{% verbatim %}…{% endverbatim %}` — шаблонизатор не трогает ни одного символа разметки Vue;
- SEO-теги по умолчанию вынесены в `{% block seo %}`;
- маркеры превращены в пустые блоки `{% block head_extra %}`, `{% block body_start %}`, `{% block body_end %}`.

Шаблон страницы Wagtail просто наследует его:

```django
{# templates/events/snowbase_page.html #}
{% extends "frontends/snowbase2027/index.html" %}
{% load wagtailcore_tags %}

{% block seo %}{% include "frontends/seo.html" %}{% endblock %}

{% block head_extra %}
  {{ frontend_config|json_script:"dsfc-config" }}
  {% include "analytics/head.html" %}
{% endblock %}

{% block body_start %}{% include "analytics/noscript.html" %}{% endblock %}
```

Не правьте сгенерированный шаблон руками и не вставляйте ничего внутрь `<div id="app" data-dsfc-root="">`:
это разметка, которую Vue гидратирует, любое изменение даёт hydration mismatch.

## 4. JS/CSS через Django Static Files

Ничего подключать вручную не нужно: `<script type="module">` и `<link rel="stylesheet">` уже стоят в шаблоне с полными адресами
`/static/frontends/snowbase2027/<версия>/assets/app-<hash>.js|css`. Имена файлов с хешем меняются при каждой сборке — поэтому
шаблон и статика всегда экспортируются вместе одной командой, а не прописываются руками и не берутся через `{% static %}`.
Скрипт один (ES-модуль, без динамических импортов), CSS один.

## 5. SEO-переменные Wagtail

Если блок `seo` не переопределён, работают значения по умолчанию из сборки (title, description, Open Graph, Twitter, robots, JSON-LD).
Если переопределён — дефолтные теги не выводятся вовсе, дублей нет. Пример `frontends/seo.html`:

```django
<title>{{ page.seo_title|default:page.title }}</title>
<meta name="description" content="{{ page.search_description }}">
<link rel="canonical" href="{{ page.full_url }}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:url" content="{{ page.full_url }}">
<meta property="og:title" content="{{ page.seo_title|default:page.title }}">
<meta property="og:description" content="{{ page.search_description }}">
{% if og_image_url %}<meta property="og:image" content="{{ og_image_url }}">{% endif %}
<meta name="twitter:card" content="summary_large_image">
```

- Значения выводите через `{{ … }}` (автоэкранирование включено) — не через `|safe`.
- JSON-LD — только через `json_script` или с ручным экранированием `<`, `>`, `&` (`<` и т. д.).
- Vue не меняет `<title>` и мета-теги ни при загрузке, ни после (проверяется `tools/dsfc_smoke.mjs`), поэтому значения из Wagtail не перезаписываются.
- Основной текст страницы (заголовок, описание, ссылки, подвал) уже есть в HTML без выполнения JS.

## 6. Конфигурация frontend из Django

Настройки, которые редактор может менять без пересборки, перечислены в `dsfc-manifest.json → config` (тип, подпись, значение по умолчанию):

| ключ | тип | что это | по умолчанию |
|---|---|---|---|
| `applyLink` | url | «Подать заявку» | https://lk.southhub.ru/ |
| `loginLink` | url | «Войти» | https://lk.southhub.ru/accounts/login/ |
| `questionLink` | url | «Задать вопрос» | https://t.me/southhub_com |
| `telegramLink` | url | кнопка Telegram в шапке | ссылка-приглашение в чат |
| `datesLabel` | text | даты на плашке | 25–28 февраля, 2027 |
| `calendarLink` | url | ссылка плашки с датами | Google Календарь, 25–28.02.2027 |
| `ticketsEnabled` | bool | показывать блок билетов | false |
| `ticketsEventId` | text | ID события для билетов | «» |
| `ticketsApiUrl` | url | адрес API билетов (тот же домен) | /api/tickets/ |

Django передаёт только изменённые значения, одним JSON-скриптом в `head_extra`:

```python
# views.py / get_context() страницы Wagtail
context["frontend_config"] = {
    "applyLink": page.apply_link,
    "ticketsEnabled": page.tickets_enabled,
    "ticketsEventId": str(page.event_id),
}
```

```django
{{ frontend_config|json_script:"dsfc-config" }}
```

Vue рендерит первый кадр со значениями по умолчанию (как в готовом HTML) и применяет `#dsfc-config` после монтирования.
Неизвестные ключи и значения не того типа игнорируются. Секретов во frontend-конфигурации быть не должно — она видна всем.

### Виджет билетов

`src/components/widgets/TicketWidget.vue`. В готовом HTML есть только скрытая оболочка; когда в конфигурации
`ticketsEnabled: true` и задан `ticketsEventId`, браузер делает запрос `GET <ticketsApiUrl>?event=<ticketsEventId>`
(с cookie сессии, только на тот же домен) и ждёт ответ:

```json
{ "items": [
  { "id": 1, "title": "Участник", "description": "…", "price": 290000, "currency": "RUB", "available": true, "buyUrl": "/tickets/buy/1/" }
] }
```

Состояния: загрузка, ошибка (с кнопкой «повторить»), «билетов пока нет», список. Ошибка API показывается только внутри блока
и не ломает страницу. Во время сборки запросов к API нет, фиктивных данных в коде нет. Для POST-запросов понадобится
`<meta name="csrf-token" content="{{ csrf_token }}">` в `head_extra` (заголовок `X-CSRFToken`).

## 7. Как не конфликтовать с Django Template Engine

- В исходниках Vue нет Django-синтаксиса, в готовом HTML нет `{{`, `{%`, `{#` и `endverbatim`
  (это проверяет `dsfc_check.py`; если такой текст появится на странице, `dsfc-postbuild.mjs` экранирует его как `&#123;`).
- Весь HTML сборки в шаблоне стоит внутри `{% verbatim %}`, так что даже такой текст Django не стал бы интерпретировать.
- Свои теги Django добавляет только в блоки `seo`, `head_extra`, `body_start`, `body_end` — вне корня Vue-приложения.
- Счётчики (Метрика 89187152 и т. п.) — в `head_extra` / `body_start` шаблона страницы или общих include'ах сайта.

## 8. Проверка гидратации после интеграции

1. Откройте страницу на Django в Chrome/Safari с открытой консолью: не должно быть ошибок и сообщения
   `Hydration completed but contains mismatches`, во вкладке Network — ответов 404.
2. В консоли: `document.querySelector('[data-dsfc-root]').__vue_app__` — объект (приложение смонтировано на готовую разметку),
   `document.title` — заголовок из Wagtail.
3. Работают: смена фото при наведении на «Подать заявку», шоурил, карта, бургер-меню на телефоне, анимация букв U, баннер cookies.
4. Автоматически (эмулирует Django: SEO из CMS, `#dsfc-config`, файлы и страница по разным адресам):

```bash
npm i --no-save playwright && npx playwright install chromium
node tools/dsfc_smoke.mjs dist       # «прошла браузерную проверку dsfc/1», скриншоты в dsfc-smoke-out/
```

## Способ Б: импортёр DSFC/1

Если на backend уже есть импортёр по контракту (`reference/dsfc/` в комплекте django-contract), ему передаётся `dist/` (или zip)
как есть: он сам проверяет сборку, раскладывает файлы по версиям, заменяет `/__DSFC_BASE__/` и делает шаблон. `export.mjs` тогда не нужен.
