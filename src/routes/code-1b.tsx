import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CodeStep } from "@/components/nero/CodeStep";

export const Route = createFileRoute("/code-1b")({
  head: () => ({
    meta: [
      { title: "Verify your identity — Nero" },
      { name: "description", content: "Enter the fresh 6 or 8 digit code sent to your registered contact to verify your Nero identity." },
      { property: "og:title", content: "Verify your identity — Nero" },
      { property: "og:description", content: "Enter the fresh 6 or 8 digit code sent to your registered contact to verify your Nero identity." },
    ],
  }),
  component: CodeOneBPage,
});

function CodeOneBPage() {
  const navigate = useNavigate();
  return (
    <CodeStep
      step={1}
      title="Verify your identity"
      description="For extra security we've sent a fresh 6 or 8 digit code to your registered contact. Enter it to continue."
      onSubmit={() => navigate({ to: "/code-2b" })}
    />
  );
}