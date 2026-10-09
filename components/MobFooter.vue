<template>
  <!-- мобильный подвал: блок median.agency и футер -->
  <div class="footer-area">
    <div class="about">
      <a href="https://median.agency" target="_blank">
        <img src="~/assets/sh/median-logo.png" alt="median.agency" width="171" height="74" />
      </a>
      <p class="about-text">made by median.agency<br />Команда, которая мечтает.<br />думает. делает.</p>
      <a class="base-button contact" href="https://t.me/+F8Vk0GiQ_Mk1MDgy" target="_blank">связаться</a>
    </div>

    <span class="line" />

    <footer class="footer">
      <a href="https://southhub.ru/" target="_blank">
        <img src="~/assets/sh/footer-logo-black.svg" alt="South HUB" class="footer-logo" />
      </a>

      <div class="contacts">
        <p>Контакты:</p>
        <a href="mailto:mail@southhub.ru">Email: mail@southhub.ru</a>
        <a href="https://t.me/southhub_com" target="_blank">Telegram: +7 862 29 59 977</a>
      </div>

      <div class="legal">
        <p>ООО «Высокие люди»</p>
        <p>ИНН 2320134913</p>
        <a href="https://lk.southhub.ru/confidential" target="_blank" class="dashed">Политика конфиденциальности</a>
        <a href="https://lk.southhub.ru/cookies" target="_blank" class="dashed">Политика обработки файлов cookie</a>
        <a href="https://lk.southhub.ru/pd" target="_blank" class="dashed">Политика обработки персональных данных</a>
        <p>© 2022-2026 South HUB. Все права защищены</p>
      </div>

      <div class="icons">
        <a href="https://www.youtube.com/@sthhb" target="_blank" aria-label="YouTube"><img src="~/assets/sh/youtube.svg" alt="" width="24" height="24" /></a>
        <a href="https://www.linkedin.com/company/south-hub/" target="_blank" aria-label="LinkedIn"><img src="~/assets/sh/linkedin.svg" alt="" width="24" height="24" /></a>
        <a href="https://t.me/+A-vMV8yq_6M3ZjFi" target="_blank" aria-label="Telegram"><img src="~/assets/sh/telegram.svg" alt="" width="24" height="24" /></a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer-area { width: 390px; background: #eaeaea; color: #111; padding: 60px 16px 40px; font-weight: 300; }
.about { display: flex; flex-direction: column; align-items: flex-start; gap: 40px; }
.about-text { font-size: 20px; line-height: normal; margin-bottom: -20px; }
.contact { width: 150px; }
.contact:hover { width: 170px; }
.line { display: block; height: 1px; background: var(--grey); margin: 60px 0 70px; }
.footer { display: flex; flex-direction: column; gap: 40px; }
.footer-logo { width: 171px; height: auto; }
.contacts { display: flex; flex-direction: column; gap: 12px; font-size: 16px; line-height: normal; }
.legal { display: flex; flex-direction: column; font-size: 14px; line-height: normal; }
.dashed { width: fit-content; text-decoration: underline; text-underline-offset: 2px; }
.icons { display: flex; gap: 40px; }
.icons a { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
</style>
