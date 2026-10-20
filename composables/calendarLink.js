// плашка с датой открывает создание события в Google Календаре (весь день, конец не включается)
export const calendarLink = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE',
  text: 'Snow BASE 2027',
  dates: '20270225/20270301',
  location: 'Горная улица, 45, село Архыз, Карачаево-Черкесская Республика',
  details: 'Snow BASE — кэмп для C-level в AI. https://southhub.ru/snowbase/',
}).toString()
