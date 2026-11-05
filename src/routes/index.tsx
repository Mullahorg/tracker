import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Circle, LoaderCircle, Shield, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropNotice } from "@/components/aegis/aegis-ui";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "AEGIS X · Fictional Secure Access" }, { name: "description", content: "Cinematic fictional secure-access splash for the AEGIS X motion picture prop interface." }, { property: "og:title", content: "AEGIS X · Fictional Secure Access" }, { property: "og:description", content: "Fictional system. Movie prop. No real access." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AccessPage,
});

function AccessPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [line, setLine] = useState(0);
  const lines = ["initializing secure enclave…", "loading fictional scenario index…", "operator credentials verified…", "local prop environment ready."];

  useEffect(() => {
    const timers = [window.setTimeout(() => setLine(1), 380), window.setTimeout(() => setLine(2), 760), window.setTimeout(() => setLine(3), 1140), window.setTimeout(() => setReady(true), 1520)];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return <main className="access-screen"><div className="access-grid" aria-hidden="true" /><div className="access-sweep" aria-hidden="true" />
    <div className="access-layout">
      <header className="access-header"><span className="access-brand"><Shield size={17} /> AEGIS <b>X</b></span><span className="access-header-status"><i /> PROP SYSTEM / BUILD 04.19</span></header>
      <section className="access-content" aria-labelledby="access-title">
        <div className="access-emblem"><svg viewBox="0 0 120 120" role="img" aria-label="AEGIS X shield emblem"><path d="M60 7 101 23v31c0 27-17 46-41 59C36 100 19 81 19 54V23Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M60 19 90 31v23c0 20-12 34-30 44-18-10-30-24-30-44V31Z" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45"/><circle cx="60" cy="54" r="15" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M60 27v17m0 20v17M33 54h17m20 0h17" stroke="currentColor" strokeWidth="1.3"/><path d="m53 54 5 5 10-12" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
        <div className="access-kicker"><span /> RESTRICTED SYSTEM <span /></div>
        <h1 id="access-title">AEGIS <span>X</span></h1>
        <p className="access-subtitle">AUTONOMOUS EVENT &amp; GEOSPATIAL INTELLIGENCE SYSTEM</p>
        <div className="boot-log" aria-label="Fictional boot sequence"><div className="boot-heading"><Terminal size={13} /> INITIALIZATION LOG <span>LOCAL / NO NETWORK</span></div>{lines.slice(0, line + 1).map((item, index) => <div className="boot-row" key={item}><span className="boot-prompt">&gt;</span><span>{item}</span>{index < line || ready ? <Check size={12} className="boot-check" /> : <LoaderCircle size={12} className="boot-loading" />}</div>)}</div>
        <div className="access-progress-line"><span>ENVIRONMENT INITIALIZATION</span><b>{ready ? "100" : `${Math.min(96, 24 * (line + 1))}`}%</b></div><div className="access-progress"><span className={ready ? "progress-complete" : ""} /></div>
        <div className="access-action-row"><span><Circle size={7} /> FICTIONAL SYSTEM. MOVIE PROP. NO REAL ACCESS.</span><Button variant="default" size="lg" disabled={!ready} onClick={() => navigate({ to: "/dashboard" })}>PROCEED <ArrowRight size={15} /></Button></div>
      </section>
      <footer className="access-footer"><PropNotice /><span>STORY ENVIRONMENT · ALL ENTRIES ARE FABRICATED</span></footer>
    </div>
  </main>;
}