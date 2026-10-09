// Яндекс Метрика — тот же счётчик и параметры, что на southhub.ru.
// Включается только при NUXT_PUBLIC_ENABLE_METRIC=true (на тестовом сайте выключена).
export default defineNuxtPlugin(() => {
  const { enableMetric, metrikaId } = useRuntimeConfig().public
  if (!enableMetric || enableMetric === 'false') return

  const ym = window.ym ?? function (...args) { (ym.a = ym.a || []).push(args) }
  ym.l = Date.now()
  window.ym = ym

  const s = document.createElement('script')
  s.async = true
  s.defer = true
  s.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(s)

  ym(Number(metrikaId), 'init', {
    defer: true,
    webvisor: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    ecommerce: 'dataLayer',
  })
})
