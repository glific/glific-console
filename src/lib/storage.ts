/** localStorage access that never throws (private mode, blocked storage, SSR-like test envs). */
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
    } catch {
      // Storage unavailable or full: the preference simply isn't persisted.
    }
  },
};
