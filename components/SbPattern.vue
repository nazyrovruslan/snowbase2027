<template>
  <!-- блок с буквами U, как на southhub.ru: буквы увеличиваются возле курсора -->
  <section ref="root" class="u-block">
    <div class="row row-0">
      <div class="logo-cell"><img src="~/assets/sh/animate-u-block-logo.svg" alt="South HUB" height="21" /></div>
      <div v-for="i in 15" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 16" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 11" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" width="20" height="21" /></div>
      <div class="cell text-cell">масштаб идей, людей и теплых связей</div>
      <div class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 16" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 15" :key="i" class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-u.svg" alt="" width="20" height="21" /></div>
      <div class="cell" data-wave-letter><img class="u" src="~/assets/sh/animate-b.svg" alt="" width="20" height="21" /></div>
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
  width: 1920px; height: 614px; padding: 30px 60px; background: #111;
  display: flex; flex-direction: column; gap: 76px;
}
.row { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.row-0 { position: relative; padding-left: 162px; }
.logo-cell { position: absolute; left: 0; top: 0; height: 100%; display: flex; align-items: center; }
.logo-cell img { height: 21px; width: auto; }
.cell { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; flex: none; will-change: transform; }
/* текст занимает место 4 ячеек: 200px + 3 промежутка */
.text-cell {
  width: calc(200px + (1800px - 50px * 16) / 15 * 3);
  color: #fff; font-size: 22px; font-weight: 300; line-height: 110%; white-space: pre;
}
</style>
