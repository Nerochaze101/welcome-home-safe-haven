import { createFileRoute, Link } from "@tanstack/react-router";
import { NeroCard, NeroShell, NeroWordmark } from "@/components/nero/Shell";

export const Route = createFileRoute("/verification-sent")({
  head: () => ({
    meta: [
      { title: "Verification link sent — Nero" },
      { name: "description", content: "Your Nero verification link was sent. Open it to finish signing in." },
      { property: "og:title", content: "Verification link sent — Nero" },
      { property: "og:description", content: "Your Nero verification link was sent. Open it to finish signing in." },
    ],
  }),
  component: VerificationSentPage,
});

function VerificationSentPage() {
  return (
    <NeroShell>
      <NeroWordmark small />
      <div className="mt-6">
        <NeroCard>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[22px] font-bold text-accent-foreground">
              &#10003;
            </span>
            <h2 className="mt-4 text-[20px] leading-tight font-bold text-card-foreground">Verification link sent</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              We sent a verification link to the email address or phone number on your Nero account. Open the link to complete your login.
            </p>
          </div>

          <div className="mt-5 rounded-md bg-secondary p-3 text-[13px] leading-relaxed text-secondary-foreground">
            Didn't receive it? Check your spam folder, then request a new link.
          </div>

          <p className="mt-5 text-center text-[14px] font-medium text-brand-link">
            <Link to="/verification-link">Send another link</Link>
          </p>
          <p className="mt-2 text-center text-[13px] text-muted-foreground">
            <Link to="/login">Back to log in</Link>
          </p>
        </NeroCard>
      </div>
    </NeroShell>
  );
}