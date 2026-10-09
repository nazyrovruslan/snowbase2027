<template>
  <!-- подвал как на southhub.ru -->
  <div class="footer-area">
    <div class="about">
      <a href="https://median.agency" target="_blank" class="about-logo">
        <img src="~/assets/sh/median-logo.png" alt="median.agency" width="201" height="87" />
      </a>
      <span class="about-line" />
      <div class="about-btn-wrap">
        <a class="base-button" href="https://t.me/+F8Vk0GiQ_Mk1MDgy" target="_blank">связаться</a>
      </div>
      <p class="about-text">made by median.agency<br />Команда, которая мечтает. думает. делает.</p>
    </div>

    <footer class="footer">
      <div class="footer-line" />
      <div class="footer-info">
        <a href="https://southhub.ru/" target="_blank"><img src="~/assets/sh/footer-logo-black.svg" alt="South HUB" class="footer-logo" /></a>

        <div class="contacts">
          <p class="label">Контакты:</p>
          <div class="items"><span class="label">Email:</span><a href="mailto:mail@southhub.ru" class="link">mail@southhub.ru</a></div>
          <div class="items"><span class="label">Telegram:</span><a href="https://t.me/southhub_com" target="_blank" class="link">+7 862 29 59 977</a></div>
        </div>

        <div class="contacts contacts-second">
          <p class="label">ООО «Высокие люди»</p>
          <p class="label">ИНН 2320134913</p>
          <a href="https://lk.southhub.ru/confidential" target="_blank" class="label dashed">Политика конфиденциальности</a>
          <a href="https://lk.southhub.ru/cookies" target="_blank" class="label dashed">Политика обработки файлов cookie</a>
          <a href="https://lk.southhub.ru/pd" target="_blank" class="label dashed">Политика обработки персональных данных</a>
          <p class="label">© 2022-2026 South HUB. Все права защищены</p>
        </div>

        <div class="icons">
          <a href="https://www.youtube.com/@sthhb" target="_blank"><img src="~/assets/sh/youtube.svg" alt="YouTube" width="24" height="24" /></a>
          <a href="https://www.linkedin.com/company/south-hub/" target="_blank"><img src="~/assets/sh/linkedin.svg" alt="LinkedIn" width="24" height="24" /></a>
          <a href="https://t.me/+A-vMV8yq_6M3ZjFi" target="_blank"><img src="~/assets/sh/telegram.svg" alt="Telegram" width="24" height="24" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer-area { width: 1920px; background: #eaeaea; color: #111; }

/* median.agency */
.about { display: flex; align-items: center; gap: 24px; padding: 100px 60px; }
.about-logo { min-width: 200px; }
.about-line { flex: 1; height: 1px; background: #111; }
.about-btn-wrap { display: flex; justify-content: center; min-width: 211px; max-width: 211px; }
.about-text { min-width: 500px; max-width: 500px; font-size: 22px; font-weight: 400; line-height: 130%; white-space: nowrap; }

/* футер */
.footer { padding: 100px 60px 50px; }
.footer-line { height: 1px; background: rgba(17, 17, 17, .2); margin-bottom: 80px; }
.footer-info { display: flex; justify-content: space-between; align-items: end; }
.footer-logo { height: 22px; width: auto; }
.contacts { display: flex; flex-direction: column; gap: 6px; }
.contacts-second { gap: 2px; }
.items { display: flex; gap: 4px; }
.label, .link { font-size: 16px; font-weight: 400; line-height: 100%; }
.dashed { width: fit-content; border-bottom: 1px solid rgba(17, 17, 17, .5); }
.link:hover, .dashed:hover, .icons a:hover { opacity: .6; }
.icons { display: flex; align-items: center; gap: 30px; }
.icons a { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
</style>
