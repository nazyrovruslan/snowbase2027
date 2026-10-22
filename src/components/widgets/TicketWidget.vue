<template>
  <!-- Блок продажи билетов. При SSG рендерится только оболочка (состояние «загрузка»), данные приходят из API Django
       уже в браузере. Ошибка API показывается внутри блока и не влияет на остальную страницу. -->
  <section v-show="enabled" id="tickets" class="tickets" aria-labelledby="tickets-title" :aria-busy="state === 'loading'">
    <h2 id="tickets-title" class="tickets-title">Билеты</h2>

    <div v-if="state === 'loading'" class="tickets-status" role="status">
      <span class="spinner" aria-hidden="true" />Загружаем билеты…
    </div>

    <div v-else-if="state === 'error'" class="tickets-status" role="alert">
      <p>Не удалось загрузить билеты. {{ error }}</p>
      <button type="button" class="base-button retry" @click="load">повторить</button>
    </div>

    <p v-else-if="state === 'empty'" class="tickets-status">Билетов пока нет в продаже.</p>

    <ul v-else class="tickets-list">
      <li v-for="t in items" :key="t.id" class="ticket" :class="{ 'is-sold': !t.available }">
        <div class="ticket-info">
          <h3 class="ticket-name">{{ t.title }}</h3>
          <p v-if="t.description" class="ticket-desc">{{ t.description }}</p>
        </div>
        <p class="ticket-price">{{ formatPrice(t.price, t.currency) }}</p>
        <a v-if="t.available" class="base-button buy" :href="t.buyUrl">купить</a>
        <span v-else class="sold">распроданы</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { fetchTickets, type TicketType } from '@/services/api'

const props = defineProps<{
  /** ID события в Django; пустая строка — блок не загружается */
  eventId: string
  /** адрес API того же домена, например /api/tickets/ */
  apiUrl: string
  enabled: boolean
}>()

type State = 'loading' | 'error' | 'empty' | 'ready'
// первое состояние одинаково при SSG и при гидратации, поэтому расхождений нет
const state = ref<State>('loading')
const items = ref<TicketType[]>([])
const error = ref('')
let ctrl: AbortController | undefined
let mounted = false

async function load() {
  if (!mounted || !props.enabled || !props.eventId) return
  ctrl?.abort()
  ctrl = new AbortController()
  state.value = 'loading'
  try {
    items.value = await fetchTickets(props.apiUrl, props.eventId, ctrl.signal)
    state.value = items.value.length ? 'ready' : 'empty'
  } catch (e) {
    if ((e as Error).name === 'AbortError') return
    error.value = (e as Error).message
    state.value = 'error'
    console.warn('TicketWidget:', e)
  }
}

const formatPrice = (price: number, currency = 'RUB') =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)

onMounted(() => { mounted = true; load() })
// настройки из CMS применяются после монтирования — тогда же и стартует загрузка
watch(() => [props.enabled, props.eventId, props.apiUrl], load)
onBeforeUnmount(() => ctrl?.abort())
</script>

<style scoped>
.tickets { padding: 80px max(16px, calc(100vw / 1920 * 40)); background: var(--light); font-family: var(--font); }
.tickets-title { font-size: 40px; font-weight: 400; line-height: normal; text-transform: uppercase; margin-bottom: 40px; }
.tickets-status { display: flex; align-items: center; gap: 16px; min-height: 50px; font-size: 16px; font-weight: 300; }
.retry { --btn-w: 150px; border: 0; cursor: pointer; font-family: inherit; }
.spinner { width: 20px; height: 20px; border: 1px solid var(--grey); border-top-color: var(--black); border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
.tickets-list { list-style: none; display: grid; gap: 10px; }
.ticket {
  display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 40px;
  padding: 20px 20px 20px 30px; border-radius: 15px; background: #fff;
}
.ticket-name { font-size: 20px; font-weight: 400; }
.ticket-desc { margin-top: 6px; font-size: 14px; font-weight: 300; line-height: 1.3; }
.ticket-price { font-size: 20px; white-space: nowrap; }
.buy { --btn-w: 150px; }
.sold { width: 150px; text-align: center; font-size: 16px; font-weight: 300; color: #777; }
.is-sold { opacity: .6; }
@media (max-width: 767px) {
  .tickets { padding: 60px 16px; }
  .tickets-title { font-size: 28px; margin-bottom: 24px; }
  .ticket { grid-template-columns: 1fr auto; gap: 16px 20px; padding: 16px; }
  .ticket-info { grid-column: 1 / -1; }
}
</style>
