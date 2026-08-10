import type { ReactNode } from "react";

export function NeroShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
      <footer className="pb-8 text-center text-[11px] text-muted-foreground">
        <p>Nero &middot; Nerochaze</p>
        <p className="mt-1">Nero &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export function NeroWordmark({ small = false }: { small?: boolean }) {
  return (
    <h1
      className={
        small
          ? "text-center text-3xl font-bold tracking-tight text-primary"
          : "text-center text-5xl font-bold tracking-tight text-primary"
      }
    >
      Nero
    </h1>
  );
}

export function NeroCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      {children}
    </div>
  );
}