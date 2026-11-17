import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { mkdtempSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

test('browser account authorizes a single desktop session', { timeout: 15_000 }, async (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'xvex-test-'));
  const outbox = join(directory, 'mail');
  const env = { ...process.env, PORT: '0', XVEX_DATABASE: join(directory, 'accounts.sqlite'), XVEX_MAIL_OUTBOX: outbox };
  const child = spawn(process.execPath, ['server.mjs'], {
    env,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = new Promise(resolve => child.once('exit', resolve));
      child.kill();
      await exited;
    }
    rmSync(directory, { recursive: true });
  });
  const lines = createInterface({ input: child.stdout });
  const started = await new Promise((resolve, reject) => {
    lines.once('line', resolve);
    child.once('error', reject);
    child.once('exit', code => reject(new Error('Server exited: ' + code)));
  });
  const origin = started.replace('X.Vex: ', '');
  const desktopOrigin = 'http://127.0.0.1:1420';
  const post = (route, body, headers = {}) => fetch(origin + '/api/' + route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, ...headers },
    body: JSON.stringify(body),
  });
  const email = 'preview@example.com';
  const password = 'Local!42';
  assert.equal((await post('register', { email, password: 'Local!4' })).status, 400);
  const registration = await post('register', { email, password });
  assert.equal(registration.status, 200);
  assert.match(registration.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  assert.equal((await post('login', { email, password: 'different-password' })).status, 401);
  const login = await post('login', { email, password });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  assert.equal((await post('device/start', {}, { Origin: 'https://other.example' })).status, 403);
  const options = await fetch(origin + '/api/device/start', { method: 'OPTIONS', headers: { Origin: desktopOrigin } });
  assert.equal(options.headers.get('access-control-allow-origin'), desktopOrigin);
  const desktop = { Origin: desktopOrigin };
  const { deviceToken, code } = await (await post('device/start', {}, desktop)).json();
  assert.equal((await post('device/poll', { deviceToken }, desktop)).status, 202);
  assert.equal((await post('device/approve', { code })).status, 401);
  assert.equal((await post('device/approve', { code }, { Cookie: cookie })).status, 200);
  const authorization = await (await post('device/poll', { deviceToken }, desktop)).json();
  assert.equal(authorization.email, email);
  assert.equal((await post('device/poll', { deviceToken }, desktop)).status, 410);
  const bearer = { ...desktop, Authorization: 'Bearer ' + authorization.token };
  const profile = () => fetch(origin + '/api/device/account', { headers: bearer }).then(result => result.json());
  assert.equal((await profile()).email, email);
  const get = (route, sessionCookie) => fetch(origin + '/api/' + route, {
    headers: sessionCookie ? { Cookie: sessionCookie } : {},
  });
  const readCookie = response => response.headers.get('set-cookie').split(';')[0];
  assert.equal((await get('admin/accounts')).status, 401);
  assert.equal((await get('admin/accounts', cookie)).status, 403);
  assert.equal((await post('admin/sync', { accountId: 1, enabled: true }, { Cookie: cookie })).status, 403);
  assert.equal((await post('account/profile', { name: 'Тестовый пользователь', admin: true }, { Cookie: cookie })).status, 200);
  assert.equal((await profile()).name, 'Тестовый пользователь');
  assert.equal((await (await get('account', cookie)).json()).admin, false);

  const ownerEmail = 'owner@example.com';
  const ownerCookie = readCookie(await post('register', { email: ownerEmail, password }));
  execFileSync(process.execPath, ['server.mjs', '--grant-admin', ownerEmail], { env });
  assert.equal((await get('admin/accounts', ownerCookie)).status, 401);
  const adminCookie = readCookie(await post('login', { email: ownerEmail, password }));
  const { accounts } = await (await get('admin/accounts', adminCookie)).json();
  assert.equal(accounts.length, 2);
  const member = accounts.find(entry => entry.email === email);
  assert.deepEqual(Object.keys(member).sort(), ['admin', 'email', 'id', 'name', 'syncExpiresAt', 'syncGrantedAt']);
  const setSync = (enabled, days = null, headers = {}) => post('admin/sync', { accountId: member.id, enabled, days }, { Cookie: adminCookie, ...headers });
  assert.equal((await setSync(true, 1, { Origin: 'https://other.example' })).status, 403);
  assert.equal((await setSync('true')).status, 400);
  assert.equal((await setSync(true, -1)).status, 400);
  assert.equal((await profile()).syncGrantedAt, null);
  const grant = await (await setSync(true, 1)).json();
  assert.ok(Number.isSafeInteger(grant.syncGrantedAt));
  assert.equal(grant.syncExpiresAt - grant.syncGrantedAt, 86_400_000);
  assert.equal((await profile()).syncGrantedAt, grant.syncGrantedAt);
  assert.deepEqual(await (await setSync(true, 1)).json(), grant);
  const sync = (body, device = bearer) => post("device/sync", { name: "Работа", ...body }, device);
  assert.equal((await sync({}, desktop)).status, 401);
  assert.equal((await sync({}, { ...bearer, Origin: "https://other.example" })).status, 403);
  assert.deepEqual(await (await sync({})).json(), { revision: 0, contents: null });
  const first = [{ id: "note", title: "Запись 🖤", kind: "note", parentId: null, content: "С компьютера" }];
  assert.deepEqual(await (await sync({ revision: 0, contents: first })).json(), { revision: 1 });
  const android = { Origin: "http://tauri.localhost" };
  const secondSession = await (await post("device/login", { email, password }, android)).json();
  const phone = { ...android, Authorization: "Bearer " + secondSession.token };
  assert.deepEqual(await (await sync({}, phone)).json(), { revision: 1, contents: first });
  const second = [{ ...first[0], content: "С телефона" }];
  assert.equal((await sync({ revision: 0, contents: second }, phone)).status, 409);
  assert.deepEqual(await (await sync({ revision: 1, contents: second }, phone)).json(), { revision: 2 });
  assert.deepEqual(await (await sync({})).json(), { revision: 2, contents: second });
  const ownerId = accounts.find(entry => entry.email === ownerEmail).id;
  await post("admin/sync", { accountId: ownerId, enabled: true, days: null }, { Cookie: adminCookie });
  const isolatedSession = await (await post("device/login", { email: ownerEmail, password }, desktop)).json();
  assert.deepEqual(await (await sync({}, { ...desktop, Authorization: "Bearer " + isolatedSession.token })).json(),
    { revision: 0, contents: null });
  const database = new DatabaseSync(env.XVEX_DATABASE);
  database.prepare('UPDATE account_profiles SET sync_expires_at=? WHERE account=?').run(Date.now() - 1, member.id);
  database.close();
  assert.equal((await profile()).syncGrantedAt, null);
  assert.equal((await sync({}, phone)).status, 403);
  const permanentGrant = await (await setSync(true)).json();
  assert.ok(Number.isSafeInteger(permanentGrant.syncGrantedAt));
  assert.equal(permanentGrant.syncExpiresAt, null);
  assert.equal((await setSync(false)).status, 200);
  assert.equal((await profile()).syncGrantedAt, null);
  assert.equal((await post('device/logout', {}, bearer)).status, 200);
  assert.equal((await profile()).email, null);

  const directEmail = 'desktop@example.com';
  assert.equal((await post('device/register', { email: directEmail, password }, { Origin: 'https://other.example' })).status, 403);
  const directRegistration = await post('device/register', { email: directEmail, password }, desktop);
  assert.equal(directRegistration.status, 200);
  assert.equal(directRegistration.headers.get('set-cookie'), null);
  const directSession = await directRegistration.json();
  assert.equal(directSession.email, directEmail);
  assert.match(directSession.token, /^[\w-]{43}$/);
  assert.equal((await post('device/register', { email: directEmail, password }, desktop)).status, 409);
  assert.equal((await post('login', { email: directEmail, password })).status, 200);
  assert.equal((await post('device/login', { email, password: 'wrong-password' }, desktop)).status, 401);
  const nativeOrigin = { Origin: 'http://tauri.localhost' };
  const directLogin = await post('device/login', { email, password }, nativeOrigin);
  assert.equal(directLogin.status, 200);
  assert.equal(directLogin.headers.get('access-control-allow-origin'), nativeOrigin.Origin);
  assert.equal((await directLogin.json()).email, email);

  const mailToken = (recipient, route) => {
    const message = readdirSync(outbox).map(file => readFileSync(join(outbox, file), 'utf8'))
      .find(mail => mail.startsWith('Кому: ' + recipient + '\n') && mail.includes('/' + route + '#'));
    return message?.match(/#([\w-]{43})/)?.[1];
  };
  assert.equal((await post('password/request', { email })).status, 200);
  assert.equal(mailToken(email, 'reset-password'), undefined);
  const confirmation = mailToken(email, 'confirm-email');
  assert.ok(confirmation);
  assert.equal((await post('email/confirm', { token: confirmation })).status, 200);
  assert.equal((await post('email/confirm', { token: confirmation })).status, 400);
  assert.equal((await (await get('account', cookie)).json()).emailConfirmed, true);
  assert.deepEqual(await (await post('password/request', { email: 'missing@example.com' })).json(), { ok: true });
  assert.deepEqual(await (await post('password/request', { email })).json(), { ok: true });
  const reset = mailToken(email, 'reset-password');
  assert.ok(reset);
  const changedPassword = 'Changed!42';
  assert.equal((await post('password/reset', { token: reset, password: changedPassword })).status, 200);
  assert.equal((await post('password/reset', { token: reset, password: changedPassword })).status, 400);
  assert.equal((await (await get('account', cookie)).json()).email, null);
  assert.equal((await post('login', { email, password })).status, 401);
  assert.equal((await post('login', { email, password: changedPassword })).status, 200);
});
