type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export function checkRateLimit(key: string, max = 50, windowMs = 60_000) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (current.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: max - current.count };
}
