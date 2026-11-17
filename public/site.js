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

const screenshot = (name, label) => `<div class="product app-screenshot ${name}-screenshot" role="img" aria-label="${label}"></div>`;
const homeScreenshot = screenshot('home', 'Главная X.Vex с виджетами');
const dashboard = screenshot('dashboard', 'Главная X.Vex с задачами, календарём и избранным');
const note = screenshot('note', 'Заметка со списком идей и задач для прогулки');
const board = screenshot('board', 'Доска с рисунками и стрелками между остановками прогулки');
const kanban = screenshot('kanban', 'Канбан с колонками «В процессе» и «Выполнены»');
const communityUrl = 'https://t.me/XVexAPP';
const supportUrl = 'https://t.me/XVex_Support';
const releasesUrl = 'https://github.com/TheXilliX/xvex-updates/releases';

function featureRows(rows) {
  return `<div class="feature-list">${rows.map(([title, description, preview]) => `<section class="feature">
    <div><h3>${title}</h3><p>${description}</p></div>${preview}
  </section>`).join('')}</div>`;
}

function intro(title, description) {
  return `<header class="page-intro"><h1>${title}</h1><p>${description}</p></header>`;
}

function home() {
  const footer = document.querySelector('.site-footer');
  footer.classList.add('home-footer');
  footer.innerHTML = `<a class="logo" href="/"><span class="brand-mark" aria-hidden="true"></span>X.Vex</a>
    <nav aria-label="Ссылки в подвале">
      <div><strong>Приложение</strong><a href="/sync">Синхронизация</a><a href="/download">Скачать</a></div>
      <div><strong>Ресурсы</strong><a href="/help">Справка</a><a href="${supportUrl}">Поддержка</a><a href="${releasesUrl}">История обновлений</a></div>
      <div><strong>Сообщество</strong><a href="${communityUrl}">Telegram</a></div>
    </nav>`;
  return `<section class="hero"><h1>Для идей, планов<br>и тараканов в голове.</h1>
    <p>Заметки, доски и канбан — в одном спокойном пространстве.</p>
    <a class="button" href="/download">Скачать</a></section>
    <div class="hero-product">
      ${homeScreenshot}
    </div>
    <ul class="home-principles">
      <li><h2>Файлы в твоей папке</h2><p>Открой любую папку как хранилище и работай с материалами на компьютере.</p></li>
      <li><h2>Работай без интернета</h2><p>Открывай и редактируй заметки, доски и задачи офлайн.</p></li>
      <li><h2>Главная под твои задачи</h2><p>Расставь виджеты и держи рядом календарь, задачи и избранное.</p></li>
    </ul>
    <section class="home-example" aria-labelledby="tools-title">
      <h2 id="tools-title">Инструменты для твоих идей</h2>
      ${featureRows([
        ['Заметки', 'Записывай мысли и материалы для проектов. Используй заголовки, списки и чекбоксы, чтобы структурировать записи.', note],
        ['Доски', 'Раскладывай идеи на свободном холсте. Добавляй картинки, рисуй и связывай элементы стрелками.', board],
        ['Канбан', 'Разбивай проект на карточки и перемещай их между колонками по мере работы.', kanban],
        ['Виджеты', 'Выведи на главную нужные колонки канбана, календарь и быстрый доступ к материалам.', dashboard],
      ])}
    </section>
    <section class="home-sync" aria-labelledby="sync-title">
      <h2 id="sync-title">Синхронизация между устройствами</h2>
      <p>Готовим X.Vex Sync для доступа к своим материалам с разных устройств. Сейчас можно работать с локальным хранилищем.</p>
      <a class="button secondary" href="/sync">Подробнее о синхронизации</a>
    </section>
    <section class="home-download" aria-labelledby="download-title">
      <h2 id="download-title">Попробуй X.Vex</h2>
      <a class="button" href="/download">Скачать</a>
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
  return intro('Синхронизация X.Vex', 'Тестовый доступ к X.Vex Sync выдаёт администратор.') + `<div class="sync-details narrow">
    <section>
      <h2>Одно хранилище на нескольких устройствах</h2>
      <p>Войдите в один аккаунт на обоих устройствах. В «Настройки → Синхронизация» укажите одинаковое имя облачного хранилища.</p>
      <p>Сначала синхронизируйте устройство с материалами. На втором устройстве выберите пустое локальное хранилище и нажмите «Синхронизировать».</p>
      <p>Заметки, доски, Kanban и папки сохраняются локально. Обмен отдельными файлами вложений и настройками хранилища пока недоступен.</p>
      <a href="/account">Проверить доступ в аккаунте</a>
    </section>
    <section id="pricing">
      <h2>Стоимость</h2>
      <p>Планируем предложить X.Vex Sync по подписке. Цену и условия опубликуем здесь ближе к запуску.</p>
    </section>
  </div>`;
}

function download() {
  return intro('Скачать X.Vex', 'Выбери свою платформу.') + `<div class="platforms narrow">
    <section class="platform"><div><strong>Windows</strong><small id="windows-version">Windows x64 · установщик</small></div><a id="windows-download" class="button" href="/download/windows">Скачать для Windows</a></section>
    <section class="platform"><div><strong>Android</strong><div class="channels"><span>Google Play</span><span>RuStore</span><span>APK</span></div></div><small>Скоро</small></section>
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
    return `<a class="help-image${variant}" href="${src}" target="_blank" rel="noopener" aria-label="Открыть снимок полностью — ${caption}"><img src="${src}" alt="${caption}" loading="lazy" decoding="async"></a>`;
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

function showProfile() {
  main.innerHTML = `<section class="account-box profile-box">
    <div class="profile-heading">
      <div><h1>Профиль</h1><p class="muted">Управление аккаунтом X.Vex.</p></div>
      <button class="button secondary" id="logout" type="button">Выйти</button>
    </div>
    <p class="profile-status" role="status"></p>
    <section class="profile-card">
      <h2>Личные данные</h2>
      <p class="muted">Электронная почта</p><p id="account-email"></p>
      <p class="muted">${account.emailConfirmed ? 'Почта подтверждена' : 'Почта ожидает подтверждения'}</p>
      ${account.emailConfirmed ? '' : '<button class="button secondary" id="confirm-email" type="button">Получить ссылку подтверждения</button>'}
    </section>
    <section class="profile-card">
      <h2>X.Vex Sync</h2>
      <p>${hasSyncAccess(account) ? 'Доступ выдан администратором · ' + syncExpiration(account) : 'Нет действующего доступа'}</p>
      <p class="muted">Войдите в этот аккаунт в приложении и откройте настройки синхронизации.</p>
      <a href="/sync">О синхронизации</a>
    </section>
  </section>`;
  main.querySelector('#account-email').textContent = email;
  const confirm = main.querySelector('#confirm-email');
  if (confirm) confirm.onclick = () => run(confirm, async () => {
    await api('email/request', {});
    return 'Тестовое письмо сохранено в папке .data/mail.';
  });
  const logout = main.querySelector('#logout');
  logout.onclick = () => run(logout, async () => {
    await api('logout', {});
    location.assign('/login');
  });
}

async function showAdmin() {
  main.innerHTML = intro('Админ-панель', 'Аккаунты и доступ к X.Vex Sync.');
  if (!account?.admin) {
    main.insertAdjacentHTML('beforeend', email
      ? '<p class="page-intro">Эта страница доступна администратору.</p>'
      : '<p class="page-intro"><a href="/login">Войти в аккаунт администратора</a></p>');
    return;
  }
  main.insertAdjacentHTML('beforeend', `<section class="admin-accounts narrow">
    <label>Поиск по имени или почте<input type="search" id="admin-search"></label>
    <p role="status">Загружаем аккаунты…</p>
    <ul aria-label="Аккаунты"></ul>
  </section>
  <dialog class="sync-grant-dialog" aria-labelledby="sync-grant-title">
    <form>
      <h2 id="sync-grant-title">Выдать доступ к Sync</h2>
      <p class="muted" data-grant-email></p>
      <label>Срок доступа
        <select name="days" autofocus>
          <option value="1">1 день</option>
          <option value="7">7 дней</option>
          <option value="30">30 дней</option>
          <option value="90">90 дней</option>
          <option value="180">180 дней</option>
          <option value="365">365 дней</option>
          <option value="forever">Навсегда</option>
        </select>
      </label>
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
      const setAccess = async (enabled, days) => {
        Object.assign(entry, await api('admin/sync', { accountId: entry.id, enabled, days }));
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
          const value = grantForm.elements.days.value;
          void run(event.submitter, async () => {
            cancelGrant.disabled = true;
            try {
              await setAccess(true, value === 'forever' ? null : Number(value));
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
  main.innerHTML = `<section class="account-box"><h1${registration ? ' class="register-title"' : ''}>${registration ? 'Создать аккаунт' : 'Войти в X.Vex'}</h1>
    <p class="muted">Локальный предпросмотр. Используй тестовый адрес и отдельный пароль.</p>
    <form>
      <label>Электронная почта<input type="email" name="email" autocomplete="email" required maxlength="254"></label>
      ${passwordField('password', 'Пароль', registration ? 'new-password' : 'current-password', registration ? 'Минимум 8 символов' : '')}
      ${registration ? passwordField('repeat', 'Повторить пароль', 'new-password') : ''}
      ${registration ? '' : '<a class="password-recovery" href="/forgot-password">Забыли пароль?</a>'}
      <button class="button" type="submit">${registration ? 'Зарегистрироваться' : 'Войти'}</button>
    </form><p role="status"></p>
    <p>${registration ? 'Уже есть аккаунт?' : 'Нет аккаунта?'} <a href="${switchPath + (validCode ? '?code=' + code : '')}">${registration ? 'Войти' : 'Зарегистрироваться'}</a></p></section>`;
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
  main.innerHTML = `<section class="account-box">
    <h1>${title}</h1>
    ${requesting || hasLink ? `<form>
      ${requesting ? '<label>Электронная почта<input name="email" type="email" autocomplete="email" maxlength="254" required></label><p class="muted">Для подтверждённой почты тестовая ссылка появится в папке .data/mail.</p>'
        : confirming ? '' : passwordField('password', 'Новый пароль', 'new-password', 'Минимум 8 символов') +
          passwordField('repeat', 'Повторить пароль', 'new-password')}
      <button class="button" type="submit">${requesting ? 'Получить ссылку для сброса' : confirming ? 'Подтвердить почту' : 'Сохранить пароль'}</button>
    </form>` : '<p class="muted">Открой ссылку из письма целиком.</p>'}
    <p role="status"></p>
    <p><a href="/login">Перейти ко входу</a></p>
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
        return 'Почта подтверждена.';
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
  if (path === '/' && location.hash === '#tools-title') document.querySelector('#tools-title').scrollIntoView();
  if (path === '/download') {
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
if (email) {
  accountLink.textContent = 'Профиль';
  accountLink.href = '/account';
  if (account.admin) {
    const adminLink = document.querySelector('.header-admin');
    adminLink.hidden = false;
    if (path === '/admin') adminLink.setAttribute('aria-current', 'page');
  }
}
for (const link of nav.querySelectorAll('a')) {
  if (link.pathname === path) link.setAttribute('aria-current', 'page');
}
if (path === '/admin') {
  void showAdmin();
} else if (emailFlowTitles[path]) {
  showEmailFlow();
} else if (!pages[path]) {
  if (!accountLink.hasAttribute('aria-current')) accountLink.setAttribute('aria-current', 'true');
  showAccount();
}
