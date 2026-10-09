<template>
  <!-- мобильный блок с U: 5 колонок, буквы увеличиваются под пальцем/курсором -->
  <section ref="root" class="u-block">
    <div class="row row-first">
      <img class="logo" src="~/assets/sh/animate-u-block-logo.svg" alt="South HUB" />
      <div class="cells">
        <span v-for="i in 4" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
      </div>
    </div>
    <div v-for="r in 2" :key="'a' + r" class="row">
      <span v-for="i in 5" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
    </div>
    <div class="row">
      <span class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
      <span class="slogan">масштаб идей, людей и теплых связей</span>
    </div>
    <div v-for="r in 2" :key="'b' + r" class="row">
      <span v-for="i in 5" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
    </div>
    <div class="row">
      <span v-for="i in 4" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
      <span class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-b.svg" alt="" /></span>
    </div>
  </section>
</template>

<script setup>
// анимация букв — как на southhub.ru, см. composables/useUWave.js
const root = ref(null)
useUWave(root)
</script>

<style scoped>
.u-block {
  width: 390px; height: 800px; padding: 50px 16px; background: #111;
  display: flex; flex-direction: column; justify-content: space-between; touch-action: pan-y;
}
.row { display: flex; align-items: center; justify-content: space-between; height: 40px; }
.row-first .logo { height: 21px; width: auto; }
.cells { width: 200px; display: flex; justify-content: space-between; }
.cell { width: 20px; height: 40px; display: flex; align-items: center; justify-content: center; flex: none; will-change: transform; }
.u { width: 20px; height: 21px; }
.slogan { color: var(--white); font-weight: 300; font-size: 14px; line-height: normal; white-space: nowrap; }
</style>
