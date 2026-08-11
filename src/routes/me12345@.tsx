import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  getAdminStatus,
  getSiteData,
  listEntries,
  clearEntries,
  savePageContent,
  saveBrand,
  setFavicon,
  unlockAdmin,
  lockAdmin,
  type AdminEntry,
} from "@/lib/cms.functions";
import {
  DEFAULT_BRAND,
  DEFAULT_CONTENT,
  PAGE_KEYS,
  type BrandContent,
  type PageContentMap,
  type PageKey,
} from "@/lib/cms-defaults";

export const Route = createFileRoute("/me12345@")({
  // SSR the gate — unauthenticated visitors never see the editor JSX.
  ssr: true,
  loader: async () => {
    const status = await getAdminStatus();
    if (!status.unlocked) return { unlocked: false as const };
    const [site, entries] = await Promise.all([getSiteData(), listEntries()]);
    return { unlocked: true as const, site, entries };
  },
  head: () => ({
    meta: [
      { title: "Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const data = Route.useLoaderData();
  return data.unlocked ? (
    <AdminDashboard
      brand={data.site.brand}
      content={data.site.content}
      entries={data.entries}
    />
  ) : (
    <UnlockGate />
  );
}

function UnlockGate() {
  const router = useRouter();
  const unlock = useServerFn(unlockAdmin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const res = await unlock({ data: { password } });
          setBusy(false);
          if (res.ok) router.invalidate();
          else setError("Incorrect password");
        }}
        className="w-full max-w-sm space-y-3 rounded-lg border border-border bg-card p-6"
      >
        <h1 className="text-lg font-semibold text-card-foreground">Admin</h1>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy || password.length < 1}
          className="h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

type Tab = "pages" | "brand" | "favicon" | "log";

function AdminDashboard({
  brand,
  content,
  entries,
}: {
  brand: BrandContent;
  content: PageContentMap;
  entries: AdminEntry[];
}) {
  const [tab, setTab] = useState<Tab>("pages");
  const router = useRouter();
  const lock = useServerFn(lockAdmin);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Nero CMS</h1>
          <button
            onClick={async () => {
              await lock();
              router.invalidate();
            }}
            className="rounded-md border border-input px-3 py-1.5 text-xs hover:bg-accent"
          >
            Lock
          </button>
        </div>
        <div className="mx-auto flex max-w-4xl gap-1 px-4">
          {(["pages", "brand", "favicon", "log"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-md px-3 py-2 text-sm ${
                tab === t
                  ? "border border-b-0 border-border bg-card font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "log" ? "Submissions" : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {tab === "pages" && <PagesEditor content={content} />}
        {tab === "brand" && <BrandEditor brand={brand} />}
        {tab === "favicon" && <FaviconEditor />}
        {tab === "log" && <SubmissionsPanel initial={entries} />}
      </main>
    </div>
  );
}

function PagesEditor({ content }: { content: PageContentMap }) {
  const [pageKey, setPageKey] = useState<PageKey>("login");
  const [fields, setFields] = useState<Record<string, string>>(
    () => content[pageKey] as unknown as Record<string, string>,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = useServerFn(savePageContent);
  const router = useRouter();

  useEffect(() => {
    setFields(content[pageKey] as unknown as Record<string, string>);
    setSaved(false);
  }, [pageKey, content]);

  const keys = Object.keys(DEFAULT_CONTENT[pageKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Page</label>
        <select
          value={pageKey}
          onChange={(e) => setPageKey(e.target.value as PageKey)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          {PAGE_KEYS.map((k) => (
            <option key={k} value={k}>
              /{k}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-5">
        {keys.map((k) => {
          const value = fields[k] ?? "";
          const long = value.length > 60 || k.toLowerCase().includes("body") || k.toLowerCase().includes("description");
          return (
            <div key={k} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{k}</label>
              {long ? (
                <textarea
                  rows={3}
                  value={value}
                  onChange={(e) => setFields({ ...fields, [k]: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none"
                />
              ) : (
                <input
                  value={value}
                  onChange={(e) => setFields({ ...fields, [k]: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                />
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={async () => {
              setSaving(true);
              await save({ data: { pageKey, content: fields } });
              setSaving(false);
              setSaved(true);
              router.invalidate();
            }}
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-xs text-muted-foreground">Saved.</span>}
        </div>
      </div>
    </div>
  );
}

function BrandEditor({ brand }: { brand: BrandContent }) {
  const [b, setB] = useState<BrandContent>(brand);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(saveBrand);
  const router = useRouter();

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-5">
      {(Object.keys(DEFAULT_BRAND) as Array<keyof BrandContent>).map((k) => (
        <div key={k} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{k}</label>
          <input
            value={b[k]}
            onChange={(e) => setB({ ...b, [k]: e.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
          />
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Use <code>{"{year}"}</code> in footer text to insert the current year.
      </p>
      <button
        onClick={async () => {
          setSaving(true);
          await save({ data: { brand: b as unknown as Record<string, string> } });
          setSaving(false);
          router.invalidate();
        }}
        disabled={saving}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save brand"}
      </button>
    </div>
  );
}

function FaviconEditor() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const upload = useServerFn(setFavicon);

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      <div>
        <p className="text-sm font-medium">Current favicon</p>
        <img
          src={`/favicon?v=${Date.now()}`}
          alt="Current favicon"
          className="mt-2 h-12 w-12 rounded border border-border bg-background"
        />
      </div>
      <label className="block text-sm">
        <span className="text-muted-foreground">Upload PNG, SVG, or ICO (max ~300KB)</span>
        <input
          type="file"
          accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/jpeg,image/webp"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            setMsg(null);
            try {
              const buf = await file.arrayBuffer();
              let bin = "";
              const bytes = new Uint8Array(buf);
              for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
              const base64 = btoa(bin);
              await upload({ data: { base64, mime: file.type || "image/png" } });
              setMsg("Favicon updated. Reload to see it in the browser tab.");
            } catch (err) {
              setMsg((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
          className="mt-2 block w-full text-sm"
        />
      </label>
      {busy && <p className="text-xs text-muted-foreground">Uploading…</p>}
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}

function SubmissionsPanel({ initial }: { initial: AdminEntry[] }) {
  const [entries, setEntries] = useState<AdminEntry[]>(initial);
  const refresh = useServerFn(listEntries);
  const clear = useServerFn(clearEntries);

  useEffect(() => {
    const id = window.setInterval(async () => {
      const next = await refresh();
      setEntries(next);
    }, 3000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Live login + code submissions (polling every 3s).
        </p>
        <button
          onClick={async () => {
            await clear();
            setEntries([]);
          }}
          className="rounded-md border border-input px-3 py-1.5 text-xs hover:bg-accent"
        >
          Clear
        </button>
      </div>
      {entries.length === 0 && (
        <p className="rounded-md border border-dashed border-input p-6 text-center text-sm text-muted-foreground">
          No submissions yet.
        </p>
      )}
      {entries.map((e) => (
        <div key={e.id} className="rounded-md border border-input bg-card p-4 text-sm">
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
  );
}