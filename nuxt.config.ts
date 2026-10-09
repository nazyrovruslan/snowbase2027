export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Snow BASE 2027 — Кэмп для C-level в AI',
      htmlAttrs: { lang: 'ru' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  }
})
