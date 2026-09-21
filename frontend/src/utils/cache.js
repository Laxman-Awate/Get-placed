// Tiny in-memory cache with TTL + in-flight dedup.
// Keeps page data alive across SPA navigations so going back
// shows stale data instantly instead of a loading spinner.

const store = new Map();
const inflight = new Map();

export const TTL = { PROFILE: 60000, DASHBOARD: 30000, READINESS: 30000, CALENDAR: 60000 };

export function peek(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return undefined;
  }
  return entry.data;
}

export async function cached(key, ttl, fetcher) {
  const hit = peek(key);
  if (hit !== undefined) return hit;
  if (inflight.has(key)) return inflight.get(key);
  const p = fetcher()
    .then((data) => {
      store.set(key, { data, expiry: Date.now() + ttl });
      inflight.delete(key);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });
  inflight.set(key, p);
  return p;
}

export function invalidate(...keys) {
  if (!keys.length) store.clear();
  else keys.forEach((k) => store.delete(k));
}
