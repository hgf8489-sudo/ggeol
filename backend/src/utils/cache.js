/**
 * Simple in-memory TTL cache backed by a Map.
 * Good enough for a single-process server; swap for Redis when scaling.
 */
export class Cache {
  #store = new Map();
  #ttlMs;

  /** @param {number} ttlSeconds */
  constructor(ttlSeconds = 300) {
    this.#ttlMs = ttlSeconds * 1000;
  }

  get(key) {
    const entry = this.#store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.#store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value) {
    this.#store.set(key, { value, expiresAt: Date.now() + this.#ttlMs });
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.#store.delete(key);
  }

  /** Remove all expired entries (call periodically if memory is a concern). */
  purgeExpired() {
    const now = Date.now();
    for (const [key, entry] of this.#store) {
      if (now > entry.expiresAt) this.#store.delete(key);
    }
  }

  get size() {
    return this.#store.size;
  }
}

// Singleton instances — one per data type
const TTL = parseInt(process.env.CACHE_TTL ?? '300', 10);
export const analysisCache = new Cache(TTL);
export const searchCache = new Cache(60); // search results expire faster
