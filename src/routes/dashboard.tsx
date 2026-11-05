import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Bell, Check, ChevronDown, CircleDot, Clock3, FileLock2, FileText, MapPin, MessageSquare, MoreHorizontal, Radio, Send, Shield, Signal, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAegis } from "@/components/aegis/aegis-provider";
import { AegisShell, ClassificationStrip, PageHeading, Panel, PropNotice, SeverityPill, useGlobalSearch } from "@/components/aegis/aegis-ui";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Command Center · AEGIS X" }, { name: "description", content: "Fictional AEGIS X command center for a motion picture prop." }, { property: "og:title", content: "Command Center · AEGIS X" }, { property: "og:description", content: "A fictional, local-only movie prop command center." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, updateData } = useAegis();
  const search = useGlobalSearch();
  const [layout, setLayout] = useState("OPS GRID");
  const [timeFilter, setTimeFilter] = useState("LIVE");
  const [activeThread, setActiveThread] = useState(data.threads[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [docOpen, setDocOpen] = useState(false);
  const [declassified, setDeclassified] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(true);

  useEffect(() => {
    const onLayout = (event: Event) => {
      const mode = (event as CustomEvent<string>).detail;
      if (mode === "OPS GRID" || mode === "WALLBOARD") setLayout(mode);
    };
    window.addEventListener("aegis-layout", onLayout);
    return () => window.removeEventListener("aegis-layout", onLayout);
  }, []);

  const missions = useMemo(() => data.missions.filter((mission) => `${mission.codename} ${mission.objective} ${mission.id}`.toLowerCase().includes(search)), [data.missions, search]);
  const events = useMemo(() => data.events.filter((event) => `${event.title} ${event.detail}`.toLowerCase().includes(search)).slice(0, 6), [data.events, search]);
  const thread = data.threads.find((item) => item.id === activeThread) ?? data.threads[0];
  const activeAlerts = data.alerts.filter((alert) => !alert.acknowledged);

  function sendMessage() {
    if (!message.trim() || !thread) return;
    updateData((current) => ({ ...current, threads: current.threads.map((item) => item.id === thread.id ? { ...item, messages: [...item.messages, { id: `msg-${Date.now()}`, author: "operator_04", initials: "O4", text: message.trim(), time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()) }] } : item) }));
    setMessage("");
    toast.success("Local message added");
  }

  function openDocument() {
    setDocOpen(true);
    setDeclassified(false);
    setDecrypting(true);
    window.setTimeout(() => setDecrypting(false), 1150);
  }

  return <AegisShell><div className={`dashboard-page layout-${layout.toLowerCase().replace(" ", "-")}`}>
    <div className="dashboard-topline"><PageHeading eyebrow="AEGIS X / OPERATIONS" title="Command overview" description="Synthetic scenario telemetry · all values are fictional" actions={<div className="layout-switcher" aria-label="Dashboard layout">{["OPS GRID", "FOCUS", "WALLBOARD"].map((mode) => <Button key={mode} size="sm" variant={layout === mode ? "secondary" : "ghost"} onClick={() => setLayout(mode)}>{mode}</Button>)}</div>} /><div className="scenario-stamp"><span className="pulse-indicator" /> SCENARIO ACTIVE <b>04:19:32</b><small>LOCAL SIMULATION</small></div></div>
    <ClassificationStrip />

    <div className="dashboard-grid">
      <Panel className="map-panel" title="Simulated geography" tag="FICTIONAL · NOT TO SCALE" icon={<MapPin size={15} />}>
        <div className="map-toolbar"><div className="map-tabs">{["LIVE", "24H", "7D"].map((filter) => <Button key={filter} size="sm" variant={timeFilter === filter ? "secondary" : "ghost"} onClick={() => setTimeFilter(filter)}>{filter}</Button>)}</div><span><span className="status-lamp" /> {data.locations.length} SYNTHETIC NODES</span></div>
        <div className="map-canvas" role="img" aria-label="Stylized fictional map with six synthetic location markers">
          <svg className="map-art" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="map-grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".36" /></pattern><radialGradient id="map-glow"><stop stopColor="currentColor" stopOpacity=".12" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient></defs><rect width="1000" height="520" fill="url(#map-grid)" /><ellipse cx="500" cy="250" rx="460" ry="220" fill="url(#map-glow)" /><g className="continent-shapes"><path d="M83 119 122 83 184 75 223 104 260 108 276 143 250 166 237 199 204 210 184 247 156 252 133 223 108 210 94 180 65 159Z"/><path d="m258 266 33 16 26 40-4 47-18 30-6 53-25 42-19-38 8-47-22-40 10-54-18-28Z"/><path d="m404 99 41-24 50 7 19 22 48-11 31 17 39-4 30 23 58-7 38 24 47-5 42 29-18 32-40 12-22 29-49-2-17 22-37-14-38 26-24-20-44 13-29-23-51 12-20-22-46 1-28-29-33-6-26-38 17-34Z"/><path d="m478 245 39 10 33 38-9 57-35 53-20 66-36 40-19-49 17-60-13-47 19-43-14-40Z"/><path d="m738 348 34-14 45 8 42 25 37 3 33 33-16 30-50 2-36 22-44-13-40 13-36-26 8-37Z"/><path d="m903 174 27-18 23 12-8 34-24 14Z"/></g><g className="map-lines"><path d="M180 167 Q375 85 568 205T813 164"/><path d="M180 167 Q241 338 330 366T569 205"/><path d="M330 366 Q580 433 813 164"/><path d="M390 147 Q610 118 813 164"/></g></svg>
          {data.locations.map((location) => <div key={location.id} className={`map-marker marker-${location.status.toLowerCase()}`} style={{ left: `${location.x}%`, top: `${location.y}%` }} tabIndex={0} aria-label={`${location.name}, ${location.region}, activity ${location.activity} percent`}><span className="marker-ring" /><span className="marker-core" /><div className="marker-tooltip"><strong>{location.name}</strong><span>{location.region}</span><span className="tooltip-meta">ACTIVITY {location.activity}% <i /> {location.status}</span></div></div>)}
          <div className="map-overlay-label"><span>SIMULATED GEOGRAPHY</span><small>FICTIONAL REGIONS · ADMIN-DEFINED</small></div><div className="map-scale"><span>0</span><i /><span>500 U</span></div>
          <div className="map-radar" aria-hidden="true" />
        </div>
        <div className="map-legend"><span><i className="legend-cyan" /> NOMINAL</span><span><i className="legend-amber" /> ELEVATED</span><span><i className="legend-muted" /> QUIET</span><span className="map-coordinates">GRID REF: PROP / 07</span></div>
      </Panel>

      <Panel className="metrics-panel" title="System status" tag="DISPLAY ONLY" icon={<Activity size={15} />}>
        <div className="metric-grid">{data.metrics.map((metric, index) => { const bounded = Math.min(100, Math.max(0, metric.value)); return <article className="metric-tile" key={metric.id}><div className="metric-title"><span>{metric.label}</span><span className={`metric-icon metric-${index % 4}`}><Signal size={13} /></span></div><div className="metric-reading"><strong>{metric.value}</strong><small>{metric.unit}</small></div><Progress value={bounded} className="metric-progress" /><div className="metric-note"><span>{metric.note}</span><span className="metric-delta">{index % 2 ? "STABLE" : "NOMINAL"}</span></div></article>; })}</div>
      </Panel>

      <Panel className="mission-panel" title="Active missions" tag={`${missions.length} RECORDS`} icon={<CircleDot size={15} />}>
        <div className="mission-cards">{missions.slice(0, 4).map((mission) => <article className="mission-card" key={mission.id}><div className="mission-card-top"><SeverityPill severity={mission.priority} /><span className="mission-id">{mission.id}</span></div><Link className="mission-card-title" to="/missions/$id" params={{ id: mission.id }}>{mission.codename}<ArrowUpRight size={14} /></Link><p>{mission.objective}</p><div className="mission-progress-row"><Progress value={mission.progress} /><b>{mission.progress}%</b></div><div className="mission-card-bottom"><span><Clock3 size={12} /> ETA {mission.eta}</span><div className="avatar-stack">{mission.operators.map((initials) => <span key={initials} title={initials}>{initials}</span>)}</div><Link to="/missions/$id" params={{ id: mission.id }} className="open-link">OPEN <ArrowUpRight size={12} /></Link></div></article>)}</div>
        <Link to="/missions" className="panel-footer-link">VIEW MISSION ROSTER <ArrowUpRight size={13} /></Link>
      </Panel>

      <Panel className="alerts-panel" title="Alert center" tag={`${activeAlerts.length} OPEN`} icon={<Bell size={15} />}>
        <Button className="collapse-control" size="icon" variant="ghost" aria-label={alertsOpen ? "Collapse alerts" : "Expand alerts"} onClick={() => setAlertsOpen((open) => !open)}><ChevronDown className={alertsOpen ? "" : "rotate-180"} size={14} /></Button>
        {alertsOpen && <div className="alert-list" aria-live="polite">{data.alerts.filter((alert) => !alert.acknowledged).length ? data.alerts.filter((alert) => !alert.acknowledged).map((alert) => <article className="alert-item" key={alert.id}><SeverityPill severity={alert.severity} /><p>{alert.message}</p><div className="alert-row-bottom"><span>{alert.time} AGO</span><Button variant="ghost" size="sm" onClick={() => { updateData((current) => ({ ...current, alerts: current.alerts.map((item) => item.id === alert.id ? { ...item, acknowledged: true } : item) })); toast.success("Alert acknowledged"); }}>ACK <Check size={12} /></Button></div></article>) : <div className="all-clear"><Check size={16} /> ALL ALERTS ACKNOWLEDGED</div>}</div>}
        <Button variant="ghost" size="sm" className="ack-all" disabled={!activeAlerts.length} onClick={() => { updateData((current) => ({ ...current, alerts: current.alerts.map((alert) => ({ ...alert, acknowledged: true })) })); toast.success("All fictional alerts acknowledged"); }}>ACKNOWLEDGE ALL</Button>
      </Panel>

      <Panel className="timeline-panel" title="Live event timeline" tag="LOCAL SEED DATA" icon={<Clock3 size={15} />}>
        <div className="event-timeline">{events.map((event) => <article className="event-row" key={event.id}><span className={`event-marker event-${event.severity.toLowerCase()}`}><i /></span><div className="event-content"><div className="event-head"><strong>{event.title}</strong><time>{event.time}</time></div><p>{event.detail}</p><SeverityPill severity={event.severity} /></div></article>)}</div><Link to="/missions" className="panel-footer-link">OPEN EVENT REGISTER <ArrowUpRight size={13} /></Link>
      </Panel>

      <Panel className="comms-panel" title="Secure comms" tag="ENCRYPTED · PROP" icon={<Radio size={15} />}>
        <div className="comms-topline"><select value={activeThread} onChange={(event) => setActiveThread(event.target.value)} aria-label="Choose fictional comms channel">{data.threads.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><span className="channel-online"><i /> LOCAL</span></div>
        <div className="message-list" aria-live="polite">{thread?.messages.map((item) => <div className={`chat-message ${item.initials === "O4" ? "own-message" : ""}`} key={item.id}><span className="chat-avatar">{item.initials}</span><div><div className="chat-meta"><b>{item.author}</b><time>{item.time}</time></div><p>{item.text}</p></div></div>)}<div className="typing-state"><i /><i /><i /><span>cipher_12 is composing a fictional message</span></div></div>
        <form className="comms-compose" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a local message…" aria-label="Write a fictional message" /><Button type="submit" size="icon" aria-label="Send message" disabled={!message.trim()}><Send size={14} /></Button></form>
        <div className="comms-attachments"><span>PROP ATTACHMENTS</span><button type="button" onClick={openDocument}><FileText size={12} /> BRIEF-1142</button><button type="button" onClick={openDocument}><FileLock2 size={12} /> CASE NOTE</button></div>
      </Panel>

      <Panel className="activity-panel" title="Operator activity" tag="RECENT" icon={<Sparkles size={15} />}>
        <div className="operator-feed">{data.operators.slice(0, 4).map((operator, index) => <div className="operator-row" key={operator.id}><span className="operator-avatar">{operator.initials}</span><div><p><b>{operator.handle}</b> { ["opened BRIEF-1142", "reviewed synthetic cadence", "updated scenario notes", "closed a prop handoff"][index] }</p><small>{["02", "09", "16", "24"][index]} MIN AGO · {operator.role.toUpperCase()}</small></div><MoreHorizontal size={14} /></div>)}</div>
        <div className="quick-links"><button type="button" onClick={openDocument}><FileLock2 size={13} /> CLASSIFIED BRIEF</button><Link to="/reports/$id" params={{ id: "BRIEF-1142" }}><FileText size={13} /> REPORT VIEWER</Link></div>
      </Panel>

      <Panel className="asset-panel" title="Fictional assets" tag="TOPOLOGY / LOCAL" icon={<Radio size={15} />}>
        <div className="asset-topology"><svg viewBox="0 0 400 116" role="img" aria-label="Fictional topology diagram linking prop assets"><path d="M64 58H200M200 58h135M200 58V18" className="topology-link"/><circle cx="64" cy="58" r="6"/><circle cx="200" cy="58" r="7"/><circle cx="335" cy="58" r="6"/><circle cx="200" cy="18" r="5"/><text x="64" y="91">{data.assets[0]?.name ?? "NODE-01"}</text><text x="200" y="91">{data.assets[1]?.name ?? "NODE-02"}</text><text x="335" y="91">{data.assets[2]?.name ?? "NODE-03"}</text><text x="200" y="8">ARCHIVE</text></svg></div>
        <div className="asset-list">{data.assets.map((asset) => <div key={asset.id}><span><i />{asset.name}</span><small>{asset.type}</small><b>{asset.status}</b></div>)}</div>
      </Panel>

      <Panel className="document-panel" title="Classified document" tag="3 BRIEFS" icon={<FileLock2 size={15} />}>
        <div className="featured-brief"><div className="brief-glyph"><FileText size={18} /></div><div><small>BRIEF-1142 · LEVEL 4</small><strong>Echo Ledger / NIGHTGLASS</strong><span>REVISED 09:38 UTC · FICTIONAL</span></div></div><p className="brief-excerpt">The glass corridor exercise is progressing within the designed scenario window…</p><Button size="sm" variant="secondary" onClick={openDocument}>OPEN DOCUMENT <ArrowUpRight size={13} /></Button>
      </Panel>
    </div>
    <div className="dashboard-disclaimer"><Shield size={13} /> SIMULATION ONLY <span>Every signal, location, operator, and metric is fabricated and stored on this device.</span></div>

    {docOpen && <div className="modal-backdrop" role="presentation" onClick={() => setDocOpen(false)}><section className="document-modal" role="dialog" aria-modal="true" aria-labelledby="document-title" tabIndex={-1} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Escape") setDocOpen(false); }}><div className="modal-heading"><div><span className="eyebrow">AEGIS X / DOCUMENT VIEWER</span><h2 id="document-title">BRIEF-1142</h2></div><Button variant="ghost" size="icon" aria-label="Close document" onClick={() => setDocOpen(false)}><X /></Button></div><ClassificationStrip>CLASSIFIED — LEVEL 4 · FICTIONAL</ClassificationStrip>{decrypting ? <div className="decrypt-state"><div className="decrypt-track"><span /></div><b>DECRYPTING…</b><small>LOCAL PROP DOCUMENT · NO NETWORK ACCESS</small></div> : <div className="brief-document"><div className="brief-document-meta"><span>SUBJECT / ECHO LEDGER</span><span>REVISION 03 · 09:38 UTC</span></div><h3>Operation Nightglass</h3><p>{data.briefs.find((brief) => brief.id === "BRIEF-1142")?.text}</p><p>Review window is open for the assigned operators. Any variation in this file is staged narrative content and has no external source.</p><div className="redaction-blocks"><span>DESIGN NOTE / INTERNAL PROP COPY</span>{declassified ? <p>Scenario ref: GLASS HARBOR · all identifiers are invented. Release is for in-scene display only.</p> : <><i /><i /><i /></>}</div><div className="document-signature"><span>PREPARED BY <b>analyst_09</b></span><span>AUTHORIZATION <b>PROP-LEVEL-04</b></span></div></div>}<div className="document-modal-footer"><Button variant="outline" onClick={() => setDeclassified((value) => !value)} disabled={decrypting}>{declassified ? "RESTORE REDACTIONS" : "DECLASSIFY VIEW"}</Button><span>FICTIONAL DOCUMENT · FOR SCREEN USE</span></div></section></div>}
  </div></AegisShell>;
}