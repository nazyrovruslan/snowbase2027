<template>
  <!-- блок с буквами U, как на southhub.ru: буквы увеличиваются возле курсора -->
  <section ref="root" class="u-block" @mousemove="onMove" @mouseleave="onLeave">
    <div class="row row-0">
      <div class="logo-cell"><img src="/sh/animate-u-block-logo.svg" alt="South HUB" height="21" /></div>
      <div v-for="i in 15" :key="i" class="cell"><img class="u" src="/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 16" :key="i" class="cell"><img class="u" src="/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 11" :key="i" class="cell"><img class="u" src="/sh/animate-u.svg" alt="" width="20" height="21" /></div>
      <div class="cell text-cell">масштаб идей, людей и теплых связей</div>
      <div class="cell"><img class="u" src="/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 16" :key="i" class="cell"><img class="u" src="/sh/animate-u.svg" alt="" width="20" height="21" /></div>
    </div>
    <div class="row">
      <div v-for="i in 15" :key="i" class="cell"><img class="u" src="/sh/animate-u.svg" alt="" width="20" height="21" /></div>
      <div class="cell"><img class="u" src="/sh/animate-b.svg" alt="" width="20" height="21" /></div>
    </div>
  </section>
</template>

<script setup>
const root = ref(null)
const MAX = 0.85 // максимальное доп. увеличение
const RADIUS = 130 // радиус влияния в px макета

let letters = []
let mouse = null
let raf = 0

const tick = () => {
  const k = root.value.getBoundingClientRect().width / 1920
  let moving = false
  for (const l of letters) {
    let target = 1
    if (mouse) {
      const r = l.el.getBoundingClientRect()
      const d = Math.hypot(r.left + r.width / 2 - mouse.x, r.top + r.height / 2 - mouse.y) / k
      target = 1 + MAX * Math.exp(-((d / RADIUS) ** 2))
    }
    l.s += (target - l.s) * 0.15
    if (Math.abs(target - l.s) > 0.001) moving = true
    l.el.style.transform = `scale(${l.s.toFixed(3)})`
  }
  raf = moving || mouse ? requestAnimationFrame(tick) : 0
}
const start = () => { if (!raf) raf = requestAnimationFrame(tick) }
const onMove = (e) => { mouse = { x: e.clientX, y: e.clientY }; start() }
const onLeave = () => { mouse = null; start() }

onMounted(() => { letters = [...root.value.querySelectorAll('.u')].map(el => ({ el, s: 1 })) })
onBeforeUnmount(() => cancelAnimationFrame(raf))
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
.cell { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; flex: none; }
.u { will-change: transform; }
/* текст занимает место 4 ячеек: 200px + 3 промежутка */
.text-cell {
  width: calc(200px + (1800px - 50px * 16) / 15 * 3);
  color: #fff; font-size: 22px; font-weight: 400; line-height: 110%; white-space: pre;
}
</style>
