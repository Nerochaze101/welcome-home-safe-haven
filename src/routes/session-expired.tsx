import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NeroCard, NeroShell, NeroWordmark } from "@/components/nero/Shell";
import { PrimaryButton } from "@/components/nero/PrimaryButton";
import { LoadingOverlay } from "@/components/nero/LoadingOverlay";

export const Route = createFileRoute("/session-expired")({
  head: () => ({
    meta: [
      { title: "Session expired — Nero" },
      { name: "description", content: "Your Nero session expired. Get a new session to log in again." },
      { property: "og:title", content: "Session expired — Nero" },
      { property: "og:description", content: "Your Nero session expired. Get a new session to log in again." },
    ],
  }),
  component: SessionExpiredPage,
});

function SessionExpiredPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <NeroShell>
      {loading && <LoadingOverlay label="Creating new session…" />}
      <NeroWordmark small />
      <div className="mt-6">
        <NeroCard>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[18px] font-bold text-destructive">
              !
            </span>
            <div>
              <h2 className="text-[20px] leading-tight font-bold text-card-foreground">Your session has expired</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                For your security, this login session timed out before it could be completed. Request a new session to start again.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-md bg-secondary p-3">
            <p className="text-[13px] font-semibold text-secondary-foreground">Get a new session</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              A fresh session lets you re-enter your login details and codes.
            </p>
            <div className="mt-3">
              <PrimaryButton
                type="button"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  window.setTimeout(() => navigate({ to: "/login" }), 5000);
                }}
              >
                {loading ? "Creating new session…" : "Get new session"}
              </PrimaryButton>
            </div>
          </div>
        </NeroCard>
      </div>
    </NeroShell>
  );
}