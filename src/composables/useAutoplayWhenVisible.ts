// Запускает muted-видео, когда оно видно на экране, и ставит на паузу, когда нет.
// Нужно, потому что автоплей не срабатывает у видео, скрытых при загрузке (десктоп/мобилка).
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useAutoplayWhenVisible(videoRef: Ref<HTMLVideoElement | null>) {
  let io: IntersectionObserver | undefined
  onMounted(() => {
    const v = videoRef.value
    if (!v) return
    v.muted = true
    io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
  })
  onBeforeUnmount(() => io?.disconnect())
}
