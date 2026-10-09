<template>
  <!-- десктоп: макет 1920px, мобильная версия: макет 390px; обе масштабируются под ширину окна -->
  <div class="page page-desktop" :style="{ '--k': k }">
    <SbHero />
    <SbPattern />
    <SbFooter />
  </div>
  <div class="page-mobile" :style="{ '--km': km }">
    <MobHero />
    <MobPattern />
    <MobFooter />
  </div>
  <VideoModal />
  <MapModal />
</template>

<script setup>
// фавиконки лежат в public/, путь учитывает baseURL (например /snowbase2027/ на GitHub Pages)
const base = useRuntimeConfig().app.baseURL
useHead({
  link: [
    { rel: 'icon', href: base + 'favicon.ico', sizes: 'any' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: base + 'favicon-32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: base + 'favicon-16.png' },
    { rel: 'icon', type: 'image/png', sizes: '196x196', href: base + 'favicon-196.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: base + 'apple-touch-icon.png' },
  ],
})

const k = ref(1)
const km = ref(1)
let ro
onMounted(() => {
  const el = document.documentElement
  const fit = () => {
    k.value = el.clientWidth / 1920
    km.value = el.clientWidth / 390
  }
  ro = new ResizeObserver(fit)
  ro.observe(el)
  fit()
})
onBeforeUnmount(() => ro?.disconnect())
</script>
