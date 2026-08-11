"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionExpired(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page and include the current path as `next` so the app can return afterwards
    try {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/login-2?next=${next}`);
    } catch (err) {
      // If router.replace or window access fails for any reason, do nothing — user can click the link.
      console.error(err);
    }
  }, [router]);

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h1>Session expired</h1>
      <p>Your session has expired. Redirecting you to the login page…</p>
      <p>
        If you are not redirected automatically, <a href="/login-2">click here to sign in</a>.
      </p>
    </main>
  );
}
