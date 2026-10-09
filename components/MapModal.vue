<template>
  <!-- небольшой попап с Яндекс Картой: метка на Архызе -->
  <Transition name="fade">
    <div v-if="open" class="map-modal" @click.self="open = false">
      <div class="box">
        <div class="head">
          <span>Архыз, Карачаево-Черкесия</span>
          <button class="close" aria-label="Закрыть карту" @click="open = false">×</button>
        </div>
        <iframe
          class="map"
          :src="`https://yandex.ru/map-widget/v1/?ll=${LON}%2C${LAT}&z=11&pt=${LON}%2C${LAT}%2Cpm2rdm`"
          title="Архыз на Яндекс Картах"
          allowfullscreen
        />
        <a
          class="open-link"
          :href="`https://yandex.ru/maps/?ll=${LON}%2C${LAT}&z=12&pt=${LON}%2C${LAT}%2Cpm2rdm`"
          target="_blank"
        >Открыть в Яндекс Картах ↗</a>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// посёлок Архыз
const LAT = 43.5617
const LON = 41.2847

const open = useState('map', () => false)
const onKey = (e) => { if (e.key === 'Escape') open.value = false }
watch(open, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.map-modal {
  position: fixed; inset: 0; z-index: 200; background: rgba(0, 0, 0, .4);
  display: flex; align-items: center; justify-content: center; padding: 16px;
  font-family: var(--font);
}
.box {
  width: 560px; max-width: 100%; background: #fff; border-radius: 15px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .25);
}
.head { display: flex; align-items: center; justify-content: space-between; padding: 12px 12px 12px 20px; font-size: 16px; }
.close { width: 36px; height: 36px; border: 0; background: none; font-size: 28px; line-height: 1; cursor: pointer; }
.map { display: block; width: 100%; height: 360px; border: 0; }
.open-link { display: block; padding: 14px 20px; font-size: 14px; }
.open-link:hover { opacity: .6; }
@media (max-width: 767px) {
  .map { height: 300px; }
}
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
