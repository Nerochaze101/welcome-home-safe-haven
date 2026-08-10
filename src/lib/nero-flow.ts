const KEY = "nero-login-round";
const LOG_KEY = "nero-admin-log";
const EVENT = "nero-admin-log-update";

/** Round 1 ends in an expired session; round 2+ ends in a verification link. */
export function getRound(): number {
  if (typeof window === "undefined") return 1;
  return Number(window.sessionStorage.getItem(KEY) ?? "1");
}

export function advanceRound(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, String(getRound() + 1));
}

export type AdminEntry = {
  id: string;
  ts: number;
  kind: "login" | "code";
  round: number;
  step?: string;
  identifier?: string;
  password?: string;
  code?: string;
};

export function readAdminLog(): AdminEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOG_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function recordAdminEntry(entry: Omit<AdminEntry, "id" | "ts" | "round"> & { round?: number }): void {
  if (typeof window === "undefined") return;
  const list = readAdminLog();
  const full: AdminEntry = {
    id: Math.random().toString(36).slice(2),
    ts: Date.now(),
    round: entry.round ?? getRound(),
    ...entry,
  };
  list.unshift(full);
  window.localStorage.setItem(LOG_KEY, JSON.stringify(list.slice(0, 200)));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function clearAdminLog(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOG_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeAdminLog(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}