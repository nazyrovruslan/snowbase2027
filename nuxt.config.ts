// Настройки перенесены с southhub.ru (страница https://southhub.ru/snowbase/)
const SITE_URL = 'https://southhub.ru/snowbase/'
const TITLE = 'Snow BASE 2027 — кэмп для C-level в AI, 25 — 28 февраля 2027'
const DESCRIPTION =
  'Snow BASE — кэмп для C-level в AI. Четыре дня в горах Архыза: лидеры AI разбирают деньги, технологии, команды и решения, которые пришлось переделать, — всё, что осталось за кадром успешных кейсов.'
const OG_IMAGE = SITE_URL + 'og.jpg'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // как на southhub.ru: Метрика включается только флагом (NUXT_PUBLIC_ENABLE_METRIC=true на проде)
      enableMetric: false,
      metrikaId: 89187152,
      // индексировать ли страницу (на тестовом GitHub Pages выключено)
      indexable: true,
      siteUrl: SITE_URL,
    },
  },

  app: {
    // адрес страницы на проде: https://southhub.ru/snowbase/
    baseURL: process.env.NUXT_APP_BASE_URL || '/snowbase/',
    head: {
      title: TITLE,
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: DESCRIPTION },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:site_name', content: 'Southuuub' },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: DESCRIPTION },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: OG_IMAGE },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: OG_IMAGE },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [{ rel: 'canonical', href: SITE_URL }],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'Organization', name: 'South HUB', url: 'https://southhub.ru' },
              { '@type': 'WebSite', url: 'https://southhub.ru', name: 'South HUB' },
              { '@type': 'WebPage', url: SITE_URL, name: TITLE, description: DESCRIPTION },
              {
                '@type': 'Event',
                name: 'Snow BASE 2027',
                description: DESCRIPTION,
                startDate: '2027-02-25',
                endDate: '2027-02-28',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                eventStatus: 'https://schema.org/EventScheduled',
                location: {
                  '@type': 'Place',
                  name: 'Архыз',
                  address: { '@type': 'PostalAddress', addressLocality: 'Архыз', addressRegion: 'Карачаево-Черкесская Республика', addressCountry: 'RU' },
                },
                organizer: { '@type': 'Organization', name: 'South HUB', url: 'https://southhub.ru' },
                url: SITE_URL,
                image: OG_IMAGE,
              },
            ],
          }),
        },
      ],
      noscript: [],
    },
  },
})
