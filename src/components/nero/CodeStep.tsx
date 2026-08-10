import { useState } from "react";
import { NeroCard, NeroShell, NeroWordmark } from "./Shell";
import { PrimaryButton } from "./PrimaryButton";
import { LoadingOverlay } from "./LoadingOverlay";

export function CodeStep({
  step,
  title,
  description,
  onSubmit,
  loadingLabel = "Verifying code…",
  delayMs = 5000,
}: {
  step: 1 | 2;
  title: string;
  description: string;
  onSubmit: (code: string) => void;
  loadingLabel?: string;
  delayMs?: number;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const valid = code.length === 6 || code.length === 8;

  return (
    <NeroShell>
      {loading && <LoadingOverlay label={loadingLabel} />}
      <NeroWordmark small />
      <div className="mt-6">
        <NeroCard>
          <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            Step {step} of 2
          </p>
          <h2 className="mt-2 text-[20px] leading-tight font-bold text-card-foreground">
            {title}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) {
                setError("Enter the 6 or 8 digit code.");
                return;
              }
              setError(null);
              setLoading(true);
              window.setTimeout(() => onSubmit(code), delayMs);
            }}
          >
            <input
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter code"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="h-12 w-full rounded-md border border-input bg-card px-4 text-center text-[20px] tracking-[0.4em] text-card-foreground placeholder:tracking-normal placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
            />
            {error && <p className="text-[13px] text-destructive">{error}</p>}
            <PrimaryButton type="submit" disabled={!valid || loading}>
              {loading ? "Please wait…" : "Continue"}
            </PrimaryButton>
          </form>

          <p className="mt-4 text-center text-[13px] text-brand-link">
            Didn't get a code?
          </p>
        </NeroCard>
      </div>
    </NeroShell>
  );
}