import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nero" },
      { name: "description", content: "Log in to Nero to continue." },
      { property: "og:title", content: "Nero" },
      { property: "og:description", content: "Log in to Nero to continue." },
    ],
  }),
  component: () => <Navigate to="/login" />,
});
