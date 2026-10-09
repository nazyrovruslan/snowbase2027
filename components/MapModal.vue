<template>
  <!-- небольшой попап с Яндекс Картой (метка на Архызе), оформлен как карточки сайта -->
  <Transition name="fade">
    <div v-if="open" class="map-modal" @click.self="open = false">
      <div class="box">
        <div class="head">
          <span class="place">
            <img src="~/assets/sb/pin.svg" alt="" width="17" height="20" />
            Горная улица, 45, Архыз
          </span>
          <button class="corners close" aria-label="Закрыть карту" @click="open = false">
            <i /><i /><i /><i />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>
        <div class="map-wrap">
          <!-- виджет Яндекса не настраивается по цветам, поэтому карта приводится к монохрому фильтром -->
          <iframe
            class="map"
            :src="`https://yandex.ru/map-widget/v1/?ll=${LON}%2C${LAT}&z=15&pt=${LON}%2C${LAT}%2Cpm2dgm`"
            title="Архыз на Яндекс Картах"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Горная улица, 45, село Архыз
const LAT = 43.539484
const LON = 41.184666

const open = useState('map', () => false)
const onKey = (e) => { if (e.key === 'Escape') open.value = false }
watch(open, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.map-modal {
  position: fixed; inset: 0; z-index: 200; background: rgba(0, 0, 0, .25); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
  font-family: var(--font); color: #000;
}
/* как карточка «Как прошёл Snow BASE'2026»: полупрозрачная белая подложка с размытием */
.box {
  width: 560px; max-width: 100%; padding: 10px; border-radius: 15px;
  background: rgba(255, 255, 255, .7); backdrop-filter: blur(10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, .15);
}
.head { display: flex; align-items: center; justify-content: space-between; padding: 0 0 10px 10px; }
.place { display: flex; align-items: center; gap: 10px; font-size: 16px; line-height: normal; }
.close { width: 40px; height: 40px; background: none; border: 0; cursor: pointer; color: #000; }
.map-wrap { border-radius: 10px; overflow: hidden; background: #e9e9e9; }
.map {
  display: block; width: 100%; height: 360px; border: 0;
  filter: grayscale(1) contrast(1.05) brightness(1.04);
}
@media (max-width: 767px) {
  .map { height: 320px; }
}
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
