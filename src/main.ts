import { ViteSSG } from 'vite-ssg/single-page'
import App from './App.vue'
import './styles/main.css'

// hydration: true — без него vite-ssg/single-page перерисовывает страницу в браузере, а не гидратирует готовый HTML.
// useHead: false — DSFC/1 §6: <head> принадлежит Django, приложение его не трогает (и <html lang> остаётся из index.html).
export const createApp = ViteSSG(App, undefined, { hydration: true, useHead: false })
