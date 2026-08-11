import type { ReactNode } from "react";
import type { BrandContent } from "@/lib/cms-defaults";
import { DEFAULT_BRAND } from "@/lib/cms-defaults";

export function NeroShell({
  children,
  brand = DEFAULT_BRAND,
}: {
  children: ReactNode;
  brand?: BrandContent;
}) {
  const year = String(new Date().getFullYear());
  const footer1 = brand.footer1.replace("{year}", year);
  const footer2 = brand.footer2.replace("{year}", year);
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
      <footer className="pb-8 text-center text-[11px] text-muted-foreground">
        <p>{footer1}</p>
        <p className="mt-1">{footer2}</p>
      </footer>
    </div>
  );
}

export function NeroWordmark({
  small = false,
  text = DEFAULT_BRAND.wordmark,
}: {
  small?: boolean;
  text?: string;
}) {
  return (
    <h1
      className={
        small
          ? "text-center text-3xl font-bold tracking-tight text-primary"
          : "text-center text-5xl font-bold tracking-tight text-primary"
      }
    >
      {text}
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