<template>
  <!-- логотип: «SNOW BASE» — наверх страницы, «SOUTHUUUB» — на southhub.ru -->
  <div class="sb-logo">
    <img :src="src" alt="Snow BASE by South HUB" />
    <a class="zone snow" href="#" aria-label="Snow BASE — наверх страницы" @click.prevent="toTop" />
    <a class="zone south" href="https://southhub.ru/" target="_blank" aria-label="South HUB" />
  </div>
</template>

<script setup>
defineProps({ src: { type: String, required: true } })
const emit = defineEmits(['top'])
const toTop = () => {
  emit('top')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.sb-logo { position: absolute; }
.sb-logo img { width: 100%; height: 100%; }
.zone { position: absolute; display: block; }
/* зоны по координатам надписей в SVG */
.snow { left: 0; top: 0; width: 100%; height: 58%; }
.south { left: 10.5%; top: 64%; width: 50%; height: 36%; }
</style>
