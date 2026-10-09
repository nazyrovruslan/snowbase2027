<template>
  <!-- полноэкранный шоурил «Как прошёл Snow BASE'2026» -->
  <Transition name="fade">
    <div v-if="open" class="video-modal" @click.self="open = false">
      <button class="close" aria-label="Закрыть видео" @click="open = false">×</button>
      <video
        class="player"
        src="~/assets/video/showreel-2026.mp4"
        poster="~/assets/video/poster-2026.png"
        controls
        autoplay
        playsinline
      />
    </div>
  </Transition>
</template>

<script setup>
const open = useState('video', () => false)
const onKey = (e) => { if (e.key === 'Escape') open.value = false }
watch(open, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.video-modal {
  position: fixed; inset: 0; z-index: 200; background: rgba(0, 0, 0, .85);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.player { max-width: min(1280px, 100%); max-height: 100%; width: 100%; border-radius: 12px; background: #000; }
.close {
  position: absolute; top: 12px; right: 16px; width: 44px; height: 44px;
  background: none; border: 0; color: #fff; font-size: 36px; line-height: 1; cursor: pointer;
}
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
