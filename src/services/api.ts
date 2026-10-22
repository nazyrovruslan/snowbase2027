// Клиент для API Django. Запросы выполняются только в браузере (из onMounted), никогда во время SSG.
// Секретов здесь нет и быть не должно: авторизация — сессия Django того же домена
// (для POST понадобится заголовок X-CSRFToken из <meta name="csrf-token">, см. CONTRACT.md §7).

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Разрешены только адреса того же домена, что и страница: API отдаёт сам Django. */
export function resolveApiUrl(url: string): URL {
  const u = new URL(url, window.location.href)
  if (u.origin !== window.location.origin) throw new ApiError(`API другого домена не поддерживается: ${u.origin}`)
  return u
}

export async function apiGet<T>(url: string, params: Record<string, string> = {}, signal?: AbortSignal): Promise<T> {
  const u = resolveApiUrl(url)
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v)
  let res: Response
  try {
    res = await fetch(u, { headers: { Accept: 'application/json' }, credentials: 'same-origin', signal })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new ApiError('Нет соединения с сервером')
  }
  if (!res.ok) throw new ApiError(`Сервер ответил ${res.status}`, res.status)
  try {
    return (await res.json()) as T
  } catch {
    throw new ApiError('Сервер вернул не JSON')
  }
}

// ---- билеты ----

/** Ответ GET <ticketsApiUrl>?event=<id>. Формат согласуется с backend (см. README → «Виджет билетов»). */
export interface TicketType {
  id: string | number
  title: string
  description?: string
  price: number
  currency?: string
  available: boolean
  /** куда ведёт кнопка «Купить» (страница оплаты Django) */
  buyUrl: string
}

export interface TicketsResponse {
  items: TicketType[]
}

export function fetchTickets(apiUrl: string, eventId: string, signal?: AbortSignal) {
  return apiGet<TicketsResponse>(apiUrl, { event: eventId }, signal).then((data) => {
    if (!data || !Array.isArray(data.items)) throw new ApiError('Неожиданный формат ответа')
    return data.items
  })
}
