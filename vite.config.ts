import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// vite-ssg/single-page импортирует unhead всегда, хотя при useHead: false он не вызывается (см. src/main.ts).
// Подменяем его заглушкой: минус ~20 КБ JS и в бандле нет кода, который мог бы трогать <head> (DSFC/1 §6).
const UNHEAD_STUB = '\0unhead-stub'
const noUnhead: Plugin = {
  name: 'no-unhead',
  enforce: 'pre',
  resolveId: (id) => (id === '@unhead/vue/client' || id === '@unhead/vue/server' ? UNHEAD_STUB : null),
  load: (id) => (id === UNHEAD_STUB ? "export function createHead() { throw new Error('unhead is disabled') }" : null),
}

export default defineConfig({
  // DSFC/1 §3: все локальные адреса начинаются с этого токена; при импорте в Django его заменяют на реальный адрес
  base: '/__DSFC_BASE__/',
  plugins: [noUnhead, vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    assetsDir: 'assets',
    // картинки и шрифты отдельными файлами с хешем, а не data: в CSS/JS
    assetsInlineLimit: 0,
    sourcemap: false,
  },
  ssgOptions: {
    formatting: 'none', // сохраняет маркеры <!--dsfc:*-->
  },
})
