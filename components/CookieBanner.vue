<template>
  <!-- баннер cookies как на southhub.ru; согласие общее для всего домена (ключ isVisibleCookieAlert) -->
  <div v-if="visible" class="cookie-banner">
    <p class="cookie-banner-text">
      Мы собираем cookies, потому что они помогают сайту помнить вас и&nbsp;оставаться таким&nbsp;же внимательным,
      как&nbsp;люди в&nbsp;сообществе South&nbsp;HUВ. Просто скажите «да»
    </p>
    <div class="cookie-banner-button-wrapper">
      <button type="button" class="base-button base-button-white cookie-banner-button" @click="accept">да</button>
    </div>
  </div>
</template>

<script setup>
const KEY = 'isVisibleCookieAlert'
const visible = ref(false)
onMounted(() => { try { visible.value = !window.localStorage.getItem(KEY) } catch { visible.value = true } })
const accept = () => {
  visible.value = false
  try { window.localStorage.setItem(KEY, 'true') } catch {}
}
</script>

<style scoped>
.cookie-banner {
  position: fixed; z-index: 150; left: 50%; bottom: 24px; transform: translateX(-50%);
  width: 900px; max-width: calc(100vw - 20px); padding: 24px 32px; border-radius: 8px; background: #111;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; font-family: var(--font);
}
.cookie-banner-text { color: #fff; font-size: 14px; font-weight: 300; line-height: 125%; max-width: 655px; }
.cookie-banner-button-wrapper { width: 140px; display: flex; align-items: center; justify-content: center; flex: none; }
.cookie-banner-button { width: 100px; background: none; border: 0; cursor: pointer; color: #fff; }
.cookie-banner-button:hover { width: 120px; }
@media (max-width: 1024px) {
  .cookie-banner { gap: 20px; padding: 16px; bottom: 10px; }
  .cookie-banner-text { font-size: 12px; }
  .cookie-banner-button-wrapper { width: 110px; }
}
</style>
