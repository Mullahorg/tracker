import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, Bug, Wifi, FileLock2, ArrowLeft, Check, X, KeyRound, MessageSquare, Cctv, Cpu, Mail, Satellite } from "lucide-react";
import { Shell } from "@/components/prop/shell";
import { usePropStore } from "@/components/prop/store";
import { resultViewForTool, type Tool } from "@/lib/prop-store";
import { CodeRain, Glitch, HexStream, LiveTerminal, Meters, NetGraph, Radar } from "@/components/prop/fx";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tools · Sentinel" },
      { name: "description", content: "Sentinel console tools: tracking, implant, breach and decrypt screens." },
      { property: "og:title", content: "Tools · Sentinel" },
      { property: "og:description", content: "Sentinel console tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const icons: Record<string, typeof Crosshair> = { track: Crosshair, spyware: Bug, breach: Wifi, decrypt: FileLock2, password: KeyRound, intercept: MessageSquare, cctv: Cctv, firewall: Cpu, mail: Mail, satellite: Satellite };

function Dashboard() {
  const { config } = usePropStore();
  const [active, setActive] = useState<Tool | null>(null);

  if (active) return <Shell><Runner tool={active} onBack={() => setActive(null)} /></Shell>;

  return (
    <Shell>
      <div className="hero-fx">
        <CodeRain />
        <div className="hero-copy">
          <span className="tag">● LINK SECURE · NODE {config.appName.toUpperCase()}</span>
          <h1><Glitch text="Operations console" /></h1>
          <p className="muted">Choose an operation to start.</p>
        </div>
        <Radar />
      </div>
      <div className="fx-row">
        <LiveTerminal title="root@relay-07:~" />
        <div className="fx-stack">
          <div className="fx-card"><span className="fx-label">Network map</span><NetGraph /></div>
          <div className="fx-card"><span className="fx-label">Uplink load</span><Meters /></div>
        </div>
      </div>
      <div className="tool-grid">
        {config.tools.map((tool) => {
          const Icon = icons[tool.id] ?? Crosshair;
          return (
            <button key={tool.id} className="tool-card" onClick={() => setActive(tool)}>
              <span className="tool-icon"><Icon size={20} /></span>
              <strong>{tool.name}</strong>
              <span className="muted">{tool.blurb}</span>
            </button>
          );
        })}
      </div>
    </Shell>
  );
}

function Runner({ tool, onBack }: { tool: Tool; onBack: () => void }) {
  const [target, setTarget] = useState("");
  const [phase, setPhase] = useState<"input" | "running" | "done">("input");
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "running") return;
    const durationMs = tool.durationSeconds * 1000;
    const startedAt = Date.now();
    let tick = 0;
    const t = setInterval(() => {
      tick++;
      const fraction = Math.min(1, (Date.now() - startedAt) / durationMs);
      setProgress(Math.min(99, Math.floor(fraction * 100)));
      const s = Math.min(tool.steps.length - 1, Math.floor(fraction * tool.steps.length));
      setStep(s);
      if (tick % 3 === 0) {
        const hex = Array.from({ length: 4 }, () => Math.floor(Math.random() * 65535).toString(16).padStart(4, "0")).join(" ");
        setLog((l) => [...l.slice(-40), `[${(tool.steps[s] ?? "").toLowerCase()}] 0x${hex}`]);
      }
    }, 100);
    const finish = setTimeout(() => {
      setProgress(100);
      setPhase("done");
    }, durationMs);
    return () => {
      clearInterval(t);
      clearTimeout(finish);
    };
  }, [phase, tool.durationSeconds, tool.steps]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  return (
    <div className="runner">
      <button className="btn ghost" onClick={onBack}><ArrowLeft size={16} /> All tools</button>
      <div className="page-head"><h1>{tool.name}</h1><p className="muted">{tool.blurb}</p></div>

      {phase === "input" && (
        <form className="card narrow" onSubmit={(e) => { e.preventDefault(); setPhase("running"); }}>
          <label className="field"><span>{tool.inputLabel}</span><input autoFocus value={target} onChange={(e) => setTarget(e.target.value)} /></label>
          <button className="btn primary" disabled={!target.trim()}>Start</button>
        </form>
      )}

      {phase === "running" && (
        <>
        <div className="fx-strip">
          <div className="fx-card"><span className="fx-label">Packet capture</span><HexStream rows={6} /></div>
          <div className="fx-card"><span className="fx-label">Route to target</span><NetGraph /></div>
          <div className="fx-card radar-sm"><Radar /></div>
        </div>
        <div className="run-grid">
          <div className="card">
            <div className="row-between"><span className="muted">Target</span><b>{target}</b></div>
            <div className="bar"><span style={{ width: `${progress}%` }} /></div>
            <div className="row-between small"><span>{tool.outcome === "failure" && step === tool.steps.length - 1 ? "Evaluating simulated outcome" : tool.steps[step]}…</span><span>{progress}%</span></div>
            <ol className="steps">
              {tool.steps.map((s, i) => (
                <li key={s + i} className={i < step ? "done" : i === step ? "now" : ""}>
                  <span className="step-dot">{i < step ? <Check size={11} /> : i + 1}</span>{tool.outcome === "failure" && i === tool.steps.length - 1 ? "Evaluating simulated outcome" : s}
                </li>
              ))}
            </ol>
          </div>
          <div className="terminal" ref={logRef}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
            <span className="caret" />
          </div>
        </div>
        </>
      )}

      {phase === "done" && (
        <div className="run-grid granted-wrap">
          <div className={`granted ${tool.outcome === "failure" ? "failed" : ""}`}><Glitch text={tool.outcome === "success" ? "SIMULATION SUCCESS" : "SIMULATION FAILED"} /></div>
          <div className="card">
            {tool.outcome === "success"
              ? <div className="success"><Check size={16} /> {tool.steps[tool.steps.length - 1] ?? "Simulated operation complete"}</div>
              : <div className="failure"><X size={16} /> Simulated operation failed</div>}
            <div className="row-between"><span className="muted">Target</span><b>{target}</b></div>
            {tool.outcome === "success"
              ? <ResultDisplay tool={tool} />
              : <p className="muted">No result data was returned for this simulated run.</p>}
            <button className="btn" onClick={() => { setPhase("input"); setLog([]); setProgress(0); setStep(0); }}>Run again</button>
          </div>
          {tool.showMap && tool.outcome === "success" ? (
            <div className="result-map-panel">
              <div className="simulation-stamp">SIMULATED · LOCAL PROP DATA</div>
              <div className="map-caption"><span>{tool.id === "cctv" ? "CAM-07 · STATIC MAP TILE" : tool.id === "satellite" ? "SYNTHETIC OVERHEAD TILE" : "FICTIONAL LOCATION TILE"}</span><span>NO LIVE FEED</span></div>
              <FakeMap x={tool.mapX} y={tool.mapY} />
            </div>
          ) : (
            <div className="terminal">{log.slice(-18).map((l, i) => <div key={i}>{l}</div>)}<div className={tool.outcome === "success" ? "ok" : "failure"}>// simulated run complete · {tool.outcome}</div></div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultDisplay({ tool }: { tool: Tool }) {
  const view = resultViewForTool(tool.id);
  const rows = tool.result;

  return (
    <div className={`result-display result-display-${view}`}>
      <div className="simulation-stamp">SIMULATED · LOCAL PROP DATA</div>
      {view === "credential" && (
        <div className="result-artifact">
          <div className="artifact-brand"><span className="artifact-mark">PK</span><span>PAPER KITE <small>FICTIONAL DEMO APP</small></span></div>
          <span className="artifact-label">SIMULATED HASH MATCH <span>NON-VALID SAMPLE</span></span>
          <code>{rows.find((row) => row.label.toLowerCase().includes("hash"))?.value ?? "$2b$12$SIMULATED_SAMPLE_ONLY"}</code>
        </div>
      )}
      {view === "chat" && (
        <div className="chat-preview">
          <div className="chat-preview-head"><span>Paper Kite Chat</span><span>OFFLINE DEMO</span></div>
          {rows.map((row, index) => (
            <div className={`chat-bubble ${index % 2 === 0 ? "incoming" : "outgoing"}`} key={`${row.label}-${index}`}>
              <span>{row.label}</span><p>{row.value}</p><small>PROP MESSAGE</small>
            </div>
          ))}
        </div>
      )}
      {view === "mail" && (
        <div className="mail-preview">
          <div className="mail-preview-head"><span>Paper Kite Mail</span><span>FICTIONAL INBOX</span></div>
          {rows.map((row, index) => (
            <div className="mail-row" key={`${row.label}-${index}`}><span className="mail-dot" /><div><strong>{row.label}</strong><p>{row.value}</p></div></div>
          ))}
        </div>
      )}
      {(view === "network" || view === "spyware") && (
        <div className="result-visual" aria-label={view === "network" ? "Simulated network diagram" : "Simulated device status panel"}>
          {view === "network" ? <NetGraph /> : <div className="device-status"><span>DEMO DEVICE</span><div /><div /><div /></div>}
        </div>
      )}
      {view === "archive" && <div className="archive-strip"><span>PROP ARCHIVE</span><span>READ-ONLY · SIMULATED</span></div>}
      <dl className="result result-data">{rows.map((row, index) => <div key={`${row.label}-${index}`}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    </div>
  );
}

function FakeMap({ x, y }: { x: number; y: number }) {
  return (
    <div className="map">
      <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
        {[10, 22, 35, 48, 60].map((v) => <line key={"h" + v} x1="0" x2="100" y1={v} y2={v} />)}
        {[12, 28, 44, 61, 77, 90].map((v) => <line key={"v" + v} y1="0" y2="70" x1={v} x2={v} />)}
        <path className="road" d="M0 40 C25 35 40 50 60 32 S85 20 100 26" />
        <path className="road" d="M30 0 C34 20 50 40 45 70" />
        <rect className="block" x="64" y="40" width="14" height="10" />
        <rect className="block" x="14" y="12" width="10" height="8" />
      </svg>
      <span className="pin" style={{ left: `${x}%`, top: `${y}%` }}><span /></span>
    </div>
  );
}
