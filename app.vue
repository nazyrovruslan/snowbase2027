<template>
  <div class="page" :style="{ '--k': k }">
    <SbHero />
    <SbPattern />
    <SbFooter />
  </div>
</template>

<script setup>
// страница свёрстана в 1920px и масштабируется под ширину окна
const k = ref(1)
let ro
onMounted(() => {
  const el = document.documentElement
  const fit = () => { k.value = el.clientWidth / 1920 }
  ro = new ResizeObserver(fit)
  ro.observe(el)
  fit()
})
onBeforeUnmount(() => ro?.disconnect())
</script>
