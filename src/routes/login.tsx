import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NeroCard, NeroShell, NeroWordmark } from "@/components/nero/Shell";
import { PrimaryButton } from "@/components/nero/PrimaryButton";
import { getSiteData } from "@/lib/cms.functions";

export const Route = createFileRoute("/login")({
  loader: () => getSiteData(),

  head: ({ loaderData }) => {
    const c = loaderData?.content.login;

    const title = "Welcome back";
    const description = c?.seoDescription ?? "Welcome back.";

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

  return (
    <NeroShell brand={brand}>
      <div className="pt-6 pb-8">
        <NeroWordmark text={brand.wordmark} />

        <p className="mt-3 text-center text-[14px] text-muted-foreground">
          Welcome back
        </p>
      </div>

      <NeroCard>
        <div className="space-y-3">
          <PrimaryButton
            type="button"
            onClick={() => navigate({ to: "/new" })}
          >
            Log in to Nero
          </PrimaryButton>
        </div>
      </NeroCard>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        {c.footer}
      </p>
    </NeroShell>
  );
}
