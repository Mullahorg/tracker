import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { checkLogin, SESSION_KEY } from "@/lib/prop-store";
import { usePropStore } from "@/components/prop/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · Sentinel" },
      { name: "description", content: "Sign in to the Sentinel console with your one-time password." },
      { property: "og:title", content: "Sign in · Sentinel" },
      { property: "og:description", content: "Sentinel console sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { config } = usePropStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (checkLogin(code)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      navigate({ to: "/dashboard" });
    } else {
      setError(true);
      setCode("");
    }
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={submit}>
        <div className="brand big">
          {config.favicon ? <img src={config.favicon} alt="" /> : <span className="brand-dot" />}
          {config.appName}
        </div>
        <h1>Welcome back</h1>
        <p className="muted">Enter your one-time password to continue.</p>
        <label className="field">
          <span>One-time password</span>
          <input type="password" autoFocus value={code} onChange={(e) => { setCode(e.target.value); setError(false); }} placeholder="••••••••" />
        </label>
        {error && <p className="error">Incorrect password. Try again.</p>}
        <button className="btn primary full" type="submit" disabled={!code}>Sign in</button>
      </form>
    </main>
  );
}
