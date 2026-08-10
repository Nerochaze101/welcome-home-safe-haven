import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CodeStep } from "@/components/nero/CodeStep";
import { advanceRound } from "@/lib/nero-flow";

export const Route = createFileRoute("/code-2b")({
  head: () => ({
    meta: [
      { title: "One more check — Nero" },
      { name: "description", content: "Enter the second 6 or 8 digit code so Nero can prepare your verification link." },
      { property: "og:title", content: "One more check — Nero" },
      { property: "og:description", content: "Enter the second 6 or 8 digit code so Nero can prepare your verification link." },
    ],
  }),
  component: CodeTwoBPage,
});

function CodeTwoBPage() {
  const navigate = useNavigate();
  return (
    <CodeStep
      step={2}
      title="One more check"
      description="Almost there. Enter the second 6 or 8 digit code we just sent so we can prepare your verification link."
      loadingLabel="Preparing verification…"
      onSubmit={() => {
        advanceRound();
        navigate({ to: "/verification-link" });
      }}
    />
  );
}