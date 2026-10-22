// Блокирует прокрутку страницы, пока открыт хотя бы один попап или меню.
import { watch, onBeforeUnmount, type Ref } from 'vue'

let locks = 0
const apply = () => { document.documentElement.style.overflow = locks > 0 ? 'hidden' : '' }

export function useScrollLock(open: Ref<boolean>) {
  let held = false
  const set = (v: boolean) => {
    if (v === held) return
    held = v
    locks += v ? 1 : -1
    apply()
  }
  watch(open, set)
  onBeforeUnmount(() => set(false))
}
