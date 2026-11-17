import { createServer } from 'node:http';
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { promisify } from 'node:util';
import { dirname, resolve } from 'node:path';

const port = Number(process.env.PORT || 4179);
const publicOrigin = process.env.XVEX_PUBLIC_ORIGIN && new URL(process.env.XVEX_PUBLIC_ORIGIN);
if (publicOrigin && (publicOrigin.protocol !== "https:" || publicOrigin.href !== publicOrigin.origin + "/")) {
  throw new Error("XVEX_PUBLIC_ORIGIN должен содержать HTTPS-адрес сайта без пути.");
}
let origin;
const databaseFile = process.env.XVEX_DATABASE === ':memory:' ? ':memory:' : resolve(process.env.XVEX_DATABASE || '.data/accounts.sqlite');
const mailDirectory = resolve(process.env.XVEX_MAIL_OUTBOX || '.data/mail');
if (databaseFile !== ':memory:') mkdirSync(dirname(databaseFile), { recursive: true });
const db = new DatabaseSync(databaseFile);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, password TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS sync_vaults (
    account INTEGER NOT NULL REFERENCES accounts(id),
    name TEXT NOT NULL, revision INTEGER NOT NULL, contents TEXT NOT NULL,
    PRIMARY KEY (account, name)
  );
  CREATE TABLE IF NOT EXISTS sessions (digest TEXT PRIMARY KEY, account INTEGER NOT NULL REFERENCES accounts(id), kind TEXT NOT NULL, expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS devices (digest TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, account INTEGER REFERENCES accounts(id), expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS confirmed_emails (account INTEGER PRIMARY KEY REFERENCES accounts(id));
  CREATE TABLE IF NOT EXISTS email_links (
    digest TEXT PRIMARY KEY, account INTEGER NOT NULL REFERENCES accounts(id), purpose TEXT NOT NULL, expires INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS email_links_account ON email_links(account, purpose);
  CREATE TABLE IF NOT EXISTS account_profiles (
    account INTEGER PRIMARY KEY REFERENCES accounts(id),
    display_name TEXT NOT NULL DEFAULT '',
    administrator INTEGER NOT NULL DEFAULT 0,
    sync_granted_at INTEGER,
    sync_expires_at INTEGER
  );
`);
db.exec('PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE');
if (!db.prepare('PRAGMA table_info(account_profiles)').all().some(column => column.name === 'sync_expires_at')) {
  db.exec('ALTER TABLE account_profiles ADD COLUMN sync_expires_at INTEGER');
}
db.exec('COMMIT');

if (process.argv[2] === '--grant-admin') {
  const email = process.argv[3]?.trim().toLowerCase();
  const account = email && db.prepare('SELECT id FROM accounts WHERE email=?').get(email);
  if (!account) {
    console.error('Укажите почту уже созданного аккаунта X.Vex.');
    process.exit(1);
  }
  db.exec('BEGIN IMMEDIATE');
  db.prepare(`INSERT INTO account_profiles(account, administrator) VALUES(?, 1)
    ON CONFLICT(account) DO UPDATE SET administrator=1`).run(account.id);
  db.prepare('DELETE FROM sessions WHERE account=?').run(account.id);
  db.exec('COMMIT');
  console.log('Доступ к админ-панели выдан. Войдите в аккаунт заново.');
  db.close();
  process.exit(0);
}

const hashPassword = promisify(scrypt);
const sha = value => createHash('sha256').update(value).digest('hex');
const secret = () => randomBytes(32).toString('base64url');
const deviceTtl = 5 * 60_000;
const sessionTtl = 24 * 60 * 60_000;
const syncDurations = new Set([1, 7, 30, 90, 180, 365, null]);
const allowedDesktopOrigins = new Set(['http://127.0.0.1:1420', 'http://localhost:1420', 'http://127.0.0.1:1422', 'http://localhost:1422', 'http://10.0.2.2:1422', 'http://tauri.localhost', 'https://tauri.localhost', 'tauri://localhost']);
const pages = new Set(['/', '/sync', '/download', '/help', '/login', '/register', '/account', '/connect', '/admin',
  '/confirm-email', '/forgot-password', '/reset-password']);
const files = new Map([
  ['/theme.js', 'text/javascript; charset=utf-8'],
  ['/site.js', 'text/javascript; charset=utf-8'], ['/style.css', 'text/css; charset=utf-8'],
  ['/assets/icons.svg', 'image/svg+xml'], ['/assets/brand.svg', 'image/svg+xml'],
  ...['mark', 'mark-on-dark', 'dashboard-light', 'dashboard-dark', 'note-light', 'note-dark',
    'board-light', 'board-dark', 'kanban-light', 'kanban-dark'].map(name => ['/assets/' + name + '.png', 'image/png']),
  ...['installer', 'folder-picker', ...['vaults', 'open-folder', 'updates', 'trash', 'restore']
    .flatMap(name => [name + '-light', name + '-dark'])].map(name => ['/assets/help-' + name + '.jpg', 'image/jpeg']),
  ...['cyrillic', 'latin'].map(subset => ['/assets/google-sans-' + subset + '.woff2', 'font/woff2']),
]);
const limits = new Map();
const dummySalt = randomBytes(16).toString('hex');

function send(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

const syncBodyLimit = 8 * 1024 * 1024;
async function data(req, limit = 8192) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('bad-request');
    chunks.push(chunk);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('bad-request');
  return body;
}

function cookies(req) {
  return req.headers.cookie?.match(/(?:^|;\s*)xvex_session=([\w-]+)/)?.[1];
}

function session(req, kind) {
  const token = kind === 'web' ? cookies(req) : req.headers.authorization?.match(/^Bearer ([\w-]+)$/)?.[1];
  if (!token || token.length !== 43) return;
  return db.prepare(`SELECT a.id, a.email, s.digest, p.display_name, p.administrator, p.sync_granted_at, p.sync_expires_at,
    EXISTS(SELECT 1 FROM confirmed_emails c WHERE c.account=a.id) AS email_confirmed
    FROM sessions s JOIN accounts a ON a.id=s.account LEFT JOIN account_profiles p ON a.id=p.account
    WHERE s.digest=? AND s.kind=? AND s.expires>?`).get(sha(token), kind, Date.now());
}

function syncAccess(row, now = Date.now()) {
  const grantedAt = row?.sync_granted_at ?? null;
  const expiresAt = row?.sync_expires_at ?? null;
  const active = grantedAt !== null && (expiresAt === null || expiresAt > now);
  return { syncGrantedAt: active ? grantedAt : null, syncExpiresAt: active ? expiresAt : null };
}

function profile(user) {
  return {
    email: user?.email ?? null,
    emailConfirmed: user?.email_confirmed === 1,
    name: user?.display_name ?? '',
    ...syncAccess(user),
  };
}

function issue(account, kind) {
  const token = secret();
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(sha(token), account, kind, Date.now() + sessionTtl);
  return token;
}

function cookie(res, token) {
  const age = token ? sessionTtl / 1000 : 0;
  res.setHeader('Set-Cookie', 'xvex_session=' + (token || '') + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + age + (publicOrigin ? '; Secure' : ''));
}

function rate(key, quota, interval) {
  const now = Date.now();
  for (const [entry, limit] of limits) if (limit.until <= now) limits.delete(entry);
  const limit = limits.get(key) || { count: 0, until: now + interval };
  limits.set(key, limit);
  return ++limit.count <= quota;
}

async function createEmailLink(account, email, purpose) {
  const token = secret();
  const digest = sha(token);
  const now = Date.now();
  db.prepare('DELETE FROM email_links WHERE expires<=?').run(now);
  const confirming = purpose === 'confirm';
  db.prepare('INSERT INTO email_links VALUES (?, ?, ?, ?)').run(digest, account, purpose, now + (confirming ? 86_400_000 : 30 * 60_000));
  try {
    await mkdir(mailDirectory, { recursive: true });
    const link = origin + (confirming ? '/confirm-email' : '/reset-password') + '#' + token;
    const subject = confirming ? 'Подтверждение почты X.Vex' : 'Сброс пароля X.Vex';
    await writeFile(resolve(mailDirectory, now + '-' + randomBytes(8).toString('hex') + '.txt'),
      `Кому: ${email}\nТема: ${subject}\n\n${link}\n`, { flag: 'wx', mode: 0o600 });
  } catch (error) {
    db.prepare('DELETE FROM email_links WHERE digest=?').run(digest);
    throw error;
  }
}

const validPassword = password => typeof password === 'string' && password.length >= 8 && password.length <= 128;
const normalizeEmail = email => typeof email === 'string' ? email.trim().toLowerCase() : '';
const validEmail = email => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

let releaseCache;
async function releaseInfo() {
  if (releaseCache?.expires > Date.now()) return releaseCache.value;
  const endpoint = 'https://github.com/TheXilliX/xvex-updates/releases/latest/download/latest.json';
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('release-unavailable');
  const release = await response.json();
  const { version } = release;
  const url = release.platforms?.['windows-x86_64']?.url;
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)
      || url !== 'https://github.com/TheXilliX/xvex-updates/releases/download/v' + version + '/X.Vex_' + version + '_x64-setup.exe') {
    throw new Error('windows-installer-unavailable');
  }
  const value = { version, url };
  releaseCache = { expires: Date.now() + 300_000, value };
  return value;
}

async function handle(req, res) {
  const url = new URL(req.url, origin);
  const route = url.pathname;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");

  if (req.method === 'GET' && route === '/features') {
    res.writeHead(302, { Location: '/#tools-title' });
    return res.end();
  }

  if (req.method === 'GET' && (pages.has(route) || files.has(route))) {
    res.writeHead(200, { 'Content-Type': files.get(route) ?? 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(await readFile(new URL('./public' + (files.has(route) ? route : '/index.html'), import.meta.url)));
    return;
  }
  if (req.method === 'GET' && route === '/download/windows') {
    try {
      const { url: installer } = await releaseInfo();
      res.writeHead(302, { Location: installer, 'Cache-Control': 'no-store' });
      return res.end();
    } catch {
      res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end('<!doctype html><html lang="ru"><meta charset="utf-8"><title>Загрузка X.Vex</title><h1>Загрузка временно недоступна</h1><p><a href="/download/windows">Попробовать снова</a></p><p><a href="/download">Вернуться к выбору платформы</a></p></html>');
    }
  }
  if (req.method === 'GET' && route === '/api/release') {
    try { return send(res, 200, await releaseInfo()); }
    catch { return send(res, 503, { error: 'Версия временно недоступна.' }); }
  }

  const desktop = route.startsWith('/api/device/') && route !== '/api/device/approve';
  const requestOrigin = req.headers.origin;
  if (desktop && allowedDesktopOrigins.has(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
  }
  const user = session(req, desktop ? 'desktop' : 'web');
  if (req.method === 'GET' && route === '/api/account') {
    return send(res, 200, { ...profile(user), admin: user?.administrator === 1 });
  }
  if (req.method === 'GET' && route === '/api/device/account') {
    return send(res, 200, profile(user));
  }
  if (route.startsWith('/api/admin/')) {
    if (!user || user.administrator !== 1) {
      return send(res, user ? 403 : 401, { error: 'Требуется доступ администратора.' });
    }
    if (req.method === 'GET' && route === '/api/admin/accounts') {
      const accounts = db.prepare(`SELECT a.id, a.email, COALESCE(p.display_name, '') AS name,
        p.sync_granted_at, p.sync_expires_at, COALESCE(p.administrator, 0) AS admin
        FROM accounts a LEFT JOIN account_profiles p ON a.id=p.account ORDER BY a.email`).all();
      return send(res, 200, { accounts: accounts.map(row => ({
        id: row.id, email: row.email, name: row.name, admin: row.admin, ...syncAccess(row),
      })) });
    }
  }
  if (req.method !== 'POST' || !route.startsWith('/api/')) return send(res, 404, { error: 'Страница не найдена.' });
  if ((desktop ? requestOrigin && !allowedDesktopOrigins.has(requestOrigin) : requestOrigin !== origin)
      || !/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
    return send(res, 403, { error: 'Запрос отклонён.' });
  }
  let body;
  const vaultSync = route === "/api/device/sync";
  if (vaultSync) {
    if (!user) return send(res, 401, { error: "Сначала войдите в аккаунт." });
    if (syncAccess(user).syncGrantedAt === null) return send(res, 403, { error: "Доступ к X.Vex Sync не выдан или истёк." });
    if (!rate("sync:" + user.id, 80, 60_000)) return send(res, 429, { error: "Повторите синхронизацию через минуту." });
  }
  try { body = await data(req, vaultSync ? syncBodyLimit : 8192); }
  catch { return send(res, 400, { error: 'Некорректный запрос.' }); }

  if (vaultSync) {
    const name = typeof body.name === "string" ? body.name.trim().normalize("NFC") : "";
    if (!name || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name)) {
      return send(res, 400, { error: "Введите имя облачного хранилища длиной до 80 символов." });
    }
    const current = session(req, "desktop");
    if (!current) return send(res, 401, { error: "Сессия завершена. Войдите заново." });
    if (syncAccess(current).syncGrantedAt === null) return send(res, 403, { error: "Доступ к X.Vex Sync не выдан или истёк." });
    const row = db.prepare("SELECT revision, contents FROM sync_vaults WHERE account=? AND name=?").get(current.id, name);
    if (body.contents === undefined) {
      return send(res, 200, { revision: row?.revision ?? 0, contents: row ? JSON.parse(row.contents) : null });
    }
    if (!Number.isSafeInteger(body.revision) || body.revision < 0 || !Array.isArray(body.contents) ||
        new Set(body.contents.map(item => item?.id)).size !== body.contents.length ||
        !body.contents.every(item => item && typeof item.id === "string" && item.id.length > 0 &&
          typeof item.title === "string" && ["folder", "note", "kanban", "board"].includes(item.kind))) {
      return send(res, 400, { error: "Хранилище содержит некорректные данные." });
    }
    if ((row?.revision ?? 0) !== body.revision) {
      return send(res, 409, { error: "Облачная версия изменилась. Запустите синхронизацию снова." });
    }
    const next = body.revision + 1;
    const contents = JSON.stringify(body.contents);
    const result = row
      ? db.prepare("UPDATE sync_vaults SET revision=?, contents=? WHERE account=? AND name=? AND revision=?")
        .run(next, contents, current.id, name, body.revision)
      : db.prepare("INSERT INTO sync_vaults SELECT ?, ?, 1, ? WHERE (SELECT count(*) FROM sync_vaults WHERE account=?) < 8 ON CONFLICT DO NOTHING")
        .run(current.id, name, contents, current.id);
    return result.changes
      ? send(res, 200, { revision: next })
      : send(res, 409, { error: "Облачная версия изменилась или достигнут лимит в 8 хранилищ." });
  }

  if (route === '/api/email/request') {
    if (!user) return send(res, 401, { error: 'Сначала войдите в аккаунт.' });
    if (user.email_confirmed) return send(res, 200, { ok: true });
    if (!rate('confirm:' + user.id, 3, 15 * 60_000)) return send(res, 429, { error: 'Попробуйте отправить ссылку позже.' });
    await createEmailLink(user.id, user.email, 'confirm');
    return send(res, 200, { ok: true });
  }
  if (route === '/api/password/request') {
    const email = normalizeEmail(body.email);
    if (!validEmail(email)) return send(res, 400, { error: 'Проверьте адрес почты.' });
    if (!rate('reset-ip:' + req.socket.remoteAddress, 20, 15 * 60_000)) {
      return send(res, 429, { error: 'Слишком много запросов. Попробуйте позже.' });
    }
    if (rate('reset:' + email, 3, 15 * 60_000)) {
      const target = db.prepare('SELECT a.id FROM accounts a JOIN confirmed_emails c ON c.account=a.id WHERE a.email=?').get(email);
      if (target) await createEmailLink(target.id, email, 'reset');
    }
    return send(res, 200, { ok: true });
  }
  if (route === '/api/email/confirm' || route === '/api/password/reset') {
    const { token, password } = body;
    const confirming = route === '/api/email/confirm';
    const invalidLink = 'Ссылка просрочена или уже использована.';
    if (typeof token !== 'string' || !/^[\w-]{43}$/.test(token)) return send(res, 400, { error: invalidLink });
    const digest = sha(token);
    const purpose = confirming ? 'confirm' : 'reset';
    const findLink = db.prepare('SELECT account FROM email_links WHERE digest=? AND purpose=? AND expires>?');
    if (!findLink.get(digest, purpose, Date.now())) return send(res, 400, { error: invalidLink });
    if (!confirming && !validPassword(password)) return send(res, 400, { error: 'Пароль должен содержать от 8 до 128 символов.' });
    const salt = confirming ? null : randomBytes(16).toString('hex');
    const hashed = confirming ? null : (await hashPassword(password, salt, 64)).toString('hex');
    db.exec('BEGIN IMMEDIATE');
    try {
      const link = findLink.get(digest, purpose, Date.now());
      if (!link) {
        db.exec('ROLLBACK');
        return send(res, 400, { error: invalidLink });
      }
      if (confirming) {
        db.prepare('INSERT OR IGNORE INTO confirmed_emails(account) VALUES (?)').run(link.account);
      } else {
        db.prepare('UPDATE accounts SET salt=?, password=? WHERE id=?').run(salt, hashed, link.account);
        db.prepare('DELETE FROM sessions WHERE account=?').run(link.account);
        db.prepare('DELETE FROM devices WHERE account=?').run(link.account);
      }
      db.prepare('DELETE FROM email_links WHERE account=? AND purpose=?').run(link.account, purpose);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
    return send(res, 200, { ok: true });
  }

  if (route === '/api/account/profile') {
    if (!user) return send(res, 401, { error: 'Сначала войдите в аккаунт.' });
    const name = typeof body.name === 'string' ? body.name.trim() : null;
    if (name === null || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name)) {
      return send(res, 400, { error: 'Введите имя длиной до 80 символов.' });
    }
    db.prepare(`INSERT INTO account_profiles(account, display_name) VALUES(?, ?)
      ON CONFLICT(account) DO UPDATE SET display_name=excluded.display_name`).run(user.id, name);
    return send(res, 200, { name });
  }
  if (route === '/api/admin/sync') {
    const { accountId, enabled, days } = body;
    if (!Number.isSafeInteger(accountId) || accountId < 1 || typeof enabled !== 'boolean' || (enabled && !syncDurations.has(days))) {
      return send(res, 400, { error: 'Некорректный аккаунт или режим доступа.' });
    }
    if (!db.prepare('SELECT id FROM accounts WHERE id=?').get(accountId)) {
      return send(res, 404, { error: 'Аккаунт не найден.' });
    }
    const now = Date.now();
    const current = syncAccess(db.prepare('SELECT sync_granted_at, sync_expires_at FROM account_profiles WHERE account=?').get(accountId), now);
    const duration = days === null ? null : days * 86_400_000;
    const currentDuration = current.syncExpiresAt === null ? null : current.syncExpiresAt - current.syncGrantedAt;
    const syncGrantedAt = enabled ? (currentDuration === duration ? current.syncGrantedAt ?? now : now) : null;
    const syncExpiresAt = enabled && duration !== null ? syncGrantedAt + duration : null;
    db.prepare(`INSERT INTO account_profiles(account, sync_granted_at, sync_expires_at) VALUES(?, ?, ?)
      ON CONFLICT(account) DO UPDATE SET sync_granted_at=excluded.sync_granted_at, sync_expires_at=excluded.sync_expires_at`)
      .run(accountId, syncGrantedAt, syncExpiresAt);
    return send(res, 200, { syncGrantedAt, syncExpiresAt });
  }
  if (['/api/register', '/api/login', '/api/device/register', '/api/device/login'].includes(route)) {
    const email = normalizeEmail(body.email);
    const password = body.password;
    if (!validEmail(email) || !validPassword(password)) {
      return send(res, 400, { error: 'Проверьте адрес почты и пароль (от 8 до 128 символов).' });
    }
    if (!rate('auth:' + email, 8, 300_000) || !rate('ip:' + req.socket.remoteAddress, 40, 300_000)) {
      return send(res, 429, { error: 'Слишком много попыток. Попробуйте позже.' });
    }
    let account = db.prepare('SELECT * FROM accounts WHERE email=?').get(email);
    if (route.endsWith('/register')) {
      const salt = randomBytes(16).toString('hex');
      const digest = (await hashPassword(password, salt, 64)).toString('hex');
      const inserted = db.prepare('INSERT INTO accounts(email,salt,password) VALUES(?,?,?) ON CONFLICT(email) DO NOTHING').run(email, salt, digest);
      if (!inserted.changes) return send(res, 409, { error: 'Аккаунт с этой почтой уже существует.' });
      account = { id: inserted.lastInsertRowid };
      try { await createEmailLink(account.id, email, 'confirm'); }
      catch { console.error('Не удалось сохранить тестовое письмо подтверждения.'); }
    } else {
      const computed = await hashPassword(password, account?.salt ?? dummySalt, 64);
      if (!timingSafeEqual(computed, Buffer.from(account?.password ?? '00'.repeat(64), 'hex')) || !account
          || db.prepare('SELECT password FROM accounts WHERE id=?').get(account.id)?.password !== account.password) {
        return send(res, 401, { error: 'Неверная почта или пароль.' });
      }
    }
    if (user) db.prepare('DELETE FROM sessions WHERE digest=?').run(user.digest);
    if (desktop) {
      const record = db.prepare('SELECT display_name, sync_granted_at, sync_expires_at FROM account_profiles WHERE account=?').get(account.id);
      return send(res, 200, { ...profile({ ...record, email }), token: issue(account.id, 'desktop') });
    }
    cookie(res, issue(account.id, 'web'));
    return send(res, 200, { email });
  }
  if (route === '/api/logout' || route === '/api/device/logout') {
    if (user) db.prepare('DELETE FROM sessions WHERE digest=?').run(user.digest);
    if (!desktop) cookie(res, '');
    return send(res, 200, { ok: true });
  }
  if (route === '/api/device/start') {
    if (!rate('device:' + req.socket.remoteAddress, 25, 300_000)) return send(res, 429, { error: 'Слишком много запросов.' });
    db.prepare('DELETE FROM devices WHERE expires<=?').run(Date.now());
    db.prepare('DELETE FROM sessions WHERE expires<=?').run(Date.now());
    const deviceToken = secret();
    const code = randomBytes(5).toString('hex').toUpperCase();
    db.prepare('INSERT INTO devices(digest,code,expires) VALUES(?,?,?)').run(sha(deviceToken), code, Date.now() + deviceTtl);
    return send(res, 200, { deviceToken, code, expiresIn: deviceTtl / 1000 });
  }
  if (route === '/api/device/approve') {
    if (!user) return send(res, 401, { error: 'Сначала войдите в аккаунт.' });
    if (!rate('approve:' + user.id, 12, 300_000)) return send(res, 429, { error: 'Слишком много попыток.' });
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
    const result = db.prepare('UPDATE devices SET account=? WHERE code=? AND expires>? AND account IS NULL').run(user.id, code, Date.now());
    return send(res, result.changes ? 200 : 400, result.changes ? { ok: true } : { error: 'Код просрочен или уже использован.' });
  }
  if (route === '/api/device/poll') {
    const token = body.deviceToken;
    if (typeof token !== 'string' || !/^[\w-]{43}$/.test(token)) return send(res, 400, { error: 'Некорректный ключ входа.' });
    const digest = sha(token);
    const request = db.prepare('SELECT account FROM devices WHERE digest=? AND expires>?').get(digest, Date.now());
    if (!request) return send(res, 410, { error: 'Запрос на вход завершён. Попробуйте ещё раз.' });
    if (request.account === null) return send(res, 202, { pending: true });
    db.prepare('DELETE FROM devices WHERE digest=?').run(digest);
    const account = db.prepare('SELECT a.email, p.display_name, p.sync_granted_at, p.sync_expires_at FROM accounts a LEFT JOIN account_profiles p ON p.account=a.id WHERE a.id=?').get(request.account);
    return send(res, 200, { ...profile(account), token: issue(request.account, 'desktop') });
  }
  return send(res, 404, { error: 'Запрос не найден.' });
}

const server = createServer((req, res) => {
  handle(req, res).catch(error => {
    console.error(error);
    if (!res.headersSent) send(res, 500, { error: 'Не удалось выполнить запрос.' });
    else res.destroy();
  });
});
server.requestTimeout = 15_000;
server.listen(port, '127.0.0.1', () => {
  const loopback = 'http://127.0.0.1:' + server.address().port;
  origin = publicOrigin?.origin ?? loopback;
  console.log('X.Vex: ' + loopback);
});
