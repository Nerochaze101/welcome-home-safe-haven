"use client";
import React, { useState } from "react";

export default function Login2(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Replace with real authentication logic / API call
    setMessage("This is a placeholder help login. Wire it to your auth flow.");
    console.log("Login submitted", { email });
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h1>Help — Login</h1>
      <p>
        This is a simple, accessible placeholder login component for help/testing purposes. Replace the
        submit handler with your authentication flow (API call, Firebase, NextAuth, etc.).
      </p>

      <form onSubmit={handleSubmit} aria-label="help-login-form">
        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="email" style={{ display: "block", fontWeight: 600 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="password" style={{ display: "block", fontWeight: 600 }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: "0.6rem 1rem", fontSize: "1rem", cursor: "pointer" }}
        >
          Sign in
        </button>
      </form>

      {message && (
        <div role="status" style={{ marginTop: "1rem", color: "#0366d6" }}>
          {message}
        </div>
      )}

      <section style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: "#555" }}>
        <h2 style={{ fontSize: "1rem" }}>Notes</h2>
        <ul>
          <li>Replace this placeholder with your real auth/API integration.</li>
          <li>Ensure secure handling of credentials and use HTTPS for network requests.</li>
          <li>Consider using existing auth libraries (NextAuth, Firebase, etc.) if applicable.</li>
        </ul>
      </section>
    </main>
  );
}
