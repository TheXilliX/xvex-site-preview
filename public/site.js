const main = document.querySelector('#main');
const path = location.pathname;
if (path === "/") document.body.classList.add("home-page");
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const accountLink = document.querySelector('#account-link');
const code = new URLSearchParams(location.search).get('code') ?? '';
const validCode = /^[A-F0-9]{10}$/.test(code);
const connectPath = '/connect?code=' + encodeURIComponent(code);
const accountPath = validCode ? connectPath : '/account';

menu.onclick = () => menu.setAttribute('aria-expanded', String(nav.classList.toggle('open')));

const screenshot = (name, label) => `<div role="img" class="product app-screenshot ${name}-screenshot" aria-label="${label}"></div>`;
const homeScreenshot = screenshot('home', 'Главная X.Vex с виджетами');
const dashboard = screenshot('dashboard', 'Главная X.Vex с задачами, календарём и избранным');
const note = screenshot('note', 'Заметка со списком идей и задач для прогулки');
const board = screenshot('board', 'Доска с рисунками и стрелками между остановками прогулки');
const kanban = screenshot('kanban', 'Канбан с колонками «В процессе» и «Выполнены»');
const communityUrl = 'https://t.me/XVexAPP';
const supportUrl = 'https://t.me/XVex_Support';
const releasesUrl = 'https://github.com/TheXilliX/xvex-updates/releases';

const tools = {
  note: ['Заметки', 'Записывай мысли и материалы для проектов. Используй заголовки, списки и чекбоксы, чтобы структурировать записи.', note],
  board: ['Доски', 'Раскладывай идеи на свободном холсте. Добавляй картинки, рисуй и связывай элементы стрелками.', board],
  kanban: ['Канбан', 'Видишь следующий шаг — легче начать. Собери задачи в карточки и перемещай их от планов к результату.', kanban],
  dashboard: ['Виджеты', 'Добавь на главную заметки, колонки канбана и быстрый доступ к материалам. Расставь виджеты и выбери размер каждого под свой рабочий день.', dashboard],
};
function toolPreview(name) {
  const [title, description, preview] = tools[name];
  return `<div class="tool-image">${preview}</div><div class="tool-description"><h3>${title}</h3><p>${description}</p></div>`;
}

function intro(title, description) {
  return `<header class="page-intro"><h1>${title}</h1><p>${description}</p></header>`;
}

function home() {
  const footer = document.querySelector('.site-footer');
  footer.classList.add('home-footer');
  footer.innerHTML = `<p class="footer-note">Место для мыслей.<br>Пространство для действий.</p>
    <nav aria-label="Ссылки в подвале">
      <div><strong>Приложение</strong><a href="/sync">Синхронизация</a><a href="/download">Скачать X.Vex</a></div>
      <div><strong>Ресурсы</strong><a href="/help">Справка</a><a href="${supportUrl}">Поддержка</a><a href="${releasesUrl}">История обновлений</a></div>
      <div><strong>Сообщество</strong><a href="${communityUrl}">Telegram</a></div>
    </nav>`;
  return `<section class="hero"><h1>Для идей, планов<br>и тараканов в голове.</h1>
    <p>Заметки, доски и канбан — в одном спокойном пространстве.</p>
    <a class="button" href="/download">Скачать X.Vex</a></section>
    <div class="hero-product">
      ${homeScreenshot}
      <figure class="hero-phone" aria-label="Главная X.Vex на телефоне">
        <div class="hero-phone-frame">${screenshot('mobile-home', 'Мобильная главная X.Vex с виджетами')}</div>
      </figure>
    </div>
    <ul class="home-principles">
      <li><h2>Твоё хранилище — рядом</h2><p>Выбери папку для хранилища. Заметки, доски и задачи останутся на твоём устройстве.</p></li>
      <li><h2>Работай без интернета</h2><p>Открывай и редактируй заметки, доски и задачи офлайн.</p></li>
      <li><h2>Важное — на главной</h2><p>Собери рабочий экран из заметок, колонок канбана и быстрых ссылок. Нужные материалы всегда под рукой.</p></li>
    </ul>
    <section class="home-example" aria-labelledby="tools-title">
      <span class="eyebrow">От первой мысли до готового дела</span><h2 id="tools-title">Дай идеям форму.</h2><p class="section-lead">Запиши мысль, разложи её на доске и преврати в конкретные шаги.</p>
      <div class="tool-tabs" role="group" aria-label="Выбрать инструмент"><button type="button" data-tool="note" aria-pressed="true">Заметки</button><button type="button" data-tool="board" aria-pressed="false">Доски</button><button type="button" data-tool="kanban" aria-pressed="false">Канбан</button><button type="button" data-tool="dashboard" aria-pressed="false">Виджеты</button></div><div id="tool-preview">${toolPreview('note')}</div>
    </section>
    <section class="home-sync" aria-labelledby="sync-title">
      <h2 id="sync-title">Синхронизация между устройствами</h2>
      <p>Начни мысль на компьютере, продолжи на телефоне. Подключай хранилища через аккаунт X.Vex Sync, сохраняя доступ к локальным материалам без интернета.</p>
      <a class="button secondary" href="/sync">Подробнее о синхронизации</a>
    </section>
    <section class="home-download" aria-labelledby="download-title">
      <h2 id="download-title">Меньше искать. Больше создавать.</h2>
      <a class="button" href="/download">Скачать X.Vex</a>
    </section>
    <section class="home-community" aria-labelledby="community-title">
      <h2 id="community-title">Сообщество и помощь</h2>
      <div>
        <a href="${communityUrl}"><strong>Telegram</strong><span>Новости X.Vex и связь с сообществом.</span></a>
        <a href="${supportUrl}"><strong>Поддержка</strong><span>Вопросы и сообщения об ошибках в Telegram.</span></a>
        <a href="/help"><strong>Справка</strong><span>Установка, обновления и вход в приложение.</span></a>
        <a href="${releasesUrl}"><strong>История обновлений</strong><span>Версии и изменения приложения.</span></a>
      </div>
    </section>`;
}

function sync() {
  return `<header class="page-intro"><h1>Твои идеи. На твоих устройствах.</h1></header><div class="sync-details narrow">
    <section>
      <h2>Одно хранилище на нескольких устройствах</h2>
      <p>Войдите в один аккаунт на всех устройствах. В «Настройки → Синхронизация» укажите одинаковое имя облачного хранилища.</p>
      <p>Сначала синхронизируйте устройство с материалами. На втором устройстве выберите пустое локальное хранилище и нажмите «Синхронизировать».</p>
      <p>Заметки, доски, Kanban и папки сохраняются локально. Обмен отдельными файлами вложений и настройками хранилища пока недоступен.</p>
      <a href="/account">Проверить доступ в аккаунте</a>
    </section>
    <section id="pricing">
      <h2>Подключение сервиса</h2>
      <p>Для подключения нужен настроенный сервер X.Vex Sync. Публичный сайт GitHub Pages показывает интерфейс, но не обслуживает аккаунты и синхронизацию.</p>
    </section>
  </div>`;
}

function download() {
  return `<header class="download-hero"><span class="brand-mark" aria-hidden="true"></span><h1>X.Vex</h1><p>Твоё пространство для идей и дел.</p><a class="button" href="https://github.com/TheXilliX/xvex-updates/releases/download/v0.1.21/X.Vex_0.1.21_x64-setup.exe" id="primary-download">Скачать для Windows</a><small>Windows x64 · версия 0.1.21</small></header><div class="platforms narrow"><h2>Все платформы</h2>
    <section class="platform"><div><strong>Windows</strong><small id="windows-version">Windows x64 · установщик</small></div><a id="windows-download" class="button" href="https://github.com/TheXilliX/xvex-updates/releases/download/v0.1.21/X.Vex_0.1.21_x64-setup.exe">Скачать для Windows</a></section>
    <section class="platform"><div><strong>Android</strong><small>ARM64 · версия 0.1.21</small><div class="channels"><span>Google Play — не опубликовано</span><span>RuStore — не опубликовано</span></div></div><a id="android-download" class="button secondary" href="https://github.com/TheXilliX/xvex-updates/releases/download/v0.1.21/X.Vex-0.1.21-Android-arm64.apk">Скачать APK</a></section>
    <section class="platform"><div><strong>iPhone и iPad</strong><div class="channels">App Store</div></div><small>Скоро</small></section>
    <section class="platform"><div><strong>macOS</strong><div class="channels">Mac App Store</div></div><small>Скоро</small></section>
    <section class="platform"><div><strong>Linux</strong></div><small>Скоро</small></section>
    <div class="help-links"><a href="https://github.com/TheXilliX/xvex-updates/releases">История обновлений</a><a href="/help#install">Установка</a></div>
  </div>`;
}

function helpShot(name, caption, themed = true) {
  const variants = themed ? ['-light', '-dark'] : [''];
  return `<figure class="help-shot">${variants.map(variant => {
    const src = `/assets/help-${name}${variant}.jpg`;
    return `<div class="help-image${variant}"><img src="${src}" alt="${caption}" loading="lazy" decoding="async" draggable="false"></div>`;
  }).join('')}<figcaption>${caption}</figcaption></figure>`;
}

function help() {
  return intro('Чем помочь?', 'Справка по X.Vex.') + `<section class="narrow faq">
    <label class="help-search"><svg width="19" height="19" aria-hidden="true"><use href="/assets/icons.svg#search"></use></svg><input id="help-search" type="search" aria-label="Поиск по справке" placeholder="Поиск по справке"></label>
    <p id="no-results" class="muted" hidden>Ничего не найдено.</p>
    <details id="install"><summary>Как установить X.Vex?</summary>
      <ol>
        <li>Скачай установщик Windows x64 на <a href="/download">странице скачивания</a> и запусти его.</li>
        <li>Нажми «Далее» и следуй указаниям мастера.
          ${helpShot('installer', 'Приветственный экран установщика X.Vex', false)}
        </li>
        <li>Открой X.Vex. В окне «Хранилища» нажми «Создать» для нового хранилища или «Открыть», если папка уже есть.
          ${helpShot('vaults', 'В окне «Хранилища» можно создать хранилище или открыть существующую папку')}
        </li>
      </ol>
    </details>
    <details id="open-folder"><summary>Как открыть папку как хранилище?</summary>
      <ol>
        <li>Открой «Настройки → Хранилище» и нажми «Выбрать папку».
          ${helpShot('open-folder', 'Кнопка «Выбрать папку» в настройках хранилища')}
        </li>
        <li>Выдели нужную папку в диалоге Windows и нажми «Выбор папки». X.Vex подключит её как хранилище.
          ${helpShot('folder-picker', 'Тестовое хранилище выбрано в диалоге Windows', false)}
        </li>
      </ol>
    </details>
    <details id="updates"><summary>Как проверить обновления?</summary>
      <ol>
        <li>Открой «Настройки → Общие». Рядом с текущей версией нажми «Проверить обновления».
          ${helpShot('updates', 'Текущая версия и кнопка «Проверить обновления»')}
        </li>
        <li>Если доступна новая версия, нажми «Установить обновление» и подтверди установку. Приложение перезапустится.</li>
      </ol>
    </details>
    <details id="restore"><summary>Как восстановить удалённую заметку?</summary>
      <ol>
        <li>Открой «Настройки → Корзина». Чтобы будущие удаления попадали сюда, выбери «Перемещать в корзину X.Vex».
          ${helpShot('trash', 'Режим удаления «Перемещать в корзину X.Vex»')}
        </li>
        <li>Найди заметку в списке и нажми «Восстановить». Если при удалении использовалась системная корзина, ищи файл в корзине Windows.
          ${helpShot('restore', 'Заметка «Черновик проекта» с кнопкой «Восстановить»')}
        </li>
      </ol>
    </details>
    <details><summary>Как работает синхронизация?</summary><p>X.Vex хранит материалы локально. Участники тестирования могут отправлять и получать материалы в настройках синхронизации.</p></details>
    <details><summary>Как войти в приложении?</summary><p>Открой «Настройки → Аккаунт», войди в браузере и подтверди код, который показан в X.Vex.</p></details>
    <div class="help-links"><a href="${supportUrl}">Написать в поддержку X.Vex</a><a href="${communityUrl}">Сообщество X.Vex в Telegram</a></div>
  </section>`;
}

let account;
let email;
async function api(route, body) {
  const response = await fetch('/api/' + route, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error);
  return value;
}

function passwordField(name, label, autocomplete, hint = '') {
  return `<div class="password-field">
    <label for="auth-${name}">${label}</label>
    <div class="password-control">
      <input id="auth-${name}" type="password" name="${name}" minlength="8" maxlength="128" required autocomplete="${autocomplete}"${hint ? ' aria-describedby="password-hint"' : ''}>
      <button class="password-toggle" type="button" aria-controls="auth-${name}" aria-label="Показать пароль" title="Показать пароль">
        <svg width="19" height="19" aria-hidden="true"><use href="/assets/icons.svg#eye"></use></svg>
      </button>
    </div>
    ${hint ? `<small id="password-hint" class="muted">${hint}</small>` : ''}
  </div>`;
}

function hasSyncAccess(entry) {
  return entry.syncGrantedAt !== null && (entry.syncExpiresAt === null || entry.syncExpiresAt > Date.now());
}

function syncExpiration(entry) {
  return entry.syncExpiresAt === null ? 'бессрочно' : 'до ' + new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium', timeStyle: 'short',
  }).format(entry.syncExpiresAt);
}

function durationFields() {
  return `<div class="duration-fields"><label class="forever-control"><span>Навсегда</span><input type="checkbox" role="switch" name="forever" aria-label="Бессрочный доступ"></label><div class="duration-inputs"><label>Срок доступа<input name="amount" type="number" min="1" max="365" value="30" step="1" required></label><label>Единица<select name="unit"><option value="days">Дни · 1–365</option><option value="hours">Часы · 1–24</option></select></label></div></div>`;
}
function bindDuration(form) {
  const update = () => {
    const forever = form.elements.forever.checked;
    form.elements.amount.disabled = forever;
    form.elements.unit.disabled = forever;
    form.elements.amount.max = form.elements.unit.value === 'hours' ? 24 : 365;
    if (+form.elements.amount.value > +form.elements.amount.max) form.elements.amount.value = form.elements.amount.max;
  };
  form.elements.forever.onchange = update;
  form.elements.unit.onchange = update;
  form.addEventListener('reset', () => setTimeout(update));
  update();
}
const durationBody = form => ({ forever:form.elements.forever.checked, amount:Number(form.elements.amount.value), unit:form.elements.unit.value });

function showProfile() {
  main.classList.add('profile-page');
  main.innerHTML = `<section class="account-box profile-box">
    <div class="profile-heading">
      <div class="profile-identity"><span class="profile-avatar" aria-hidden="true"></span><div><h1>Твой аккаунт</h1><p class="muted">Профиль и доступ к X.Vex.</p></div></div>
      <button class="button secondary" id="logout" type="button">Выйти</button>
    </div>
    <p class="profile-status" role="status"></p>
    <div class="profile-grid"><section class="profile-card">
      <header><h2>Личные данные</h2><span class="profile-badge${account.emailConfirmed ? ' is-active' : ''}">${account.emailConfirmed ? 'Почта подтверждена' : 'Нужно подтверждение'}</span></header>
      <div class="profile-email-row"><span class="muted">Электронная почта</span><strong id="account-email"></strong></div>
      ${account.emailConfirmed ? '<p class="profile-detail">Адрес подтверждён. Его можно использовать для восстановления доступа.</p>' : '<p class="profile-detail">Подтверди почту, чтобы можно было восстановить доступ к аккаунту.</p><button class="button secondary" id="confirm-email" type="button">Получить ссылку</button><p class="profile-local-help">В локальной версии письмо сохраняется на компьютере с сервером.</p>'}
    </section>
    <section class="profile-card profile-sync-card">
      <header><h2>X.Vex Sync</h2><span class="profile-badge${hasSyncAccess(account) ? ' is-active' : ''}">${hasSyncAccess(account) ? 'Доступ открыт' : 'Не подключено'}</span></header>
      <p class="profile-sync-summary">${hasSyncAccess(account) ? 'Доступ выдан администратором · ' + syncExpiration(account) : 'Доступ включается отдельно'}</p>
      <p class="profile-detail">${hasSyncAccess(account) ? 'Войди в этот аккаунт в приложении и открой настройки синхронизации.' : 'Аккаунт уже работает. Когда перейдём к синхронизации, администратор сможет открыть доступ к Sync.'}</p>
      <form class="promo-redeem"><label>Есть промокод?<input name="code" placeholder="Введи промокод" maxlength="40" required autocomplete="off"></label><button class="button secondary" type="submit">Активировать</button><p role="status"></p></form>
      <a class="profile-text-link" href="/sync">О синхронизации <span aria-hidden="true">↗</span></a>
    </section></div>
    ${account.admin ? '<a class="profile-admin-link" href="/admin">Открыть админ-панель <span aria-hidden="true">→</span></a>' : ''}
  </section>`;
  main.querySelector('#account-email').textContent = email;
  main.querySelector('.profile-avatar').textContent = email.slice(0, 1).toLocaleUpperCase();
  const promoForm = main.querySelector('.promo-redeem');
  promoForm.onsubmit = event => {
    event.preventDefault();
    void run(event.submitter, async () => {
      Object.assign(account, await api('promo/redeem', { code:promoForm.elements.code.value }));
      showProfile();
      main.querySelector('.profile-status').textContent = 'Промокод активирован. Доступ к Sync открыт.';
    }, promoForm.querySelector('[role=status]'));
  };
  const confirm = main.querySelector('#confirm-email');
  if (confirm) confirm.onclick = () => run(confirm, async () => {
    await api('email/request', {});
    return 'Ссылка создана. Письмо сохранено в локальной папке писем сервера.';
  });
  const logout = main.querySelector('#logout');
  logout.onclick = () => run(logout, async () => {
    await api('logout', {});
    location.assign('/login');
  });
}

async function showAdmin() {
  main.classList.add('admin-page');
  main.innerHTML = `<header class="admin-heading"><span class="profile-avatar" aria-hidden="true">✦</span><div><h1>Админ-панель</h1><p class="muted">Аккаунты, доступ к Sync и промокоды.</p></div></header>`;
  if (!account?.admin) {
    main.insertAdjacentHTML('beforeend', email
      ? '<p class="page-intro">Эта страница доступна администратору.</p>'
      : '<p class="page-intro"><a href="/login">Войти в аккаунт администратора</a></p>');
    return;
  }
  main.insertAdjacentHTML('beforeend', `<section class="admin-accounts admin-card"><header><h2>Аккаунты</h2><p class="muted">Управляй доступом к синхронизации.</p></header>
    <label>Поиск по имени или почте<input type="search" id="admin-search"></label>
    <p role="status">Загружаем аккаунты…</p>
    <ul aria-label="Аккаунты"></ul>
  </section><section class="admin-card admin-promos"><header><h2>Промокоды</h2><p class="muted">Срок начинается с активации. Один аккаунт может применить каждый код один раз.</p></header><form id="promo-create"><div class="promo-basics"><label>Промокод<input name="code" placeholder="Например, XVEX-START" minlength="4" maxlength="40" pattern="[A-Za-z0-9][A-Za-z0-9_-]{3,39}" required autocomplete="off"></label><label>Число активаций<input name="maxUses" type="number" min="1" max="100000" step="1" value="1" required></label></div>${durationFields()}<button class="button" type="submit">Создать промокод</button><p role="status"></p></form><ul class="promo-list" aria-label="Промокоды"></ul></section>
  <dialog class="sync-grant-dialog" aria-labelledby="sync-grant-title">
    <form>
      <h2 id="sync-grant-title">Выдать доступ к Sync</h2>
      <p class="muted" data-grant-email></p>
      ${durationFields()}
      <p role="status"></p>
      <div class="profile-actions">
        <button class="button secondary" type="button" data-grant-cancel>Отмена</button>
        <button class="button" type="submit">Выдать доступ</button>
      </div>
    </form>
  </dialog>`);
  const search = main.querySelector('#admin-search');
  const status = main.querySelector('.admin-accounts [role=status]');
  const dialog = main.querySelector('.sync-grant-dialog');
  const grantForm = dialog.querySelector('form');
  bindDuration(grantForm);
  const promoCreate = main.querySelector('#promo-create');
  bindDuration(promoCreate);
  const promoStatus = promoCreate.querySelector('[role=status]');
  const loadPromos = async () => {
    const { promos } = await api('admin/promos');
    const list = main.querySelector('.promo-list');
    list.replaceChildren();
    if (!promos.length) { list.innerHTML = '<li class="muted">Промокодов пока нет. Создай первый выше.</li>'; return; }
    for (const promo of promos) {
      const row = document.createElement('li');
      row.innerHTML = '<div><strong></strong><span class="muted"></span></div><button class="button secondary" type="button">Отключить</button>';
      row.querySelector('strong').textContent = promo.code;
      row.querySelector('span').textContent = `${promo.duration_hours === null ? 'Навсегда' : promo.duration_hours % 24 === 0 ? promo.duration_hours / 24 + ' дн.' : promo.duration_hours + ' ч.'} · Активации: ${promo.uses} / ${promo.max_uses}${promo.disabled ? ' · Отключён' : ''}`;
      const button = row.querySelector('button');
      button.disabled = !!promo.disabled;
      button.onclick = () => run(button, async () => { await api('admin/promos/disable',{ id:promo.id }); await loadPromos(); return 'Промокод отключён. Выданный доступ сохранён.'; },promoStatus);
      list.append(row);
    }
  };
  promoCreate.onsubmit = event => {
    event.preventDefault();
    void run(event.submitter, async () => {
      await api('admin/promos',{ code:promoCreate.elements.code.value, maxUses:Number(promoCreate.elements.maxUses.value), ...durationBody(promoCreate) });
      promoCreate.reset(); await loadPromos(); return 'Промокод создан.';
    },promoStatus);
  };
  void loadPromos().catch(error => { promoStatus.textContent = error.message; });
  const grantStatus = dialog.querySelector('[role=status]');
  const cancelGrant = dialog.querySelector('[data-grant-cancel]');
  cancelGrant.onclick = () => dialog.close();
  dialog.oncancel = event => {
    if (cancelGrant.disabled) event.preventDefault();
  };
  try {
    const { accounts } = await api('admin/accounts');
    const list = main.querySelector('.admin-accounts ul');
    const rows = accounts.map(entry => {
      const row = document.createElement('li');
      row.innerHTML = `<div><strong></strong><span class="muted admin-email"></span><span class="muted admin-access"></span></div>
        <button class="button secondary" type="button"></button>`;
      row.querySelector('strong').textContent = entry.name || entry.email;
      if (entry.name) row.querySelector('.admin-email').textContent = entry.email;
      const access = row.querySelector('.admin-access');
      const button = row.querySelector('button');
      const paint = () => {
        const enabled = hasSyncAccess(entry);
        access.textContent = (enabled ? 'Доступ к Sync · ' + syncExpiration(entry) : 'Без доступа к Sync') + (entry.admin ? ' · Администратор' : '');
        button.textContent = enabled ? 'Отозвать доступ' : 'Выдать доступ';
        button.setAttribute('aria-label', `${button.textContent} — ${entry.email}`);
      };
      const setAccess = async (enabled, duration = {}) => {
        Object.assign(entry, await api('admin/sync', { accountId: entry.id, enabled, ...duration }));
        paint();
      };
      button.onclick = () => {
        if (hasSyncAccess(entry)) return run(button, async () => {
          await setAccess(false);
          return 'Доступ отозван.';
        }, status);

        grantForm.reset();
        grantStatus.textContent = '';
        delete grantStatus.dataset.error;
        dialog.querySelector('[data-grant-email]').textContent = entry.email;
        grantForm.onsubmit = event => {
          event.preventDefault();
          void run(event.submitter, async () => {
            cancelGrant.disabled = true;
            try {
              await setAccess(true, durationBody(grantForm));
            } finally {
              cancelGrant.disabled = false;
            }
            dialog.close();
            delete status.dataset.error;
            status.textContent = 'Доступ выдан.';
          }, grantStatus);
        };
        dialog.showModal();
      };
      paint();
      return { row, keywords: `${entry.name} ${entry.email}`.toLowerCase() };
    });
    list.append(...rows.map(({ row }) => row));
    const filter = () => {
      const term = search.value.trim().toLowerCase();
      let count = 0;
      for (const { row, keywords } of rows) {
        row.hidden = !keywords.includes(term);
        if (!row.hidden) count++;
      }
      delete status.dataset.error;
      status.textContent = count ? `Аккаунтов: ${count}` : 'Аккаунты не найдены.';
    };
    search.oninput = filter;
    filter();
  } catch (error) {
    status.dataset.error = '';
    status.textContent = error instanceof TypeError ? 'Сервер недоступен.' : error.message;
  }
}

function showAccount() {
  const registration = path === '/register';
  if (location.hostname.endsWith('.github.io')) {
    main.classList.add('auth-page');
    main.innerHTML = `<section class="account-box auth-card"><header class="auth-heading"><span class="auth-symbol brand-mark" aria-hidden="true"></span><h1>Аккаунт на твоём ПК</h1><p class="muted">Сервер аккаунтов временно работает на твоём компьютере.</p></header><a class="button local-account-link" href="http://127.0.0.1:4179/${registration ? 'register' : 'login'}${validCode ? '?code=' + code : ''}">${registration ? 'Открыть регистрацию' : 'Открыть вход'}</a><p class="auth-availability">Открывай эту ссылку на ПК, где запущен сервер X.Vex. На телефоне входи через приложение.</p></section>`;
    return;
  }
  if (path === '/connect' && !validCode) {
    main.innerHTML = '<section class="account-box"><h1>Вход в X.Vex</h1><p>Откройте ссылку для входа из приложения.</p></section>';
    return;
  }
  if (path === '/account' && email) return showProfile();
  if (path === '/connect' && email) {
    main.innerHTML = `<section class="account-box"><h1>Подтвердить вход</h1><p>Сверь код со значением в приложении.</p><p class="device-code">${code}</p><p id="account-email"></p><button class="button" id="approve" type="button">Подтвердить вход</button><p role="status"></p></section>`;
    document.querySelector('#account-email').textContent = email;
    const approve = document.querySelector('#approve');
    approve.onclick = () => run(approve, async () => {
      await api('device/approve', { code });
      approve.hidden = true;
      return 'Вход подтверждён. Вернись в приложение X.Vex.';
    });
    return;
  }
  const switchPath = registration ? '/login' : '/register';
  main.classList.add('auth-page');
  main.innerHTML = `<section class="account-box auth-card"><header class="auth-heading"><span class="auth-symbol brand-mark" aria-hidden="true"></span><h1>${registration ? 'Создай своё пространство' : 'С возвращением.'}</h1>
    <p class="muted">${registration ? 'Один аккаунт для твоих устройств.' : 'Продолжи работу в X.Vex.'}</p></header>
    <form>
      <label>Электронная почта<input type="email" name="email" autocomplete="email" required maxlength="254"></label>
      ${passwordField('password', 'Пароль', registration ? 'new-password' : 'current-password', registration ? 'Минимум 8 символов' : '')}
      ${registration ? passwordField('repeat', 'Повторить пароль', 'new-password') : ''}
      ${registration ? '' : '<a class="password-recovery" href="/forgot-password">Забыли пароль?</a>'}
      <button class="button" type="submit">${registration ? 'Зарегистрироваться' : 'Войти'}</button>
    </form><p role="status"></p>
    <p class="auth-alternative">${registration ? 'Уже есть аккаунт?' : 'Нет аккаунта?'} <a href="${switchPath + (validCode ? '?code=' + code : '')}">${registration ? 'Войти' : 'Создать аккаунт'}</a></p>${location.hostname.endsWith('.github.io') ? '<p class="auth-availability">Сервис аккаунтов пока не подключён.</p>' : ''}</section>`;
  const form = main.querySelector('form');
  bindPasswordToggles(form);
  form.onsubmit = event => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    void run(event.submitter, async () => {
      if (registration && fields.get('password') !== fields.get('repeat')) throw new Error('Пароли не совпадают.');
      await api(registration ? 'register' : 'login', { email: fields.get('email'), password: fields.get('password') });
      location.assign(accountPath);
    });
  };
}

function bindPasswordToggles(form) {
  for (const toggle of form.querySelectorAll('.password-toggle')) {
    const input = document.getElementById(toggle.getAttribute('aria-controls'));
    const icon = toggle.querySelector('use');
    toggle.onclick = () => {
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      const label = reveal ? 'Скрыть пароль' : 'Показать пароль';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      icon.setAttribute('href', reveal ? '/assets/icons.svg#eye-off' : '/assets/icons.svg#eye');
    };
  }
}

function showEmailFlow() {
  const confirming = path === '/confirm-email';
  const requesting = path === '/forgot-password';
  const token = requesting ? '' : location.hash.slice(1);
  if (!requesting && location.hash) history.replaceState(null, '', path);
  const hasLink = /^[\w-]{43}$/.test(token);
  const title = confirming ? 'Подтвердить почту' : requesting ? 'Восстановить пароль' : 'Задать новый пароль';
  main.classList.add('auth-page');
  main.innerHTML = `<section class="account-box auth-card email-flow-card">
    <header class="auth-heading"><span class="email-flow-symbol" aria-hidden="true">${confirming ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>' : '<span class="auth-symbol brand-mark"></span>'}</span><h1>${title}</h1>
    ${confirming ? '<p class="muted">Подтверди адрес электронной почты, чтобы защитить доступ к аккаунту X.Vex.</p>' : ''}</header>
    ${requesting || hasLink ? `<form>
      ${requesting ? '<label>Электронная почта<input name="email" type="email" autocomplete="email" maxlength="254" required></label><p class="muted">Для подтверждённой почты тестовая ссылка появится в папке .data/mail.</p>'
        : confirming ? '' : passwordField('password', 'Новый пароль', 'new-password', 'Минимум 8 символов') +
          passwordField('repeat', 'Повторить пароль', 'new-password')}
      <button class="button" type="submit">${requesting ? 'Получить ссылку для сброса' : confirming ? 'Подтвердить почту' : 'Сохранить пароль'}</button>
    </form>` : '<p class="muted">Открой ссылку из письма целиком.</p>'}
    <p role="status"></p>
    ${confirming ? '' : '<p class="auth-alternative"><a href="/login">Перейти ко входу</a></p>'}
  </section>`;
  const form = main.querySelector('form');
  if (!form) return;
  bindPasswordToggles(form);
  form.onsubmit = event => {
    event.preventDefault();
    const fields = new FormData(form);
    void run(event.submitter, async () => {
      if (requesting) {
        await api('password/request', { email: fields.get('email') });
        return 'Если почта подтверждена, тестовая ссылка будет в папке .data/mail.';
      }
      if (confirming) {
        await api('email/confirm', { token });
        form.hidden = true;
        location.replace(email ? '/account' : '/login');
        return '';
      }
      if (fields.get('password') !== fields.get('repeat')) throw new Error('Пароли не совпадают.');
      await api('password/reset', { token, password: fields.get('password') });
      form.reset();
      form.hidden = true;
      return 'Пароль изменён. Войдите с новым паролем.';
    });
  };
}

async function run(button, action, status = main.querySelector('[role=status]')) {
  status.textContent = '';
  delete status.dataset.error;
  button.disabled = true;
  try { status.textContent = await action() ?? ''; }
  catch (error) {
    status.dataset.error = '';
    status.textContent = error instanceof TypeError ? 'Сервер недоступен.' : error.message;
  } finally { button.disabled = false; }
}

const pages = { '/': home, '/sync': sync, '/download': download, '/help': help };
const emailFlowTitles = { '/confirm-email': 'Подтвердить почту', '/forgot-password': 'Восстановить пароль', '/reset-password': 'Задать новый пароль' };
const titles = { '/sync': 'Синхронизация', '/download': 'Скачать', '/help': 'Справка', '/account': 'Профиль', '/login': 'Войти', '/register': 'Создать аккаунт', '/connect': 'Вход в приложении' };
titles['/admin'] = 'Админ-панель';
const pageTitle = titles[path] ?? emailFlowTitles[path];
document.title = pageTitle ? pageTitle + ' · X.Vex' : 'X.Vex';

if (pages[path]) {
  main.innerHTML = pages[path]();
  for (const button of main.querySelectorAll('[data-tool]')) button.onclick = () => {
    main.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#tool-preview').innerHTML = toolPreview(button.dataset.tool);
  };
  if (path === '/' && location.hash === '#tools-title') document.querySelector('#tools-title').scrollIntoView();
  if (path === '/download') {
    fetch('https://api.github.com/repos/TheXilliX/xvex-updates/releases/latest').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(release => {
      const windows = release.assets.find(asset => /_x64-setup\.exe$/.test(asset.name));
      const android = release.assets.find(asset => /Android-arm64\.apk$/.test(asset.name));
      if (windows) { document.querySelector('#windows-download').href = windows.browser_download_url; document.querySelector('#primary-download').href = windows.browser_download_url; }
      if (android) document.querySelector('#android-download').href = android.browser_download_url;
    }).catch(() => {});
    api('release').then(({ version }) => {
      document.querySelector('#windows-version').textContent = 'Windows x64 · версия ' + version;
    }).catch(() => {});
  }
  if (path === '/help') {
    const entries = [...main.querySelectorAll('details')];
    const search = document.querySelector('#help-search');
    search.oninput = () => {
      const term = search.value.trim().toLowerCase();
      entries.forEach(entry => { entry.hidden = !entry.textContent.toLowerCase().includes(term); });
      document.querySelector('#no-results').hidden = entries.some(entry => !entry.hidden);
    };
    const linkedEntry = entries.find(entry => entry.id && '#' + entry.id === location.hash);
    if (linkedEntry) {
      linkedEntry.open = true;
      linkedEntry.scrollIntoView();
    }
  }
}
try {
  account = await api('account');
  email = account.email;
} catch {}
try { sessionStorage.setItem('xvex-header-session', JSON.stringify({ signedIn:!!email, admin:!!account?.admin })); } catch {}
if (email) {
  accountLink.textContent = 'Профиль';
  accountLink.href = '/account';
  if (account.admin) {
    const adminLink = document.querySelector('.header-admin');
    adminLink.hidden = false;
    if (path === '/admin') adminLink.setAttribute('aria-current', 'page');
  }
}
else {
  accountLink.textContent = 'Аккаунт';
  accountLink.href = '/login';
  document.querySelector('.header-admin').hidden = true;
}
accountLink.removeAttribute('data-pending');
for (const link of nav.querySelectorAll('a')) {
  if ((link.dataset.route ?? link.pathname) === path) link.setAttribute('aria-current', 'page');
}
if (path === '/admin') {
  void showAdmin();
} else if (emailFlowTitles[path]) {
  showEmailFlow();
} else if (!pages[path]) {
  if (!accountLink.hasAttribute('aria-current')) accountLink.setAttribute('aria-current', 'true');
  showAccount();
}

