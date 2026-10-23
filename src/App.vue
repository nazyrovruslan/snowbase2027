<template>
  <!-- десктоп: макет 1920px, мобильная версия: макет 390px; обе масштабируются под ширину окна -->
  <main>
    <div class="page page-desktop" :style="{ '--k': k }">
      <SbHero />
      <SbPattern />
    </div>
    <div class="page-mobile" :style="{ '--km': km }">
      <MobHero />
      <MobPattern />
    </div>
    <!-- виджет билетов: по умолчанию выключен, включается из Wagtail (ticketsEnabled + ticketsEventId) -->
    <TicketWidget :enabled="cfg.ticketsEnabled" :event-id="cfg.ticketsEventId" :api-url="cfg.ticketsApiUrl" />
  </main>
  <!-- подвал общий для обеих версий, вне масштабируемого макета — как на демо South HUB 2027 -->
  <SiteFooter />
  <VideoModal />
  <MapModal />
  <CookieBanner />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SbHero from '@/components/sections/SbHero.vue'
import SbPattern from '@/components/sections/SbPattern.vue'
import MobHero from '@/components/sections/MobHero.vue'
import MobPattern from '@/components/sections/MobPattern.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import CookieBanner from '@/components/layout/CookieBanner.vue'
import VideoModal from '@/components/modals/VideoModal.vue'
import MapModal from '@/components/modals/MapModal.vue'
import TicketWidget from '@/components/widgets/TicketWidget.vue'
import { useSiteConfig, applyCmsConfig } from '@/composables/useSiteConfig'
import { installUtmForwarding } from '@/utils/utm'

const cfg = useSiteConfig()

// масштаб макета зависит от ширины окна, поэтому при SSG он 1, а в браузере пересчитывается после монтирования
const k = ref(1)
const km = ref(1)
let ro: ResizeObserver | undefined
onMounted(() => {
  applyCmsConfig()
  installUtmForwarding()
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
