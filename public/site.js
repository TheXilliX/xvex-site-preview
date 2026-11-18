const main = document.querySelector('#main');
const siteBase = location.hostname.endsWith('.github.io') ? '/xvex-site-preview' : '';
let path = location.pathname.slice(siteBase.length) || '/';
if (path === "/") document.body.classList.add("home-page");
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const accountLink = document.querySelector('#account-link');
const defaultFooter = document.querySelector('.site-footer').innerHTML;
const navFrame=document.createElement('span');navFrame.className='navigation-frame';navFrame.setAttribute('aria-hidden','true');document.querySelector('.site-header').prepend(navFrame);
function positionNavFrame(){
  const selected=document.querySelector('.site-header a[aria-current]');
  if(!selected){navFrame.style.opacity='0';return;}
  const first=!navFrame.dataset.ready;if(first)navFrame.style.transition='none';
  const parent=navFrame.parentElement.getBoundingClientRect(),rect=selected.getBoundingClientRect();
  if(!rect.width||!rect.height){navFrame.style.opacity='0';return;}
  navFrame.style.width=rect.width+'px';navFrame.style.height=rect.height+'px';navFrame.style.transform=`translate(${rect.left-parent.left}px,${rect.top-parent.top}px)`;navFrame.style.opacity='1';
  if(first){navFrame.dataset.ready='true';requestAnimationFrame(()=>{navFrame.style.transition='';});}
}
new ResizeObserver(positionNavFrame).observe(document.querySelector('.site-header'));
let code = new URLSearchParams(location.search).get('code') ?? '';
let validCode = /^[A-F0-9]{10}$/.test(code);
let connectPath = '/connect?code=' + encodeURIComponent(code);
let accountPath = validCode ? connectPath : '/account';

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
      <p>Начни мысль на компьютере, продолжи на телефоне. Подключай хранилища через аккаунт X.Vex, сохраняя доступ к локальным материалам без интернета.</p>
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
  const glyph = (body) => '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
  const cloud=glyph('<path d="M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11.7 1.8A4.2 4.2 0 0 1 18 18"/><path d="m9 16 3-3 3 3m-3-3v8"/>');
  const offline=glyph('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4m-4-10 3 3 5-5"/>');
  const layers=glyph('<path d="m12 3 10 6-10 6L2 9 12 3Zm-10 12 10 6 10-6M2 12l10 6 10-6"/>');
  const lock=glyph('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>');
  const history=glyph('<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v6l4 2"/>');
  return `<div class="sync-page">
    <header class="sync-hero"><span class="eyebrow">Синхронизация X.Vex</span><h1>Мысли рядом.<br>На любом твоём устройстве.</h1><p>Записывай на компьютере, продолжай на телефоне. Одно хранилище для заметок, досок и дел — с локальной копией на каждом устройстве.</p><div class="sync-actions"><a class="button" href="/account?section=sync">Подключить синхронизацию</a><a class="button secondary" href="#pricing">Доступ и цены</a></div></header>
    <div class="sync-device-scene" aria-label="Одно хранилище на компьютере и телефоне"><div class="sync-device sync-desktop"><span class="sync-window-dots" aria-hidden="true">● ● ●</span><div><span class="sync-device-icon">${offline}</span><strong>Твоё пространство</strong><span>Заметки · Доски · Канбан</span><div class="sync-note-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div><div class="sync-connection"><span>${cloud}</span><small>Одно хранилище</small></div><div class="sync-device sync-phone"><span class="sync-phone-speaker" aria-hidden="true"></span><span class="sync-device-icon">${layers}</span><strong>Те же идеи.</strong><span>Теперь под рукой.</span><div class="sync-note-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div>
    <section class="sync-feature-section" aria-labelledby="sync-features"><div class="sync-section-title"><span class="eyebrow">Уже в X.Vex</span><h2 id="sync-features">Работай в своём ритме.</h2><p>Материалы остаются на устройстве. Синхронизация помогает перенести их туда, где ты продолжишь.</p></div><div class="sync-feature-grid"><article>${offline}<h3>Без интернета — тоже можно</h3><p>Открывай и меняй локальные материалы офлайн. Когда появится сеть, нажми «Синхронизировать» в настройках.</p></article><article>${layers}<h3>Больше, чем заметки</h3><p>Передавай заметки, доски, канбан и папки. Вложения и настройки пока остаются на каждом устройстве отдельно.</p></article><article>${cloud}<h3>Одно название. Одно пространство.</h3><p>Подключи своё хранилище или создай новое. На другом устройстве выбери его из облака — приложение создаст локальную папку.</p></article></div></section>
    <section class="sync-pricing" id="pricing" aria-labelledby="sync-price-title"><div class="sync-section-title"><span class="eyebrow">Доступ и цены</span><h2 id="sync-price-title">Выбери, как работать.</h2><p>Локальное пространство всегда рядом. Синхронизацию можно подключить отдельно.</p></div><div class="sync-price-grid"><article class="sync-price-card"><span class="sync-plan-label">На своём устройстве</span><h3>X.Vex</h3><p class="sync-price">Бесплатно</p><p>Для мыслей и дел, которым достаточно одного устройства.</p><ul><li>Заметки, доски и канбан</li><li>Локальные хранилища</li><li>Работа без интернета</li><li>Без обязательной регистрации</li></ul><a class="button secondary" href="/download">Скачать X.Vex</a></article><article class="sync-price-card sync-price-featured"><span class="sync-plan-label">Между устройствами</span><h3>Синхронизация X.Vex</h3><div class="sync-billing" role="group" aria-label="Период подписки"><button type="button" data-billing="month" aria-pressed="true">Месяц</button><button type="button" data-billing="year" aria-pressed="false">Год · −16%</button></div><p class="sync-price" id="sync-price-amount">299 ₽ <span class="sync-price-period">/ месяц</span></p><span class="sync-price-saving" id="sync-price-detail">3 588 ₽ за 12 месяцев при помесячной оплате</span><p>Онлайн-оплата скоро. Сейчас подключить доступ можно по промокоду или через администратора.</p><ul><li>Одно облачное хранилище на аккаунт</li><li>Подключение на компьютере и телефоне</li><li>Локальная копия на каждом устройстве</li><li>Срок доступа — по условиям промокода</li></ul><a class="button" href="/account?section=sync">Открыть аккаунт</a></article></div></section>
    <section class="sync-roadmap" aria-labelledby="sync-next"><div class="sync-section-title"><span class="eyebrow">Следующие шаги</span><h2 id="sync-next">Сделать синхронизацию ещё лучше.</h2><p>Эти возможности в планах. В текущую версию они ещё не входят.</p></div><div class="sync-roadmap-grid"><article>${lock}<div><h3>Сквозное шифрование <span>В планах</span></h3><p>Защита содержимого так, чтобы прочитать его можно было только на твоих устройствах.</p></div></article><article>${history}<div><h3>История версий <span>В планах</span></h3><p>Возможность посмотреть изменения и вернуться к предыдущей версии материала.</p></div></article></div></section>
    <section class="sync-faq" aria-labelledby="sync-questions"><h2 id="sync-questions">Осталось разобраться?</h2><details><summary>Как подключить хранилище?</summary><p>Войди в аккаунт в приложении и открой «Настройки → Синхронизация». Подключи текущее хранилище или создай новое. На втором устройстве войди в тот же аккаунт и загрузи хранилище из облака.</p></details><details><summary>Что происходит без интернета?</summary><p>Локальные материалы доступны для чтения и редактирования. Для обмена изменениями нужна сеть: открой настройки синхронизации и нажми «Синхронизировать».</p></details><details><summary>Как получить доступ сейчас?</summary><p>Активируй промокод в аккаунте или обратись в <a href="${supportUrl}">поддержку</a>. Онлайн-оплата пока не подключена.</p></details><details><summary>Можно ли подключиться с телефона?</summary><p>Да, в приложении Android. Текущая тестовая сборка подключается к локальному серверу: компьютер с сервером должен быть включён, а телефон — находиться в той же сети Wi-Fi.</p></details></section>
  </div>`;
}

function bindSyncPricing() {
  main.querySelectorAll('[data-billing]').forEach(button=>button.onclick=()=>{
    const annual=button.dataset.billing==='year';
    main.querySelectorAll('[data-billing]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    main.querySelector('#sync-price-amount').innerHTML=annual?'2 999 ₽ <span class="sync-price-period">/ год</span>':'299 ₽ <span class="sync-price-period">/ месяц</span>';
    main.querySelector('#sync-price-detail').textContent=annual?'≈ 250 ₽ в месяц · экономия 589 ₽ за год':'3 588 ₽ за 12 месяцев при помесячной оплате';
  });
}

function download() {
  return `<header class="download-hero"><span class="brand-mark" aria-hidden="true"></span><h1>X.Vex</h1><p>Твоё пространство для идей и дел.</p></header><div class="platforms narrow"><h2>Все платформы</h2>
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
  return `<div class="duration-fields"><label>Срок доступа<input name="amount" type="number" inputmode="numeric" min="1" max="365" placeholder="1–365" step="1" required></label><div class="duration-unit"><span>Единица</span><input name="unit" type="hidden" value="days"><div class="unit-buttons" role="group" aria-label="Единица срока"><button type="button" data-unit="days" aria-pressed="true">Дни</button><button type="button" data-unit="hours" aria-pressed="false">Часы</button></div></div><label class="forever-control"><span>Навсегда</span><input type="checkbox" role="switch" name="forever" aria-label="Бессрочный доступ"></label></div>`;
}
function bindDuration(form) {
  const update = () => {
    const forever = form.elements.forever.checked;
    form.elements.amount.disabled = forever;
    form.elements.unit.disabled = forever;
    form.elements.amount.max = form.elements.unit.value === 'hours' ? 24 : 365;
    form.elements.amount.placeholder = form.elements.unit.value === 'hours' ? '1–24' : '1–365';
    form.querySelectorAll('[data-unit]').forEach(button=>{button.disabled=forever;button.setAttribute('aria-pressed',String(button.dataset.unit===form.elements.unit.value));});
  };
  form.elements.forever.onchange = update;
  form.elements.forever.oninput = update;
  form.elements.unit.onchange = update;
  form.querySelectorAll('[data-unit]').forEach(button=>button.onclick=()=>{form.elements.unit.value=button.dataset.unit;update();});
  form.addEventListener('reset', () => setTimeout(update));
  update();
}
const durationBody = form => ({ forever:form.elements.forever.checked, amount:Number(form.elements.amount.value), unit:form.elements.unit.value });

const accountIcon = name => `<svg width="18" height="18" aria-hidden="true"><use href="/assets/icons.svg#${name}"></use></svg>`;
function showProfile() {
  main.classList.add('profile-page');
  const section = new URLSearchParams(location.search).get('section') || 'profile';
  const selected = ['profile','payments','sync'].includes(section) ? section : 'profile';
  main.innerHTML = `<section class="account-workspace"><aside class="account-sidebar"><nav aria-label="Разделы аккаунта"><button data-section="profile">${accountIcon("user")}Профиль</button><button data-section="payments">${accountIcon("credit-card")}Оплата</button><button data-section="sync">${accountIcon("refresh-cw")}Синхронизация</button></nav><button id="logout" class="account-logout">${accountIcon("log-out")}Выйти</button></aside><div class="account-content"><p class="profile-status" role="status"></p><div id="account-section"></div></div></section><dialog class="sync-grant-dialog account-edit-dialog"><form></form></dialog>`;


  const status=main.querySelector('.profile-status');
  main.querySelector('#logout').onclick = () => edit('signout');
  const dialog=main.querySelector('.account-edit-dialog');
  const form=dialog.querySelector('form');
  const edit = kind => {
    const title={signout:'Вы точно хотите выйти из аккаунта?',name:'Изменить имя',email:'Изменить почту',password:'Изменить пароль',logout:'Выйти на всех устройствах?',delete:'Удалить свой аккаунт?'}[kind];
    form.innerHTML=`<h2 id="account-edit-title">${title}</h2>${kind==='name'?'<label>Имя<input name="name" required maxlength="80" autocomplete="username"></label>':''}${kind==='email'?'<label>Новая почта<input name="email" type="email" required maxlength="254" autocomplete="email"></label>':''}${kind==='delete'?'<p class="delete-warning">Аккаунт и облачные данные будут удалены навсегда. Локальные файлы сохранятся.</p><label>Введи свою почту для подтверждения<input name="email" type="email" required autocomplete="off"></label>':''}${kind==='logout'?'<p class="muted">Сеансы на сайте и во всех приложениях завершатся, включая этот.</p>':''}${kind!=='name'&&kind!=='signout'&&!(kind==='email'&&!account.emailConfirmed)?passwordField('currentPassword','Текущий пароль','current-password'):''}${kind==='password'?passwordField('password','Новый пароль','new-password')+passwordField('repeat','Повторить новый пароль','new-password'):''}<p role="status"></p><div class="profile-actions"><button class="button secondary" type="button" data-cancel>Отмена</button><button class="button${kind==='delete'||kind==='signout'?' danger-button':''}" type="submit">${kind==='delete'?'Удалить аккаунт':kind==='logout'?'Выйти везде':kind==='signout'?'Выйти':'Сохранить'}</button></div>`;
    dialog.setAttribute('aria-labelledby','account-edit-title');dialog.classList.toggle('signout-dialog',kind==='signout');
    if(kind==='name')form.elements.name.value=account.name || '';
    bindPasswordToggles(form);
    const cancel=form.querySelector('[data-cancel]');
    cancel.onclick=()=>dialog.close();
    dialog.oncancel=event=>{if(cancel.disabled)event.preventDefault();};
    form.onsubmit=event=>{
      event.preventDefault();
      void run(event.submitter,async()=>{
        if(kind==='password'&&form.elements.password.value!==form.elements.repeat.value)throw new Error('Пароли не совпадают.');
        const payload=Object.fromEntries(new FormData(form));
        cancel.disabled=true;
        let result;
        try {result=await api(kind==='signout'?'logout':'account/'+({name:'profile',logout:'logout-all'}[kind]||kind),payload);} finally {cancel.disabled=false;}
        if(kind==='signout'||kind==='logout'){location.replace('/login');return;}
        if(kind==='name')account.name=result.name;
        if(kind==='email'&&!result.pending){Object.assign(account,result);email=result.email;}
        dialog.close();showProfile();
        main.querySelector('.profile-status').textContent=result.message||'Имя сохранено.';
      },form.querySelector('[role=status]'));
    };
    dialog.showModal();
  };
  const paint = tab => {
    main.querySelectorAll('[data-section]').forEach(button=>button.setAttribute('aria-current',button.dataset.section===tab?'page':'false'));
    const content=main.querySelector('#account-section');
    if(tab==='profile'){
      content.innerHTML=`<header class="account-section-heading"><h1>Твой профиль</h1><p class="muted">Личные данные и безопасность аккаунта.</p></header><section class="account-settings-card"><div class="account-setting-row"><div><h2>Имя</h2><p id="profile-name"></p></div><button class="button secondary" data-edit="name">Изменить</button></div><div class="account-setting-row"><div><h2>Электронная почта</h2><p id="account-email"></p><span class="profile-badge${account.emailConfirmed?' is-active':''}">${account.emailConfirmed?'Почта подтверждена':'Нужно подтверждение'}</span></div><div class="account-row-buttons"><button class="button secondary" data-edit="email">Изменить</button>${account.emailConfirmed?'':'<button class="button secondary" id="confirm-email">Получить ссылку</button>'}</div></div><div class="account-setting-row"><div><h2>Пароль</h2><p>Измени пароль для входа в аккаунт.</p></div><button class="button secondary" data-edit="password">Изменить</button></div><div class="account-setting-row"><div><h2>Двухфакторная аутентификация</h2><p>Дополнительная защита входа. Подключим следующим этапом.</p></div><span class="account-coming">Скоро</span></div><div class="account-setting-row"><div><h2>Связаться с поддержкой</h2><p>Поможем с аккаунтом и синхронизацией.</p></div><a class="button secondary" href="${supportUrl}">Написать</a></div><div class="account-setting-row"><div><h2>Выйти везде</h2><p>Завершить сеансы на всех устройствах.</p></div><button class="button secondary" data-edit="logout">Выйти везде</button></div><div class="account-setting-row"><div><h2>Удалить аккаунт</h2><p>Удалить аккаунт и облачные данные навсегда.</p></div><button class="button secondary danger-button" data-edit="delete">Удалить</button></div></section>`;
      content.querySelector('#profile-name').textContent=account.name||'Имя пока не указано';
      content.querySelector('#account-email').textContent=email;
      content.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>edit(button.dataset.edit));
      const confirm=content.querySelector('#confirm-email');
      if(confirm)confirm.onclick=async()=>{
        const caption=confirm.textContent;confirm.disabled=true;
        try{await api('email/request',{});confirm.textContent='Ссылка создана';confirm.title='Письмо сохранено в локальной папке писем сервера';setTimeout(()=>{if(confirm.isConnected){confirm.textContent=caption;confirm.disabled=false;}},5000);}
        catch(error){status.textContent=error.message;confirm.disabled=false;}
      };
    }else if(tab==='payments'){
      content.innerHTML=`<header class="account-section-heading"><h1>Оплата</h1><p class="muted">Промокоды и доступ к сервисам.</p></header><section class="account-settings-card"><div class="account-setting-row"><div><h2>Способ оплаты</h2><p>Онлайн-оплата пока не подключена. Доступ можно получить по промокоду или у администратора.</p></div></div><div class="account-setting-row"><div><h2>Счета и возвраты</h2><p>Платежей и счетов пока нет.</p></div></div></section><section class="profile-card payment-promo"><h2>Активировать промокод</h2><p class="muted">Промокод открывает или продлевает доступ к синхронизации.</p><form class="promo-redeem"><label>Промокод<input name="code" placeholder="Введи промокод" maxlength="40" required autocomplete="off"></label><button class="button" type="submit">Активировать</button><p role="status"></p></form></section><section class="profile-card promo-history"><h2>История промокодов</h2><p class="muted" data-history-status>Загружаем историю…</p><ul></ul></section>`;
      const promo=content.querySelector('.promo-redeem');
      promo.onsubmit=event=>{event.preventDefault();void run(event.submitter,async()=>{Object.assign(account,await api('promo/redeem',{code:promo.elements.code.value}));paint('payments');status.textContent='Промокод активирован. Доступ к синхронизации открыт.';},promo.querySelector('[role=status]'));};
      const history=content.querySelector('.promo-history');
      void api('account/promos').then(({promos})=>{
        history.querySelector('[data-history-status]').textContent=promos.length?'':'Ты ещё не активировал ни одного промокода.';
        for(const item of promos){const row=document.createElement('li');row.innerHTML='<strong></strong><span class="muted"></span>';row.querySelector('strong').textContent=item.code;row.querySelector('span').textContent=new Date(item.redeemed_at).toLocaleDateString('ru-RU')+' · '+(item.duration_hours===null?'Навсегда':item.duration_hours%24===0?item.duration_hours/24+' дн.':item.duration_hours+' ч.');history.querySelector('ul').append(row);}
      }).catch(error=>{history.querySelector('[data-history-status]').textContent=error.message;});
    }else{
      content.innerHTML=`<header class="account-section-heading"><h1>Синхронизация</h1><p class="muted">Твои материалы на твоих устройствах.</p></header><section class="profile-card profile-sync-card"><header><h2>Синхронизация X.Vex</h2><span class="profile-badge${hasSyncAccess(account)?' is-active':''}">${hasSyncAccess(account)?'Доступ открыт':'Не подключено'}</span></header><p class="profile-sync-summary">${hasSyncAccess(account)?'Доступ действует · '+syncExpiration(account):'Активируй доступ к синхронизации'}</p><p class="profile-detail">${hasSyncAccess(account)?'Войди в этот аккаунт в приложении и открой настройки синхронизации.':'Введи промокод или обратись к администратору, чтобы подключить синхронизацию.'}</p><form class="promo-redeem"><label>Промокод<input name="code" placeholder="Введи промокод" maxlength="40" required autocomplete="off"></label><button class="button secondary" type="submit">Активировать</button><p role="status"></p></form><a class="profile-text-link" href="/sync">О синхронизации <span aria-hidden="true">↗</span></a></section>`;
      const promo=content.querySelector('.promo-redeem');
      promo.onsubmit=event=>{event.preventDefault();void run(event.submitter,async()=>{Object.assign(account,await api('promo/redeem',{code:promo.elements.code.value}));paint('sync');status.textContent='Промокод активирован. Доступ к синхронизации открыт.';},promo.querySelector('[role=status]'));};
    }
  };
  main.querySelectorAll('[data-section]').forEach(button=>button.onclick=()=>{history.replaceState(null,'',siteBase+'/account'+(button.dataset.section==='profile'?'':'?section='+button.dataset.section));paint(button.dataset.section);});
  paint(selected);
}
async function showAdmin() {
  main.classList.add('admin-page');
  main.innerHTML = `<header class="admin-heading"><span class="profile-avatar" aria-hidden="true">✦</span><div><h1>Админ-панель</h1><p class="muted">Аккаунты, доступ к синхронизации и промокоды.</p></div></header>`;
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
      <h2 id="sync-grant-title">Выдать доступ к синхронизации</h2>
      <p class="muted" data-grant-email></p>
      ${durationFields()}
      <p role="status"></p>
      <div class="profile-actions">
        <button class="button secondary" type="button" data-grant-cancel>Отмена</button>
        <button class="button" type="submit">Выдать доступ</button>
      </div>
    </form>
  </dialog>`);
  main.querySelector('.admin-accounts').before(main.querySelector('.admin-promos'));
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
      row.querySelector('span').textContent = `${promo.duration_hours === null ? 'Навсегда' : promo.duration_hours % 24 === 0 ? promo.duration_hours / 24 + ' дн.' : promo.duration_hours + ' ч.'} · Активации: ${promo.uses} / ${promo.max_uses}`;
      const button = row.querySelector('button');
      const actions=document.createElement('div');actions.className='promo-actions';row.append(actions);actions.append(button);
      button.textContent=promo.disabled?'Включить':'Отключить';
      button.onclick = async () => {
        button.disabled=true;
        try {await api('admin/promos/state',{id:promo.id,enabled:!!promo.disabled});promo.disabled=promo.disabled?0:1;button.textContent=promo.disabled?'Включить':'Отключить';row.querySelector('span').textContent=`${promo.duration_hours===null?'Навсегда':promo.duration_hours%24===0?promo.duration_hours/24+' дн.':promo.duration_hours+' ч.'} · Активации: ${promo.uses} / ${promo.max_uses}`;}
        catch(error){promoStatus.textContent=error.message;promoStatus.dataset.error='';}
        finally{button.disabled=false;}
      };
      const remove=document.createElement('button');remove.type='button';remove.className='button secondary danger-button';remove.textContent='Удалить';actions.append(remove);
      remove.onclick=()=>{
        const modal=document.createElement('dialog');modal.className='sync-grant-dialog promo-delete-dialog';
        modal.innerHTML='<form><h2>Удалить промокод?</h2><p class="muted"></p><p class="delete-warning">Код больше нельзя будет активировать. Уже выданный доступ и история активаций сохранятся.</p><p role="status"></p><div class="profile-actions"><button class="button secondary" type="button">Отмена</button><button class="button secondary danger-button" type="submit">Удалить</button></div></form>';
        modal.querySelector('p').textContent=promo.code;main.append(modal);
        const cancel=modal.querySelector('[type=button]');cancel.onclick=()=>modal.close();modal.onclose=()=>modal.remove();
        modal.oncancel=event=>{if(cancel.disabled)event.preventDefault();};
        modal.querySelector('form').onsubmit=event=>{event.preventDefault();void run(event.submitter,async()=>{cancel.disabled=true;try{await api('admin/promos/delete',{id:promo.id});}finally{cancel.disabled=false;}modal.close();await loadPromos();promoStatus.textContent='Промокод удалён.';},modal.querySelector('[role=status]'));};
        modal.showModal();
      };
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
    const rows = accounts.sort((a,b)=>Number(b.admin)-Number(a.admin)).map(entry => {
      const row = document.createElement('li');
      row.innerHTML = `<div><strong></strong><span class="muted admin-email"></span><span class="muted admin-access"></span></div>
        <button class="button secondary" type="button"></button>`;
      row.querySelector('strong').textContent = entry.name || entry.email;
      if (entry.name) row.querySelector('.admin-email').textContent = entry.email;
      const access = row.querySelector('.admin-access');
      const button = row.querySelector('button');
      const actions = document.createElement('div');
      actions.className = 'admin-row-actions';
      row.append(actions);
      actions.append(button);
      const paint = () => {
        const enabled = hasSyncAccess(entry);
        access.textContent = (enabled ? 'Доступ к синхронизации · ' + syncExpiration(entry) : 'Без доступа к синхронизации') + (entry.admin ? ' · Администратор' : '');
        button.textContent = enabled ? 'Отозвать доступ' : 'Выдать доступ';
        button.setAttribute('aria-label', `${button.textContent} — ${entry.email}`);
      };
      const setAccess = async (enabled, duration = {}) => {
        Object.assign(entry, await api('admin/sync', { accountId: entry.id, enabled, ...duration }));
        paint();
      };
      button.onclick = () => {
        if(hasSyncAccess(entry)){
          const modal=document.createElement('dialog');modal.className='sync-grant-dialog revoke-access-dialog';
          modal.innerHTML='<form><h2>Отозвать доступ к синхронизации?</h2><div class="revoke-identity"><strong></strong><span class="muted"></span></div><p class="muted">Пользователь потеряет доступ к обмену с облаком. Локальные материалы сохранятся.</p><p role="status"></p><div class="profile-actions"><button type="button" class="button secondary">Отмена</button><button type="submit" class="button danger-button">Отозвать доступ</button></div></form>';
          modal.querySelector('strong').textContent=entry.name||'Пользователь';modal.querySelector('.revoke-identity span').textContent=entry.email;
          main.append(modal);const cancel=modal.querySelector('[type=button]');cancel.onclick=()=>modal.close();modal.onclose=()=>modal.remove();modal.oncancel=event=>{if(cancel.disabled)event.preventDefault();};
          modal.querySelector('form').onsubmit=event=>{event.preventDefault();void run(event.submitter,async()=>{cancel.disabled=true;try{await setAccess(false);}finally{cancel.disabled=false;}modal.close();},modal.querySelector('[role=status]'));};
          modal.showModal();return;
        }

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
      ${registration?'<label>Имя / ник<input name="name" required maxlength="80" autocomplete="off"></label>':''}
      <label>${registration?'Электронная почта':'Имя или электронная почта'}<input type="${registration?'email':'text'}" name="email" autocomplete="${registration?'email':'username'}" required maxlength="254"></label>
      ${passwordField('password', 'Пароль', registration ? 'new-password' : 'current-password', '')}
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
      await api(registration ? 'register' : 'login', { email: fields.get('email'), password: fields.get('password'),...(registration?{name:fields.get('name')}:{}) });
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

function showPendingAction() {
  const kind=path==='/confirm-account-delete'?'delete':path==='/confirm-password-change'?'password':'email';
  const token=location.hash.slice(1);if(location.hash)history.replaceState(null,'',siteBase+path);
  const valid=/^[\w-]{43}$/.test(token);
  const title=kind==='delete'?'Удалить аккаунт?':kind==='password'?'Подтвердить смену пароля':'Подтвердить новый адрес';
  main.classList.add('auth-page');
  main.innerHTML=`<section class="account-box auth-card email-flow-card"><header class="auth-heading"><span class="auth-symbol brand-mark" aria-hidden="true"></span><h1>${title}</h1><p class="muted">${kind==='delete'?'Аккаунт и облачные данные будут удалены навсегда. Локальные файлы на устройствах сохранятся.':kind==='password'?'После подтверждения будет установлен новый пароль и завершены все сеансы входа.':'Новый адрес станет почтой аккаунта после подтверждения. Все сеансы входа завершатся.'}</p></header>${valid?`<form><button class="button${kind==='delete'?' danger-button':''}" type="submit">${kind==='delete'?'Да, удалить аккаунт':'Подтвердить'}</button></form>`:'<p class="muted">Открой ссылку из письма целиком.</p>'}<p role="status"></p><a class="pending-cancel" href="/account">Отмена</a></section>`;
  const form=main.querySelector('form');
  if(form)form.onsubmit=event=>{event.preventDefault();void run(event.submitter,async()=>{await api('account/action/confirm',{token,kind});form.hidden=true;main.querySelector('.auth-heading h1').textContent=kind==='delete'?'Аккаунт удалён':'Изменение подтверждено';main.querySelector('.auth-heading p').textContent=kind==='delete'?'Удаление завершено.':'Войди заново с обновлёнными данными.';const link=main.querySelector('.pending-cancel');link.textContent='Перейти ко входу';link.href=siteBase+'/login';return '';});};
}
function showEmailFlow() {
  if(['/confirm-email-change','/confirm-password-change','/confirm-account-delete'].includes(path)){showPendingAction();return;}
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
        : confirming ? '' : passwordField('password', 'Новый пароль', 'new-password') +
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
Object.assign(emailFlowTitles,{'/confirm-email-change':'Подтвердить новый адрес','/confirm-password-change':'Подтвердить смену пароля','/confirm-account-delete':'Удалить аккаунт'});
const titles = { '/sync': 'Синхронизация', '/download': 'Скачать', '/help': 'Справка', '/account': 'Профиль', '/login': 'Войти', '/register': 'Создать аккаунт', '/connect': 'Вход в приложении' };
titles['/admin'] = 'Админ-панель';
async function renderRoute() {
path = location.pathname.slice(siteBase.length).replace(/\/$/,'') || '/';
code = new URLSearchParams(location.search).get('code') ?? '';
validCode = /^[A-F0-9]{10}$/.test(code);
connectPath = '/connect?code=' + encodeURIComponent(code);
accountPath = validCode ? connectPath : '/account';
main.className = 'wrap';
document.body.classList.toggle('home-page',path==='/');
if (path !== '/') {
  const footer=document.querySelector('.site-footer');
  footer.classList.remove('home-footer'); footer.innerHTML=defaultFooter;
}
document.querySelectorAll('#nav a,.header-admin,.header-account').forEach(link=>link.removeAttribute('aria-current'));
const pageTitle = titles[path] ?? emailFlowTitles[path];
document.title = pageTitle ? pageTitle + ' · X.Vex' : 'X.Vex';

if (pages[path]) {
  main.innerHTML = pages[path]();
  if(path === "/sync") bindSyncPricing();
  for (const button of main.querySelectorAll('[data-tool]')) button.onclick = () => {
    main.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#tool-preview').innerHTML = toolPreview(button.dataset.tool);
  };
  if (path === '/' && location.hash === '#tools-title') document.querySelector('#tools-title').scrollIntoView();
  if (path === '/download') {
    fetch('https://api.github.com/repos/TheXilliX/xvex-updates/releases/latest').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(release => {
      const windows = release.assets.find(asset => /_x64-setup\.exe$/.test(asset.name));
      const android = release.assets.find(asset => /Android-arm64\.apk$/.test(asset.name));
      if (windows) { document.querySelector('#windows-download').href = windows.browser_download_url; }
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
if (!account) try {
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
  await showAdmin();
} else if (emailFlowTitles[path]) {
  showEmailFlow();
} else if (!pages[path]) {
  if (!accountLink.hasAttribute('aria-current')) accountLink.setAttribute('aria-current', 'true');
  showAccount();
}
positionNavFrame();
}

await renderRoute();
let navigation = Promise.resolve();
function navigate(url, pop = false) {
  navigation = navigation.catch(()=>{}).then(async () => {
    const update = async () => {
      if (!pop) history.pushState(null,'',url);
      menu.setAttribute('aria-expanded','false'); nav.classList.remove('open');
      await renderRoute();
      window.scrollTo({top:0,left:0,behavior:'instant'});
      if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    };
    await update();
  });
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const url=new URL(link.href);
  if (url.origin!==location.origin) return;
  if(url.pathname===location.pathname && url.search===location.search){if(!url.hash){event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}return;}
  const route=url.pathname.slice(siteBase.length).replace(/\/$/,'') || '/';
  if (!(route in pages || route in titles || route in emailFlowTitles)) return;
  event.preventDefault(); navigate(url.href);
});
window.addEventListener('popstate',()=>navigate(location.href,true));









