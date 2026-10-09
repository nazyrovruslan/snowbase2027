<template>
  <section ref="hero" class="hero" :class="{ alt }">
    <img class="abs photo" src="~/assets/sb/hero.jpg" alt="" />
    <img class="abs photo photo-alt" src="~/assets/sb/hero-hover.webp" alt="" />

    <SbLogo class="logo" :src="logoUrl" />
    <button class="abs burger" aria-label="Меню" @click="menu = true">
      <img src="~/assets/mob/burger.svg" alt="" width="50" height="14" />
    </button>

    <!-- центральный блок: сдвигается вместе с высотой экрана -->
    <div class="abs mid">
    <h1 class="title">
      <span class="abs line" style="top: 137px; margin-left: -61px">Snow BASE</span>
      <span class="abs line" style="top: 188px; margin-left: -4px">Кэмп</span>
      <span class="abs line" style="top: 239px; margin-left: -7.5px">для C-level в AI</span>
    </h1>

    <div class="abs desc">
      <p>
        Красивое демо есть у многих. Бизнес-результат — не у каждого. На Snow BASE лидеры AI разбирают, что происходит
        между ними: деньги, технологии, команды и решения, которые пришлось переделать. Четыре дня в горах, чтобы говорить
        о том, что сработало и что осталось за кадром успешных кейсов.
      </p>
    </div>

    <a
      class="abs cta"
      href="https://lk.southhub.ru/"
      target="_blank"
    >Подать заявку</a>

    <div class="abs pill" style="left: 34px; width: 202px">
      <img src="~/assets/mob/calendar.svg" alt="" width="16" height="13" />25–28 февраля, 2027
    </div>
    <a class="abs pill pill-link" style="left: 256px; width: 100px" href="https://yandex.ru/maps/?ll=41.184666%2C43.539484&amp;z=16&amp;pt=41.184666%2C43.539484%2Cpm2rdm" aria-label="Архыз на карте" @click.prevent="map = true">
      <img src="~/assets/mob/pin.svg" alt="" width="13" height="16" />Aрхыз
    </a>
    </div>

    <a class="abs card" href="#" @click.prevent="video = true">
      <span class="thumb">
        <video ref="preview" class="thumb-img" src="~/assets/video/preview-2026.mp4" poster="~/assets/video/poster-2026.jpg" muted loop playsinline preload="none" aria-hidden="true" />
        <img class="play" src="~/assets/mob/play.svg" alt="" width="30" height="30" />
      </span>
      <span class="card-link">
        <span>Как прошёл<br />Snow BASE'2026</span>
        <img src="~/assets/sb/arrow.svg" alt="" width="10" height="10" />
      </span>
    </a>

    <!-- меню -->
    <Transition name="fade">
      <div v-if="menu" class="menu">
        <img class="abs photo" src="~/assets/sb/hero.jpg" alt="" />
        <div class="abs menu-bg" />
        <SbLogo class="logo" :src="logoUrl" @top="menu = false" />
        <button class="abs close" aria-label="Закрыть меню" @click="menu = false">
          <img src="~/assets/mob/close.svg" alt="" width="18" height="18" />
        </button>

        <a class="abs menu-item" style="top: 320px" href="https://southhub.ru/" target="_blank">South HUB'2027<img src="~/assets/mob/arrow-big.svg" alt="" width="18" height="18" /></a>
        <a class="abs menu-item" style="top: 441px" href="https://t.me/southhub_com" target="_blank">Задать вопрос<img src="~/assets/mob/arrow-big.svg" alt="" width="18" height="18" /></a>

        <div class="menu-bottom">
          <a class="cta-static" href="https://lk.southhub.ru/" target="_blank">Подать заявку</a>
          <div class="menu-row">
            <a class="login" href="https://lk.southhub.ru/accounts/login/" target="_blank">
              <img src="~/assets/mob/user-outline.svg" alt="" width="16" height="20" />Войти
            </a>
            <a class="corners tg" href="https://t.me/+Up2b6jqa30xhYzMy?utm_source=SB&utm_medium=landing&utm_campaign=invite" target="_blank" aria-label="Telegram">
              <i /><i /><i /><i />
              <img src="~/assets/sb/tg.svg" alt="" width="22" height="18" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import logoUrl from '~/assets/mob/logo.svg'
const video = useState('video', () => false)
const map = useState('map', () => false)
const preview = ref(null)
useAutoplayWhenVisible(preview)
const alt = ref(false)
const menu = ref(false)

// смена фото на закат после прокрутки 30% первого экрана
const hero = ref(null)
const onScroll = () => {
  const r = hero.value?.getBoundingClientRect()
  if (r) alt.value = -r.top >= r.height * 0.3
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(menu, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })
</script>

<style scoped>
/*
  Хиро на весь экран (всё в px макета 390).
  --vis — видимая высота экрана с панелями браузера (svh не меняется при прокрутке, поэтому ничего не «ездит»),
  но не меньше 724px: при меньшей высоте карточка наезжала бы на плашки даты/места — тогда она уходит ниже первого экрана.
  Высота хиро — lvh (панели спрятаны): фото заходит под полупрозрачную панель Safari.
*/
.hero {
  --vis: max(calc(100vh / var(--km, 1)), 724px);
  position: relative; width: 390px; height: var(--vis); overflow: hidden;
}
@supports (height: 100svh) {
  .hero {
    --vis: max(calc(100svh / var(--km, 1)), 724px);
    height: max(calc(100lvh / var(--km, 1)), var(--vis));
  }
}
.mid { left: 0; top: calc((var(--vis) - 844px) * 0.25); width: 390px; height: 844px; pointer-events: none; }
.mid > * { pointer-events: auto; }
.photo { pointer-events: none; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 15% bottom; transition: opacity .7s ease; }
.photo-alt { opacity: 0; }
.alt .photo-alt { opacity: 1; }

.logo { left: 16px; top: 60px; width: 171px; height: 37px; }
.burger, .close { background: none; border: 0; padding: 0; cursor: pointer; }
.burger { left: 324px; top: 63px; }

.title { font-weight: 400; }
.line { left: 50%; transform: translateX(-50%); font-size: 40px; line-height: normal; text-transform: uppercase; white-space: nowrap; }

.desc { left: 16px; top: 300px; width: 358px; font-size: 12px; line-height: 1.3; }

.cta, .cta-static {
  width: 358px; height: 50px; display: flex; align-items: center; justify-content: center;
  background: var(--black); color: var(--white); border: 1px solid var(--black); border-radius: 15px; font-size: 16px;
  transition: background .3s ease, color .3s ease;
}
.cta { left: 16px; top: 430px; }
.alt .cta { background: transparent; color: var(--black); }

.pill {
  top: 500px; height: 40px; display: flex; gap: 10px; align-items: center; padding: 0 20px 0 12px;
  background: rgba(255,255,255,.5); backdrop-filter: blur(10px); border-radius: 50px; font-size: 14px; white-space: nowrap;
}

.card {
  left: 16px; bottom: calc(100% - var(--vis) + 30px); width: 358px; display: flex; gap: 10px; align-items: center; padding: 10px;
  background: rgba(255,255,255,.5); backdrop-filter: blur(10px); border-radius: 15px;
}
.thumb { position: relative; width: 217px; height: 144px; display: flex; align-items: center; justify-content: center; border-radius: 10px; overflow: hidden; flex: none; }
.thumb-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.play { position: relative; }
.card-link { width: 111px; height: 144px; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; font-size: 14px; line-height: normal; }
.card-link span { align-self: flex-start; white-space: nowrap; }

/* меню */
.menu { position: fixed; top: 0; left: 0; z-index: 100; width: 390px; height: calc(100dvh / var(--km, 1)); min-height: 600px; overflow: hidden; }
.menu-bg { inset: 0; background: rgba(255,255,255,.5); backdrop-filter: blur(10px); }
.close { left: 340px; top: 61px; width: 18px; height: 18px; }
.menu-item { left: 16px; width: 358px; display: flex; align-items: center; justify-content: space-between; font-size: 24px; line-height: normal; }
.menu-bottom { position: absolute; left: 16px; right: 16px; bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.menu-row { display: flex; gap: 20px; align-items: center; }
.login { height: 50px; display: flex; gap: 10px; align-items: center; padding: 0 20px 0 15px; border: 1px solid var(--black); border-radius: 15px; font-size: 16px; }
.tg { width: 50px; height: 50px; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
