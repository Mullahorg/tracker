import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { SESSION_KEY } from "@/lib/prop-store";
import { usePropStore } from "./store";

export function Shell({ children }: { children: ReactNode }) {
  const { config } = usePropStore();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== "1") navigate({ to: "/" });
    else setAllowed(true);
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB"));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [navigate]);

  if (!allowed) return null;

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/dashboard" className="brand">
          {config.favicon ? <img src={config.favicon} alt="" /> : <span className="brand-dot" />}
          {config.appName}
        </Link>
        <nav>
          <Link to="/dashboard" activeProps={{ className: "active" }}>Tools</Link>
          <Link to="/scenario" activeProps={{ className: "active" }}>Scenarios</Link>
          <Link to="/admin" activeProps={{ className: "active" }}>Admin</Link>
        </nav>
        <span className="clock">{clock}</span>
        <button
          className="icon-btn"
          aria-label="Log out"
          onClick={() => {
            sessionStorage.removeItem(SESSION_KEY);
            navigate({ to: "/" });
          }}
        >
          <LogOut size={16} />
        </button>
      </header>
      <main className="page">{children}</main>
    </div>
  );
}
