// Общее состояние попапов: шоурил и карту открывают кнопки и в десктопной, и в мобильной версии.
import { ref } from 'vue'

const video = ref(false)
const map = ref(false)

export function useModals() {
  return { video, map }
}
