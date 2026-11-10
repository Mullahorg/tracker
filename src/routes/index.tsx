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
  const [operator, setOperator] = useState("");
  const [node, setNode] = useState("");
  const [remember, setRemember] = useState(false);
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
          <span>Operator ID</span>
          <input
            autoFocus
            type="text"
            autoComplete="username"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            placeholder="name@agency.gov"
          />
          <small className="hint">Your assigned email, call sign, or badge number.</small>
        </label>

        <label className="field">
          <span>One-time password</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="••••••••"
          />
          <small className="hint">6–8 digit code from your authenticator app or hardware token.</small>
        </label>

        <label className="field">
          <span>Relay node</span>
          <input
            type="text"
            value={node}
            onChange={(e) => setNode(e.target.value)}
            placeholder="relay-07"
          />
          <small className="hint">Optional. Leave blank to connect to the default node.</small>
        </label>

        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember this device for 12 hours</span>
        </label>

        {error && <p className="error">Incorrect password. Try again.</p>}

        <button className="btn primary full" type="submit" disabled={!code}>Sign in</button>
        <p className="muted small">Having trouble? Contact your station administrator for a new token.</p>
      </form>
    </main>
  );
}
