// Как на southhub.ru: UTM-метки из адреса страницы дописываются к ссылкам на southhub.ru
// (личный кабинет и др.), если у ссылки нет своего utm_source.
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

/** Вызывается в браузере после монтирования. */
export function installUtmForwarding() {
  const params = new URLSearchParams(window.location.search)
  const utm = UTM_KEYS.filter((k) => params.get(k) !== null).map((k) => [k, params.get(k)!] as const)
  if (!utm.length) return

  const withUtm = (href: string | null) => {
    if (!href || !href.includes('southhub.ru') || href.includes('utm_source=')) return href
    const q = utm.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    return href + (href.includes('?') ? '&' : '?') + q
  }

  // ссылки дописываются в момент клика (и при открытии через колёсико/контекстное меню)
  const patch = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.('a[href]')
    const href = a && withUtm(a.getAttribute('href'))
    if (a && href) a.setAttribute('href', href)
  }
  document.addEventListener('pointerdown', patch, true)
  document.addEventListener('click', patch, true)
  document.addEventListener('contextmenu', patch, true)
}
