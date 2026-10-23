// Анимация букв U как на southhub.ru (компонент BlockWithUAnimate):
// буквы под курсором/пальцем увеличиваются до ×2 по гауссиане, радиус — медианный шаг между буквами × 1.1;
// рост быстрый (0.22), возврат медленный (0.06). Элементы помечаются атрибутом data-wave-letter.
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

const RADIUS_K = 1.1
const GROW = 0.22
const SHRINK = 0.06

export function useUWave(rootRef: Ref<HTMLElement | null>) {
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const root = rootRef.value
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(root.querySelectorAll<HTMLElement>('[data-wave-letter]'))
    const cur: number[] = letters.map(() => 1)
    const target: number[] = letters.map(() => 1)
    let raf = 0

    const tick = () => {
      let moving = false
      letters.forEach((el, i) => {
        const d = target[i] - cur[i]
        if (Math.abs(d) < 0.002) cur[i] = target[i]
        else { cur[i] = cur[i] + d * (d > 0 ? GROW : SHRINK); moving = true }
        el.style.transform = cur[i] === 1 ? '' : `scale(${cur[i].toFixed(3)})`
      })
      raf = moving ? requestAnimationFrame(tick) : 0
    }
    const start = () => { raf ||= requestAnimationFrame(tick) }

    const update = (p: { clientX: number; clientY: number }) => {
      const centers = letters.map((el) => el.getBoundingClientRect()).map((r): [number, number] => [r.left + r.width / 2, r.top + r.height / 2])
      const steps: number[] = []
      for (let i = 1; i < centers.length; i++) {
        const [x1, y1] = centers[i]
        const [x0, y0] = centers[i - 1]
        const dx = Math.abs(x1 - x0)
        if (dx > 1 && Math.abs(y1 - y0) < 1) steps.push(dx)
      }
      steps.sort((a, b) => a - b)
      const radius = (steps.length ? steps[Math.floor(steps.length / 2)] : 150) * RADIUS_K
      centers.forEach(([x, y], i) => {
        const o = Math.hypot(p.clientX - x, p.clientY - y) / radius
        target[i] = 1 + Math.exp(-o * o)
      })
      start()
    }
    const reset = () => { target.fill(1); start() }
    const onPointer = (e: PointerEvent) => { if (e.pointerType !== 'touch') update(e) }
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) update(e.touches[0]) }

    root.addEventListener('pointermove', onPointer)
    root.addEventListener('pointerleave', reset)
    root.addEventListener('touchstart', onTouch, { passive: true })
    root.addEventListener('touchmove', onTouch, { passive: true })
    root.addEventListener('touchend', reset)
    root.addEventListener('touchcancel', reset)

    cleanup = () => {
      root.removeEventListener('pointermove', onPointer)
      root.removeEventListener('pointerleave', reset)
      root.removeEventListener('touchstart', onTouch)
      root.removeEventListener('touchmove', onTouch)
      root.removeEventListener('touchend', reset)
      root.removeEventListener('touchcancel', reset)
      cancelAnimationFrame(raf)
      letters.forEach((el) => { el.style.transform = '' })
    }
  })

  onBeforeUnmount(() => cleanup?.())
}
