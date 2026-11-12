// localStorage throws in private mode and when storage is blocked; preferences just aren't persisted then.
export const safeStorage = {
  get(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {}
  },
  remove(key: string): void {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {}
  },
};
