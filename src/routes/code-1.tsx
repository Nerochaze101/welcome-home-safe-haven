import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CodeStep } from "@/components/nero/CodeStep";

export const Route = createFileRoute("/code-1")({
  head: () => ({
    meta: [
      { title: "Enter login code — Nero" },
      { name: "description", content: "Enter the first 6 or 8 digit login code to continue to Nero." },
      { property: "og:title", content: "Enter login code — Nero" },
      { property: "og:description", content: "Enter the first 6 or 8 digit login code to continue to Nero." },
    ],
  }),
  component: CodeOnePage,
});

function CodeOnePage() {
  const navigate = useNavigate();
  return (
    <CodeStep
      step={1}
      title="Enter your login code"
      description="We sent a 6 or 8 digit code to the contact on your Nero account. Enter it below to keep going."
      onSubmit={() => navigate({ to: "/code-2" })}
    />
  );
}