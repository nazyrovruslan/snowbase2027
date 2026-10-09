# Snow BASE — прототип лендинга

Прототип десктопной версии лендинга Snow BASE 2027 (макет «Snow BASE DESC» в Figma, страница «Анонс SB 2027»).
Стек: Nuxt 3 + Vue 3, без UI-библиотек.

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm run dev
```

Откроется на http://localhost:3000.

## Как устроено

- Страница свёрстана в ширину 1920px, как в макете, и масштабируется под ширину окна через CSS `zoom` (`app.vue`). Мобильной версии пока нет.
- `components/SbHero.vue` — первый экран. При наведении на «Подать заявку» фото меняется на закат, кнопка становится контурной, меняется текст описания.
- `components/SbPattern.vue` — блок с буквами U, как на southhub.ru: буквы увеличиваются возле курсора.
- `components/SbFooter.vue` — блок median.agency и футер, перенесены с southhub.ru.
- `public/fonts` — шрифт Mont (Book, ExtraLight), лицензия South HUB. Не публиковать в открытом доступе.
