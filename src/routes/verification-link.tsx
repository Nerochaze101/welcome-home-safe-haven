import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NeroCard, NeroShell, NeroWordmark } from "@/components/nero/Shell";
import { PrimaryButton } from "@/components/nero/PrimaryButton";
import { LoadingOverlay } from "@/components/nero/LoadingOverlay";

export const Route = createFileRoute("/verification-link")({
  head: () => ({
    meta: [
      { title: "Get your verification link — Nero" },
      { name: "description", content: "Request a one-time verification link to finish signing in to Nero." },
      { property: "og:title", content: "Get your verification link — Nero" },
      { property: "og:description", content: "Request a one-time verification link to finish signing in to Nero." },
    ],
  }),
  component: VerificationLinkPage,
});

function VerificationLinkPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <NeroShell>
      {loading && <LoadingOverlay label="Sending verification link…" />}
      <NeroWordmark small />
      <div className="mt-6">
        <NeroCard>
          <h2 className="text-[20px] leading-tight font-bold text-card-foreground">Last step: verify it's you</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Both codes were accepted. Request a one-time verification link and open it on this device to finish signing in to Nero.
          </p>

          <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
            <li>&middot; The link expires 10 minutes after it is sent.</li>
            <li>&middot; It can only be used once.</li>
          </ul>

          <div className="mt-5">
            <PrimaryButton
              type="button"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                window.setTimeout(() => navigate({ to: "/verification-sent" }), 5000);
              }}
            >
              {loading ? "Sending link…" : "Get verification link"}
            </PrimaryButton>
          </div>
        </NeroCard>
      </div>
    </NeroShell>
  );
}