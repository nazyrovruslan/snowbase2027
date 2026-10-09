<template>
  <!-- мобильный блок с U: 5 колонок, буквы увеличиваются под пальцем/курсором -->
  <section
    ref="root"
    class="u-block"
    @pointermove="onMove"
    @pointerdown="onMove"
    @pointerleave="onLeave"
    @pointerup="onRelease"
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
// Тап по букве: она увеличивается на 100%, соседи сверху/снизу/слева/справа — на 50%.
const root = ref(null)
let letters = []
let active = null // { row, col }
let raf = 0

const targetFor = (l) => {
  if (!active) return 1
  const d = Math.abs(l.row - active.row) + Math.abs(l.col - active.col)
  return d === 0 ? 2 : d === 1 ? 1.5 : 1
}

const tick = () => {
  let moving = false
  for (const l of letters) {
    const t = targetFor(l)
    l.s += (t - l.s) * 0.2
    if (Math.abs(t - l.s) > 0.001) moving = true
    else l.s = t
    l.el.style.transform = `scale(${l.s.toFixed(3)})`
  }
  raf = moving ? requestAnimationFrame(tick) : 0
}
const start = () => { if (!raf) raf = requestAnimationFrame(tick) }

// ближайшая к пальцу буква (в пределах ячейки)
const pick = (x, y) => {
  let best = null, bestD = Infinity
  for (const l of letters) {
    const r = l.el.parentElement.getBoundingClientRect()
    const d = Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y)
    if (d < bestD) { bestD = d; best = l }
  }
  const cell = best?.el.parentElement.getBoundingClientRect()
  return best && bestD < Math.max(cell.width, cell.height) ? best : null
}
const onMove = (e) => {
  clearTimeout(releaseTimer)
  const l = pick(e.clientX, e.clientY)
  const next = l ? { row: l.row, col: l.col } : null
  if (next?.row !== active?.row || next?.col !== active?.col) { active = next; start() }
}
let releaseTimer = 0
const onLeave = () => { clearTimeout(releaseTimer); active = null; start() }
// после тапа буквы держатся увеличенными чуть дольше, чтобы эффект был заметен
const onRelease = () => { clearTimeout(releaseTimer); releaseTimer = setTimeout(onLeave, 700) }

onMounted(() => {
  const rows = [...root.value.querySelectorAll('.row')]
  const all = [...root.value.querySelectorAll('.u')]
  const xs = all.map(el => el.getBoundingClientRect()).map(r => r.left + r.width / 2)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  letters = all.map((el, i) => {
    const row = rows.indexOf(el.closest('.row'))
    // в первом ряду 4 буквы справа от логотипа — это колонки 1–4
    const col = row === 0
      ? [...rows[0].querySelectorAll('.u')].indexOf(el) + 1
      : Math.round(((xs[i] - minX) / (maxX - minX)) * 4)
    return { el, s: 1, row, col }
  })
})
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
.slogan { color: var(--white); font-weight: 300; font-size: 15px; line-height: normal; white-space: nowrap; }
</style>
