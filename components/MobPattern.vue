<template>
  <!-- мобильный блок с U: 5 колонок, буквы увеличиваются под пальцем/курсором -->
  <section
    ref="root"
    class="u-block"
    @pointermove="onMove"
    @pointerdown="onMove"
    @pointerleave="onLeave"
    @pointerup="onLeave"
    @pointercancel="onLeave"
  >
    <div class="row row-first">
      <img class="logo" src="~/assets/sh/animate-u-block-logo.svg" alt="South HUB" />
      <div class="cells">
        <span v-for="i in 4" :key="i" class="cell"><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
      </div>
    </div>
    <div v-for="r in 2" :key="'a' + r" class="row">
      <span v-for="i in 5" :key="i" class="cell"><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
    </div>
    <div class="row">
      <span class="cell"><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
      <span class="slogan">масштаб идей, людей и теплых связей</span>
    </div>
    <div v-for="r in 2" :key="'b' + r" class="row">
      <span v-for="i in 5" :key="i" class="cell"><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
    </div>
    <div class="row">
      <span v-for="i in 4" :key="i" class="cell"><img class="u" src="~/assets/sh/animate-u.svg" alt="" /></span>
      <span class="cell"><img class="u" src="~/assets/sh/animate-b.svg" alt="" /></span>
    </div>
  </section>
</template>

<script setup>
const root = ref(null)
const MAX = 0.85
const RADIUS = 45 // в px макета 390

let letters = []
let pointer = null
let raf = 0

const tick = () => {
  const k = root.value.getBoundingClientRect().width / 390
  let moving = false
  for (const l of letters) {
    let target = 1
    if (pointer) {
      const r = l.el.getBoundingClientRect()
      const d = Math.hypot(r.left + r.width / 2 - pointer.x, r.top + r.height / 2 - pointer.y) / k
      target = 1 + MAX * Math.exp(-((d / RADIUS) ** 2))
    }
    l.s += (target - l.s) * 0.15
    if (Math.abs(target - l.s) > 0.001) moving = true
    l.el.style.transform = `scale(${l.s.toFixed(3)})`
  }
  raf = moving || pointer ? requestAnimationFrame(tick) : 0
}
const start = () => { if (!raf) raf = requestAnimationFrame(tick) }
const onMove = (e) => { pointer = { x: e.clientX, y: e.clientY }; start() }
const onLeave = () => { pointer = null; start() }

onMounted(() => { letters = [...root.value.querySelectorAll('.u')].map(el => ({ el, s: 1 })) })
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.u-block {
  width: 390px; height: 800px; padding: 50px 16px; background: #111;
  display: flex; flex-direction: column; justify-content: space-between; touch-action: pan-y;
}
.row { display: flex; align-items: center; justify-content: space-between; height: 40px; }
.row-first .logo { height: 20px; width: auto; }
.cells { width: 200px; display: flex; justify-content: space-between; }
.cell { width: 20px; height: 40px; display: flex; align-items: center; justify-content: center; flex: none; }
.u { width: 20px; height: 21px; will-change: transform; }
.slogan { color: var(--white); font-size: 15px; line-height: normal; white-space: nowrap; }
</style>
