import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KDF = Object.freeze({ algorithm: 'scrypt', N: 131072, r: 8, p: 1 });
const MAXMEM = 256 * 1024 * 1024;
const KEY_BYTES = 64;
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const USERNAME = /^[a-z0-9][a-z0-9._-]{2,63}$/;
const MAX_ACCOUNTS = 256;
const digest = value => createHash('sha256').update(value).digest('hex');
const ownObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const hasOnly = (value, names) => Object.keys(value).every(name => names.includes(name));
const safeDuration = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;

function decode(value, size) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Invalid password record.');
  const bytes = Buffer.from(value, 'base64url');
  if (bytes.length !== size || bytes.toString('base64url') !== value) throw new Error('Invalid password record.');
  return bytes;
}

function passwordRecord(record) {
  if (!ownObject(record) || !hasOnly(record, ['algorithm', 'N', 'r', 'p', 'salt', 'hash']) ||
      record.algorithm !== KDF.algorithm || record.N !== KDF.N || record.r !== KDF.r || record.p !== KDF.p) throw new Error('Invalid password record.');
  return { salt: decode(record.salt, 32), hash: decode(record.hash, KEY_BYTES) };
}

function passwordBytes(password, creating = false) {
  if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > 256 ||
      !password.isWellFormed() || /[\u0000-\u001f\u007f]/u.test(password) || (creating && [...password].length < 20)) throw new Error('Invalid password.');
  return Buffer.from(password, 'utf8');
}

/** Fixed-cost scrypt. Only this validated record format is accepted by verification. */
export async function derivePassword(password, salt) {
  const input = passwordBytes(password, true);
  try {
    if (salt !== undefined && typeof salt !== 'string' && !(salt instanceof Uint8Array)) throw new Error('Invalid password salt.');
    const saltBytes = salt === undefined ? randomBytes(32) : typeof salt === 'string' ? decode(salt, 32) : Buffer.from(salt);
    if (saltBytes.length !== 32) throw new Error('Invalid password salt.');
    const hash = await scryptAsync(input, saltBytes, KEY_BYTES, { N: KDF.N, r: KDF.r, p: KDF.p, maxmem: MAXMEM });
    const record = { ...KDF, salt: saltBytes.toString('base64url'), hash: hash.toString('base64url') };
    hash.fill(0);
    return record;
  } finally { input.fill(0); }
}

/** Call with the server's precomputed dummy record for unknown accounts, too. */
export async function verifyPassword(password, record) {
  let input;
  try {
    const parsed = passwordRecord(record);
    input = passwordBytes(password);
    const actual = await scryptAsync(input, parsed.salt, KEY_BYTES, { N: KDF.N, r: KDF.r, p: KDF.p, maxmem: MAXMEM });
    try { return timingSafeEqual(actual, parsed.hash); }
    finally { actual.fill(0); parsed.hash.fill(0); }
  } catch { return false; }
  finally { input?.fill(0); }
}

/** Reject malformed/ambiguous account configuration before opening the HTTP listener. */
export function validateUsers(data) {
  if (!ownObject(data) || !hasOnly(data, ['version', 'users']) || data.version !== 1 || !Array.isArray(data.users) || data.users.length > MAX_ACCOUNTS) throw new Error('Invalid account configuration.');
  const names = new Set();
  return data.users.map(user => {
    if (!ownObject(user) || !hasOnly(user, ['username', 'password', 'enabled', 'expiresAt']) ||
        typeof user.username !== 'string' || !USERNAME.test(user.username) || names.has(user.username) ||
        typeof user.enabled !== 'boolean' || typeof user.expiresAt !== 'string') throw new Error('Invalid account configuration.');
    const date = Date.parse(user.expiresAt);
    if (!Number.isFinite(date) || new Date(date).toISOString() !== user.expiresAt) throw new Error('Invalid account configuration.');
    passwordRecord(user.password);
    names.add(user.username);
    return Object.freeze({ username: user.username, password: Object.freeze({ ...user.password }), enabled: user.enabled, expiresAt: user.expiresAt });
  });
}

/** In-memory sessions store only a token digest; restart invalidates every session. */
export class SessionStore {
  #sessions = new Map();
  #now;
  #idleMs;
  #absoluteMs;
  #maxSessions;
  constructor({ now = Date.now, idleMs = 1800000, absoluteMs = 28800000, maxSessions = 1024 } = {}) {
    if (typeof now !== 'function' || !safeDuration(idleMs, 1, 28800000) || !safeDuration(absoluteMs, idleMs, 86400000) || !safeDuration(maxSessions, 1, 65536)) throw new Error('Invalid session configuration.');
    this.#now = now; this.#idleMs = idleMs; this.#absoluteMs = absoluteMs; this.#maxSessions = maxSessions;
  }
  #clock() {
    const value = this.#now();
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid session clock.');
    return value;
  }
  #prune(now) {
    for (const [key, value] of this.#sessions) if (now < value.createdAt || now >= value.expiresAt || now >= value.idleExpiresAt) this.#sessions.delete(key);
  }
  create(username) {
    if (typeof username !== 'string' || !USERNAME.test(username)) throw new Error('Invalid account.');
    const now = this.#clock();
    this.#prune(now);
    // Bound memory without silently invalidating another recipient's active session.
    if (this.#sessions.size >= this.#maxSessions) throw new Error('Session capacity reached.');
    const token = randomBytes(32).toString('base64url');
    const record = { username, csrf: randomBytes(32).toString('base64url'), createdAt: now, lastSeenAt: now, expiresAt: now + this.#absoluteMs, idleExpiresAt: now + this.#idleMs };
    this.#sessions.set(digest(token), record);
    return Object.freeze({ token, ...record });
  }
  get(token) {
    if (typeof token !== 'string' || !TOKEN.test(token)) return null;
    const now = this.#clock();
    const key = digest(token), record = this.#sessions.get(key);
    if (!record) return null;
    if (now < record.lastSeenAt || now >= record.expiresAt || now >= record.idleExpiresAt) { this.#sessions.delete(key); return null; }
    record.lastSeenAt = now;
    record.idleExpiresAt = Math.min(record.expiresAt, now + this.#idleMs);
    return Object.freeze({ ...record });
  }
  delete(token) { return typeof token === 'string' && TOKEN.test(token) ? this.#sessions.delete(digest(token)) : false; }
  clear() { this.#sessions.clear(); }
}

/** Fixed-window counters; unknown keys fail closed when the bounded map is full. */
export class Limiter {
  #keys = new Map();
  #now;
  #windowMs;
  #maxKeys;
  #lastNow = 0;
  constructor({ now = Date.now, windowMs = 900000, maxKeys = 4096 } = {}) {
    if (typeof now !== 'function' || !safeDuration(windowMs, 1, 86400000) || !safeDuration(maxKeys, 1, 65536)) throw new Error('Invalid limiter configuration.');
    this.#now = now; this.#windowMs = windowMs; this.#maxKeys = maxKeys;
  }
  take(key, limit) {
    if (typeof key !== 'string' || !key || key.length > 256 || !safeDuration(limit, 1, 1000000)) return false;
    const now = this.#now();
    if (!Number.isSafeInteger(now) || now < this.#lastNow || now < 0) return false;
    this.#lastNow = now;
    let record = this.#keys.get(key);
    if (record && now >= record.resetAt) { this.#keys.delete(key); record = undefined; }
    if (!record) {
      if (this.#keys.size >= this.#maxKeys) {
        for (const [oldKey, old] of this.#keys) if (now >= old.resetAt) this.#keys.delete(oldKey);
        if (this.#keys.size >= this.#maxKeys) return false;
      }
      record = { count: 0, resetAt: now + this.#windowMs };
      this.#keys.set(key, record);
    }
    if (record.count >= limit) return false;
    record.count++;
    return true;
  }
}
