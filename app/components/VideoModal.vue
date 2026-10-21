<template>
  <!-- полноэкранный шоурил «Как прошёл Snow BASE'2026»: стартует без звука, звук включается по нажатию -->
  <Transition name="fade">
    <div v-if="open" class="video-modal" @click.self="open = false">
      <button class="close" aria-label="Закрыть видео" @click="open = false">×</button>
      <div class="frame">
        <video
          ref="player"
          class="player"
          src="~/assets/video/showreel-2026.mp4"
          poster="~/assets/video/poster-2026.jpg"
          muted
          autoplay
          playsinline
          :controls="!muted"
          @click="unmute"
          @volumechange="muted = $event.target.muted"
        />
        <button v-if="muted" class="sound" @click="unmute">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
          </svg>
          Включить звук
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const open = useState('video', () => false)
const player = ref(null)
const muted = ref(true)

const unmute = () => {
  const v = player.value
  if (!v || !muted.value) return
  v.muted = false
  v.play().catch(() => {})
}

const onKey = (e) => { if (e.key === 'Escape') open.value = false }
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) muted.value = true
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.video-modal {
  position: fixed; inset: 0; z-index: 200; background: rgba(0, 0, 0, .85);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.frame { position: relative; width: 100%; max-width: 1280px; }
.player { display: block; width: 100%; max-height: calc(100dvh - 48px); border-radius: 12px; background: #000; cursor: pointer; }
.sound {
  position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 20px;
  background: rgba(255, 255, 255, .85); backdrop-filter: blur(10px); color: #000;
  border: 0; border-radius: 50px; font: inherit; font-size: 16px; cursor: pointer;
  transition: background .2s ease;
}
.sound:hover { background: #fff; }
.close {
  position: absolute; top: 12px; right: 16px; width: 44px; height: 44px;
  background: none; border: 0; color: #fff; font-size: 36px; line-height: 1; cursor: pointer;
}
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
