const KEY = "nero-login-round";

/** Round 1 ends in an expired session; round 2+ ends in a verification link. */
export function getRound(): number {
  if (typeof window === "undefined") return 1;
  return Number(window.sessionStorage.getItem(KEY) ?? "1");
}

export function advanceRound(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, String(getRound() + 1));
}