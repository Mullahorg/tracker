import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Archive, Bell, ChevronDown, Command, FileText, LayoutDashboard, LockKeyhole, MapPin, Menu, Radio, Search, Shield, Signal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAegis } from "./aegis-provider";

const navItems = [
  { to: "/dashboard" as const, label: "Command", icon: LayoutDashboard },
  { to: "/missions" as const, label: "Missions", icon: Activity },
  { to: "/admin" as const, label: "Admin panel", icon: Signal },
];

export function AegisShell({ children }: { children: ReactNode }) {
  const { synced } = useAegis();
  const [clock, setClock] = useState("--:--:-- UTC");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setClock(`${new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date())} UTC`);
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      if (event.key === "Escape") setHelpOpen(false);
      if (event.key.toLowerCase() === "g" && !(event.target instanceof HTMLInputElement)) navigate({ to: "/dashboard" });
      if (event.key === "?" && !(event.target instanceof HTMLInputElement)) setHelpOpen((open) => !open);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return (
    <div className="aegis-frame">
      <aside className="aegis-rail">
        <Link to="/dashboard" className="brand-lockup" aria-label="AEGIS X command center">
          <span className="brand-mark"><Shield size={18} strokeWidth={1.7} /></span>
          <span className="brand-text"><b>AEGIS <em>X</em></b><small>PROP SYSTEM</small></span>
        </Link>
        <div className="rail-section-label">OPERATIONS</div>
        <nav className="rail-nav" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="rail-link" activeProps={{ className: "rail-link is-active" }}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
            </Link>
          ))}
          <Link to="/reports/$id" params={{ id: "BRIEF-1142" }} className="rail-link"><FileText size={17} strokeWidth={1.8} /><span>Reports</span></Link>
        </nav>
        <div className="rail-spacer" />
        <div className="rail-status"><span className="status-lamp" /><span>SIMULATION READY</span></div>
        <div className="rail-disclaimer">FICTIONAL INTERFACE<br />NO REAL DATA OR CAPABILITIES</div>
        <Button variant="ghost" size="icon" className="shortcut-help" aria-label="Keyboard shortcuts" title="Keyboard shortcuts" onClick={() => setHelpOpen(true)}>?</Button>
      </aside>

      <div className="aegis-main-column">
        <header className="command-bar">
          <Button variant="ghost" size="icon" className="mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileMenu((open) => !open)}>{mobileMenu ? <X /> : <Menu />}</Button>
          <div className="command-title"><span className="command-eyebrow">COMMAND CENTER</span><span className="command-subtitle">CONTROL / <b>OVERVIEW</b></span></div>
          <label className="search-box" htmlFor="global-search"><Search size={15} /><Input id="global-search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && query.trim()) navigate({ to: "/missions" }); }} placeholder="Search missions, events…" aria-label="Search missions and events" /><kbd>⌘ K</kbd></label>
          <span className={`sync-indicator ${synced ? "is-synced" : ""}`} aria-live="polite"><span className="sync-dot" />{synced ? "SYNCED" : "LOCAL"}</span>
          <div className="command-utc"><span>{clock}</span><small>OPERATOR 04</small></div>
          <div className="classification-chip"><LockKeyhole size={12} /> CLASSIFIED <b>LEVEL 4</b></div>
        </header>

        {mobileMenu && <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setMobileMenu(false)} className="mobile-nav-link"><Icon size={16} />{label}</Link>)}</nav>}
        <main className="aegis-content" data-search={query.toLowerCase()}>{children}</main>
        <footer className="prop-footer"><span><Shield size={12} /> FICTIONAL INTERFACE — MOTION PICTURE PROP — NO REAL DATA OR CAPABILITIES.</span><span>AEGIS X <i>·</i> SIMULATED ENVIRONMENT</span></footer>
      </div>

      {helpOpen && <div className="modal-backdrop" role="presentation" onClick={() => setHelpOpen(false)}><section className="shortcut-modal" role="dialog" aria-modal="true" aria-labelledby="shortcut-title" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">QUICK REFERENCE</span><h2 id="shortcut-title">Keyboard shortcuts</h2></div><Button variant="ghost" size="icon" aria-label="Close" onClick={() => setHelpOpen(false)}><X /></Button></div><div className="shortcut-row"><span>Focus search</span><kbd>⌘ K</kbd></div><div className="shortcut-row"><span>Open command view</span><kbd>G</kbd></div><div className="shortcut-row"><span>Show this panel</span><kbd>?</kbd></div><p>Shortcuts are inactive while typing in a text field.</p></section></div>}
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

export function Panel({ title, tag, icon, children, className = "" }: { title: string; tag?: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}><header className="panel-heading"><div className="panel-title">{icon}{title}</div>{tag && <span className="panel-tag">{tag}</span>}</header>{children}</section>;
}

export function SeverityPill({ severity }: { severity: string }) {
  return <span className={`severity-pill severity-${severity.toLowerCase()}`}><i />{severity}</span>;
}

export function ClassificationStrip({ children = "CLASSIFIED — LEVEL 4" }: { children?: ReactNode }) {
  return <div className="classification-strip"><LockKeyhole size={12} />{children}<span>FICTIONAL</span></div>;
}

export function PropNotice({ compact = false }: { compact?: boolean }) {
  return <div className={`prop-notice ${compact ? "compact" : ""}`}><Shield size={13} /><span>FICTIONAL INTERFACE — MOTION PICTURE PROP — NO REAL DATA OR CAPABILITIES.</span></div>;
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><Archive size={20} /><strong>{title}</strong><span>{detail}</span></div>;
}

export function StatusDot({ label }: { label: string }) {
  return <span className="status-label"><i className="status-lamp" />{label}</span>;
}

export function MapPinIcon() { return <MapPin size={14} />; }
export function BellIcon() { return <Bell size={14} />; }
export function RadioIcon() { return <Radio size={14} />; }
export function ActivityIcon() { return <Activity size={14} />; }
export function ChevronIcon() { return <ChevronDown size={14} />; }
export function CommandIcon() { return <Command size={14} />; }