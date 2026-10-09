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
</template>

<script setup>
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
