// Persistent cache with TTL + in-flight dedup + stale-while-revalidate.
// Previous version was in-memory only, so EVERY full page reload refetched
// everything (dashboard fires 5-6 parallel requests). This version persists
// to localStorage so reloads render instantly from cache, then revalidate
// in the background.

const store = new Map();
const inflight = new Map();
const listeners = new Map();

export const TTL = {
  PROFILE: 5 * 60 * 1000,
  DASHBOARD: 2 * 60 * 1000,
  READINESS: 2 * 60 * 1000,
  CALENDAR: 5 * 60 * 1000,
  LEARNING: 10 * 60 * 1000,
  COMPANIES: 10 * 60 * 1000,
  CODING: 5 * 60 * 1000,
  DSA: 5 * 60 * 1000,
  APTITUDE: 10 * 60 * 1000,
  MOCK: 5 * 60 * 1000,
  INTERVIEWS: 10 * 60 * 1000,
  RESUME: 10 * 60 * 1000,
  ROADMAP: 10 * 60 * 1000,
};

function storageKey(key) {
  return `placepro.cache.${key}`;
}

function readPersisted(key) {
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.expiry !== 'number') return undefined;
    if (Date.now() > parsed.expiry) {
      window.localStorage.removeItem(storageKey(key));
      return undefined;
    }
    return parsed.data;
  } catch {
    return undefined;
  }
}

function writePersisted(key, data, ttl) {
  try {
    window.localStorage.setItem(
      storageKey(key),
      JSON.stringify({ data, expiry: Date.now() + ttl })
    );
  } catch {
    // Quota exceeded or private mode — in-memory cache still works.
  }
}

export function peek(key) {
  const entry = store.get(key);
  if (entry) {
    if (Date.now() > entry.expiry) {
      store.delete(key);
    } else {
      return entry.data;
    }
  }
  const persisted = readPersisted(key);
  if (persisted !== undefined) {
    return persisted;
  }
  return undefined;
}

export async function cached(key, ttl, fetcher) {
  const hit = peek(key);
  if (hit !== undefined) return hit;
  if (inflight.has(key)) return inflight.get(key);
  const p = fetcher()
    .then((data) => {
      store.set(key, { data, expiry: Date.now() + ttl });
      writePersisted(key, data, ttl);
      inflight.delete(key);
      emit(key, data);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });
  inflight.set(key, p);
  return p;
}

/**
 * Stale-while-revalidate: returns stale data instantly (even past TTL
 * by `staleFor`), then refreshes in background and notifies subscribers.
 * This is what kills the "every reload shows spinners" problem.
 */
export async function cachedStale(key, ttl, fetcher, staleFor = 24 * 60 * 60 * 1000) {
  // Fresh hit — return immediately, no background fetch needed.
  const fresh = peek(key);
  if (fresh !== undefined) return fresh;

  // Try expired-but-usable persisted value for instant render.
  let stale;
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Date.now() - parsed.expiry < staleFor) {
        stale = parsed.data;
      }
    }
  } catch {
    stale = undefined;
  }

  if (inflight.has(key)) {
    return stale !== undefined ? stale : inflight.get(key);
  }

  const p = fetcher()
    .then((data) => {
      store.set(key, { data, expiry: Date.now() + ttl });
      writePersisted(key, data, ttl);
      inflight.delete(key);
      emit(key, data);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      if (stale !== undefined) return stale;
      throw err;
    });
  inflight.set(key, p);

  if (stale !== undefined) return stale;
  return p;
}

export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key)?.delete(fn);
}

function emit(key, data) {
  listeners.get(key)?.forEach((fn) => {
    try {
      fn(data);
    } catch {
      // ignore subscriber errors
    }
  });
}

export function invalidatePrefix(prefix) {
  const storagePrefix = storageKey(prefix);
  for (const key of [...store.keys()]) {
    if (key.startsWith(prefix)) store.delete(key);
  }
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(storagePrefix))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export function invalidate(...keys) {
  if (!keys.length) {
    store.clear();
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith('placepro.cache.'))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // ignore
    }
  } else {
    keys.forEach((k) => {
      store.delete(k);
      try {
        window.localStorage.removeItem(storageKey(k));
      } catch {
        // ignore
      }
    });
  }
}
