<template>
  <section class="hero" :class="{ alt }">
    <!-- фото: основное и закат (появляется при наведении на «Подать заявку») -->
    <img class="abs photo" src="~/assets/sb/hero.jpg" alt="" />
    <img class="abs photo photo-alt" src="~/assets/sb/hero-hover.webp" alt="" />

    <!-- навигация -->
    <img class="abs logo" src="~/assets/sb/logo.svg" alt="Snow BASE by South HUB" />
    <span class="abs menu" style="left: 1125px">South HUB'2027</span>
    <a class="abs menu link" style="left: 1273px" href="https://t.me/southhub_com" target="_blank">Задать вопрос</a>
    <a class="abs login" href="https://lk.southhub.ru/accounts/login/" target="_blank">
      <img src="~/assets/sb/user.svg" alt="" width="16" height="20" />Войти
    </a>
    <a class="abs corners tg" href="https://t.me/+Up2b6jqa30xhYzMy?utm_source=SB&utm_medium=landing&utm_campaign=invite" target="_blank" aria-label="Telegram">
      <i /><i /><i /><i />
      <img src="~/assets/sb/tg.svg" alt="" width="22" height="18" />
    </a>

    <!-- заголовок -->
    <!-- центральный блок: центрируется по высоте экрана -->
    <div class="abs mid">
    <h1>
      <span class="abs h1" style="left: 40px; top: 300px">Snow BASE</span>
      <span class="abs h1" style="left: 457px; top: 453px">Кэмп для C-level в AI</span>
    </h1>

    <div class="abs desc">
      <p class="t t-main">
        Красивое демо есть у многих. Бизнес-результат — не у каждого. На Snow BASE лидеры AI разбирают,
        что происходит между ними: деньги, технологии, команды и решения, которые пришлось переделать.
        Четыре дня в горах, чтобы говорить о том, что сработало и что осталось за кадром успешных кейсов.
      </p>
      <p class="t t-alt">
        Четыре дня руководители DS, ML, AI, CDO, CTO и CPO из бигтеха вместе разбирают управленческие задачи,
        проектируют AI-системы, сравнивают подходы и продолжают разговоры даже на склонах. Snow BASE соединяет
        рабочий кэмп, профессиональное сообщество и горы в одной программе.
      </p>
    </div>

    <a
      class="abs cta"
      href="https://lk.southhub.ru/"
      target="_blank"
      @mouseenter="alt = true"
      @mouseleave="alt = false"
      @focus="alt = true"
      @blur="alt = false"
    >Подать заявку</a>

    <div class="abs pill" style="left: 1125px">
      <img src="~/assets/sb/calendar.svg" alt="" width="19" height="16" />25–28 февраля, 2027
    </div>
    <div class="abs pill" style="left: 1371px">
      <img src="~/assets/sb/pin.svg" alt="" width="17" height="20" />Aрхыз
    </div>
    </div>

    <a class="abs card" href="#" @click.prevent="video = true">
      <span class="thumb">
        <video ref="preview" class="thumb-img" src="~/assets/video/preview-2026.mp4" poster="~/assets/video/poster-2026.jpg" muted loop playsinline preload="none" aria-hidden="true" />
        <img class="play" src="~/assets/sb/play.svg" alt="" width="30" height="30" />
      </span>
      <span class="card-title">Как прошёл Snow BASE'2026</span>
      <img src="~/assets/sb/arrow.svg" alt="" width="10" height="10" class="card-arrow" />
    </a>

  </section>
</template>

<script setup>
const alt = ref(false)
const video = useState("video", () => false)
const preview = ref(null)
useAutoplayWhenVisible(preview)
</script>

<style scoped>
/* хиро на весь экран: высота окна в px макета, не меньше 860 */
.hero { position: relative; width: 1920px; height: calc(100dvh / var(--k, 1)); min-height: 860px; overflow: hidden; }
.mid { left: 0; top: calc((100% - 996px) * 0.5); width: 1920px; height: 996px; pointer-events: none; }
.mid > * { pointer-events: auto; }
.photo { inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; transition: opacity .7s ease, transform 1.4s ease; }
.photo-alt { object-fit: cover; opacity: 0; transform: scale(1.03); }
.alt .photo-alt { opacity: 1; transform: scale(1); }

.logo { left: 40px; top: 33px; width: 202px; height: 44px; }
.menu { top: 46px; font-size: 14px; }
.link:hover { opacity: .6; }
.login {
  left: 1700px; top: 30px; height: 50px; display: flex; gap: 10px; align-items: center;
  padding: 0 20px 0 15px; background: var(--black); color: var(--white); border-radius: 15px; font-size: 16px;
  transition: opacity .2s;
}
.login:hover { opacity: .8; }
.tg { left: 1830px; top: 30px; width: 50px; height: 50px; }

h1 { font-weight: 400; }
.h1 { font-size: 120px; line-height: normal; text-transform: uppercase; white-space: nowrap; }

.desc { left: 1125px; top: 323px; width: 755px; font-size: 14px; line-height: normal; }
.t { transition: opacity .5s ease; }
.t-alt { position: absolute; inset: 0; opacity: 0; }
.alt .t-main { opacity: 0; }
.alt .t-alt { opacity: 1; }

.cta {
  left: 457px; top: 646px; width: 338px; height: 50px; display: flex; align-items: center; justify-content: center;
  background: var(--black); color: var(--white); border: 1px solid var(--black); border-radius: 15px; font-size: 16px;
  transition: background .3s ease, color .3s ease;
}
.cta:hover, .cta:focus-visible { background: transparent; color: var(--black); outline: none; }

.pill {
  top: 651px; height: 40px; display: flex; gap: 10px; align-items: center; padding: 0 20px 0 12px;
  background: rgba(255,255,255,.5); backdrop-filter: blur(10px); border-radius: 50px; font-size: 16px; white-space: nowrap;
}

.card {
  left: 1125px; bottom: 40px; width: 755px; display: flex; align-items: center; justify-content: space-between;
  padding: 10px 20px 10px 10px; background: rgba(255,255,255,.5); backdrop-filter: blur(10px); border-radius: 15px;
  transition: background .3s ease;
}
.card:hover { background: rgba(255,255,255,.75); }
.thumb { position: relative; width: 388px; height: 160px; display: flex; align-items: center; justify-content: center; border-radius: 10px; overflow: hidden; }
.thumb-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
.card:hover .thumb-img { transform: scale(1.05); }
.play { position: relative; }
.card-title { font-size: 20px; white-space: nowrap; }
.card-arrow { transition: transform .3s ease; }
.card:hover .card-arrow { transform: translate(3px, -3px); }

</style>
