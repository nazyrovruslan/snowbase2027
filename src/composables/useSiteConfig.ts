// DSFC/1 §7: настройки, которые редактор меняет в Wagtail без пересборки (описаны в dsfc.config.json → config).
// Первый рендер (и при SSG, и при гидратации) идёт со значениями по умолчанию, значения из CMS
// (<script id="dsfc-config" type="application/json"> от Django) применяются только после монтирования.
import { reactive, readonly } from 'vue'
import project from '../../dsfc.config.json'

type Spec = (typeof project.config)[keyof typeof project.config]
export type SiteConfig = { [K in keyof typeof project.config]: (typeof project.config)[K]['default'] }

const defaults = Object.fromEntries(
  Object.entries(project.config).map(([k, v]) => [k, (v as Spec).default]),
) as SiteConfig

const state = reactive<SiteConfig>({ ...defaults })

/** Общие для всей страницы настройки (только чтение). */
export function useSiteConfig() {
  return readonly(state)
}

/** Вызывается один раз из App.vue в onMounted. Чужие ключи и значения не того типа игнорируются. */
export function applyCmsConfig() {
  const el = document.getElementById('dsfc-config')
  if (!el) return
  let cms: Record<string, unknown>
  try {
    cms = JSON.parse(el.textContent || '{}')
  } catch (e) {
    console.warn('dsfc-config: некорректный JSON', e)
    return
  }
  for (const key of Object.keys(defaults) as (keyof SiteConfig)[]) {
    const value = cms[key]
    if (value !== undefined && value !== null && typeof value === typeof defaults[key]) {
      ;(state as Record<string, unknown>)[key] = value
    }
  }
}
