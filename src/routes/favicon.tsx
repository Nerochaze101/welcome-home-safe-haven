import { createFileRoute } from "@tanstack/react-router";

// Serves the current favicon bytes from the CMS. Falls back to a
// transparent 1x1 PNG when nothing is set. Cache-busted by ?v= in root head.
const FALLBACK_PNG = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  ),
  (c) => c.charCodeAt(0),
);

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export const Route = createFileRoute("/favicon")({
  server: {
    handlers: {
      GET: async () => {
        const { externalSupabase } = await import("@/lib/external-supabase.server");
        const { data } = await externalSupabase
          .from("site_settings")
          .select("favicon_b64, favicon_mime")
          .eq("id", 1)
          .maybeSingle();
        const b64 = data?.favicon_b64 as string | undefined;
        const mime = (data?.favicon_mime as string | undefined) ?? "image/png";
        const bytes = b64 ? base64ToBytes(b64) : FALLBACK_PNG;
        return new Response(bytes, {
          headers: {
            "content-type": mime,
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});