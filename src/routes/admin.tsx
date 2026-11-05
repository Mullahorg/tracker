import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowUpRight, Check, FileText, MapPin, Plus, Save, ShieldAlert, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAegis } from "@/components/aegis/aegis-provider";
import { AegisShell, ClassificationStrip, PageHeading, Panel, SeverityPill } from "@/components/aegis/aegis-ui";
import { type Severity } from "@/lib/aegis-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Control · AEGIS X" }, { name: "description", content: "Local-only fictional AEGIS X prop data control panel." }, { property: "og:title", content: "Admin Control · AEGIS X" }, { property: "og:description", content: "Edit fabricated AEGIS X prop content stored only on this device." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AdminPage,
});

const adminTabs = ["MISSIONS", "LOCATIONS", "ALERTS", "SYSTEM STATUS", "EVENTS", "BRIEFS", "TARGETS", "ASSETS"];

function AdminPage() {
  const { data, updateData } = useAegis();
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState("MISSIONS");
  const [missionDraft, setMissionDraft] = useState({ codename: "", objective: "", priority: "ROUTINE" as Severity, status: "ACTIVE" as const, progress: 0, eta: "01:00" });
  const [locationDraft, setLocationDraft] = useState({ name: "", region: "", x: 50, y: 50, activity: 50, status: "NOMINAL" as "NOMINAL" | "ELEVATED" | "QUIET" });
  const [eventDraft, setEventDraft] = useState({ title: "", detail: "", severity: "ROUTINE" as Severity });
  const [alertDraft, setAlertDraft] = useState({ message: "", severity: "ELEVATED" as Severity });
  const [targetDraft, setTargetDraft] = useState("");
  const [briefDraft, setBriefDraft] = useState({ id: "BRIEF-NEW", title: "", classification: "LEVEL 3 · FICTIONAL", text: "" });

  const unacknowledged = data.alerts.filter((alert) => !alert.acknowledged).length;
  const navCounts = useMemo(() => ({ missions: data.missions.length, locations: data.locations.length, alerts: unacknowledged, briefs: data.briefs.length }), [data, unacknowledged]);

  function enterAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pin.trim()) return;
    setAuthorized(true);
    toast.success("Prop admin panel unlocked");
  }

  function saveMission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!missionDraft.codename.trim() || !missionDraft.objective.trim()) return;
    const mission = { id: `M-${Math.floor(220 + Math.random() * 700)}`, codename: missionDraft.codename.trim().toUpperCase(), objective: missionDraft.objective.trim(), priority: missionDraft.priority, status: missionDraft.status, progress: missionDraft.progress, eta: missionDraft.eta.trim() || "01:00", operators: ["A9", "Q8"], locationId: data.locations[0]?.id ?? "", objectives: [{ id: "a", label: "Review the fictional scenario packet", done: false }, { id: "b", label: "Annotate the staged sample", done: false }, { id: "c", label: "Prepare a closing prop note", done: false }] };
    updateData((current) => ({ ...current, missions: [mission, ...current.missions] }));
    setMissionDraft({ codename: "", objective: "", priority: "ROUTINE", status: "ACTIVE", progress: 0, eta: "01:00" });
    toast.success("Fictional scenario saved locally");
  }

  function saveLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!locationDraft.name.trim() || !locationDraft.region.trim()) return;
    updateData((current) => ({ ...current, locations: [...current.locations, { ...locationDraft, id: `loc-${Date.now()}`, name: locationDraft.name.trim().toUpperCase(), region: locationDraft.region.trim().toUpperCase() }] }));
    setLocationDraft({ name: "", region: "", x: 50, y: 50, activity: 50, status: "NOMINAL" });
    toast.success("Fictional map label saved");
  }

  function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventDraft.title.trim()) return;
    updateData((current) => ({ ...current, events: [{ id: `ev-${Date.now()}`, time: "JUST NOW", title: eventDraft.title.trim(), detail: eventDraft.detail.trim() || "Admin-added fictional entry", severity: eventDraft.severity }, ...current.events] }));
    setEventDraft({ title: "", detail: "", severity: "ROUTINE" });
    toast.success("Fictional event added");
  }

  function saveAlert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!alertDraft.message.trim()) return;
    updateData((current) => ({ ...current, alerts: [{ id: `al-${Date.now()}`, message: alertDraft.message.trim(), severity: alertDraft.severity, time: "NOW", acknowledged: false }, ...current.alerts] }));
    setAlertDraft({ message: "", severity: "ELEVATED" });
    toast.success("Fictional alert added");
  }

  function saveBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!briefDraft.title.trim() || !briefDraft.text.trim()) return;
    updateData((current) => ({ ...current, briefs: [{ ...briefDraft, id: `BRIEF-${Math.floor(1200 + Math.random() * 700)}`, title: briefDraft.title.trim(), text: briefDraft.text.trim() }, ...current.briefs] }));
    setBriefDraft({ id: "BRIEF-NEW", title: "", classification: "LEVEL 3 · FICTIONAL", text: "" });
    toast.success("Fictional brief saved");
  }

  function removeMission(id: string) {
    updateData((current) => ({ ...current, missions: current.missions.filter((item) => item.id !== id) }));
    toast.success("Fictional scenario removed");
  }

  if (!authorized) return <AegisShell><div className="admin-lock-page"><div className="admin-lock-mark"><ShieldAlert size={24} /></div><div className="eyebrow">AEGIS X / LOCAL CONTROL</div><h1>Administrator access</h1><p>This is a fictional client-side gate for a movie prop. Any non-empty entry proceeds; no real credential is checked.</p><ClassificationStrip>PROP ACCESS · ALL INPUTS ACCEPTED</ClassificationStrip><form onSubmit={enterAdmin} className="admin-gate-form"><Label htmlFor="prop-pin">PROP ACCESS KEY</Label><Input id="prop-pin" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="Enter any value" autoComplete="off" /><div className="gate-hint"><span>DEMO ENTRY</span><kbd>0000</kbd></div><Button type="submit" disabled={!pin.trim()}>UNLOCK CONTROL PANEL <ArrowUpRight size={14} /></Button></form><div className="admin-lock-disclaimer"><ShieldAlert size={13} /> No account, password, or real system is accessed.</div></div></AegisShell>;

  return <AegisShell><div className="admin-page"><PageHeading eyebrow="AEGIS X / LOCAL CONTROL" title="Admin control" description="Edit fictional scenario content stored on this device." actions={<span className="local-only-badge"><i /> LOCAL STORAGE ONLY</span>} /><ClassificationStrip>ADMIN PANEL · PROP MODE</ClassificationStrip>
    <div className="admin-warning"><AlertTriangle size={17} /><div><b>FICTIONAL CONTENT ONLY</b><span>Use invented names and regions. Never enter personal details, real locations, operational data, or real credentials.</span></div></div>
    <div className="admin-summary-strip"><div><span>SCENARIOS</span><b>{String(navCounts.missions).padStart(2, "0")}</b></div><div><span>MAP LABELS</span><b>{String(navCounts.locations).padStart(2, "0")}</b></div><div><span>OPEN ALERTS</span><b>{String(navCounts.alerts).padStart(2, "0")}</b></div><div><span>BRIEFS</span><b>{String(navCounts.briefs).padStart(2, "0")}</b></div><div className="admin-sync-state"><span>SYNC STATE</span><b><Check size={13} /> READY</b></div></div>
    <div className="admin-layout"><aside className="admin-side-tabs" aria-label="Admin categories">{adminTabs.map((item) => <Button key={item} variant={item === tab ? "secondary" : "ghost"} onClick={() => setTab(item)}>{item === "MISSIONS" ? <Activity size={14} /> : item === "LOCATIONS" ? <MapPin size={14} /> : item === "ALERTS" ? <AlertTriangle size={14} /> : item === "SYSTEM STATUS" ? <SignalIcon /> : item === "EVENTS" ? <ClockIcon /> : item === "BRIEFS" ? <FileText size={14} /> : item === "TARGETS" ? <Users size={14} /> : <NetworkIcon />}{item}<span>{item === "MISSIONS" ? navCounts.missions : item === "LOCATIONS" ? navCounts.locations : item === "ALERTS" ? navCounts.alerts : item === "BRIEFS" ? navCounts.briefs : ""}</span></Button>)}</aside>
      <div className="admin-workspace">
        {tab === "MISSIONS" && <Panel title="Mission records" tag={`${data.missions.length} LOCAL RECORDS`} icon={<Activity size={15} />}><form className="admin-create-form" onSubmit={saveMission}><h3><Plus size={14} /> ADD FICTIONAL SCENARIO</h3><div className="form-grid"><Field label="CODENAME" value={missionDraft.codename} placeholder="OPERATION SILVER KEY" onChange={(value) => setMissionDraft((current) => ({ ...current, codename: value }))} required /><Field label="OBJECTIVE" value={missionDraft.objective} placeholder="A fabricated scenario objective" onChange={(value) => setMissionDraft((current) => ({ ...current, objective: value }))} required /><SelectField label="PRIORITY" value={missionDraft.priority} options={["ROUTINE", "ELEVATED", "CRITICAL"]} onChange={(value) => setMissionDraft((current) => ({ ...current, priority: value as Severity }))} /><SelectField label="STATUS" value={missionDraft.status} options={["ACTIVE", "STANDBY", "COMPLETE"]} onChange={(value) => setMissionDraft((current) => ({ ...current, status: value as "ACTIVE" | "STANDBY" | "COMPLETE" }))} /><NumberField label="PROGRESS %" value={missionDraft.progress} onChange={(value) => setMissionDraft((current) => ({ ...current, progress: value }))} /><Field label="PROP ETA" value={missionDraft.eta} placeholder="01:00" onChange={(value) => setMissionDraft((current) => ({ ...current, eta: value }))} /></div><Button type="submit"><Save size={14} /> SAVE SCENARIO</Button></form><div className="admin-record-list">{data.missions.map((mission) => <article key={mission.id}><div><b>{mission.codename}</b><small>{mission.id} · {mission.objective}</small></div><SeverityPill severity={mission.priority} /><span className={`table-status status-${mission.status.toLowerCase()}`}><i />{mission.status}</span><span>{mission.progress}%</span><Link to="/missions/$id" params={{ id: mission.id }} aria-label={`View ${mission.codename}`}><ArrowUpRight size={14} /></Link><Button variant="ghost" size="icon" aria-label={`Delete ${mission.codename}`} onClick={() => removeMission(mission.id)}><Trash2 size={14} /></Button></article>)}</div></Panel>}

        {tab === "LOCATIONS" && <Panel title="Fictional map labels" tag="ADMIN-DEFINED · NOT GEOLOCATED" icon={<MapPin size={15} />}><form className="admin-create-form" onSubmit={saveLocation}><h3><Plus size={14} /> ADD SIMULATED MARKER</h3><div className="form-grid"><Field label="CODENAME" value={locationDraft.name} placeholder="GLASS HARBOR" onChange={(value) => setLocationDraft((current) => ({ ...current, name: value }))} required /><Field label="INVENTED REGION LABEL" value={locationDraft.region} placeholder="SECTOR K-9" onChange={(value) => setLocationDraft((current) => ({ ...current, region: value }))} required /><NumberField label="MAP X %" value={locationDraft.x} max={100} onChange={(value) => setLocationDraft((current) => ({ ...current, x: value }))} /><NumberField label="MAP Y %" value={locationDraft.y} max={100} onChange={(value) => setLocationDraft((current) => ({ ...current, y: value }))} /><NumberField label="ACTIVITY %" value={locationDraft.activity} max={100} onChange={(value) => setLocationDraft((current) => ({ ...current, activity: value }))} /><SelectField label="DISPLAY STATUS" value={locationDraft.status} options={["NOMINAL", "ELEVATED", "QUIET"]} onChange={(value) => setLocationDraft((current) => ({ ...current, status: value as typeof current.status }))} /></div><Button type="submit"><Save size={14} /> SAVE MARKER</Button></form><div className="admin-record-list location-record-list">{data.locations.map((location) => <article key={location.id}><div><b>{location.name}</b><small>{location.region} · X {location.x}% / Y {location.y}%</small></div><span>ACTIVITY {location.activity}%</span><span className={`table-status status-${location.status.toLowerCase()}`}><i />{location.status}</span><Button variant="ghost" size="icon" aria-label={`Delete ${location.name}`} onClick={() => updateData((current) => ({ ...current, locations: current.locations.filter((item) => item.id !== location.id), missions: current.missions.map((mission) => mission.locationId === location.id ? { ...mission, locationId: "" } : mission) }))}><Trash2 size={14} /></Button></article>)}</div></Panel>}

        {tab === "ALERTS" && <Panel title="Alert center records" tag={`${data.alerts.length} ALERTS`} icon={<AlertTriangle size={15} />}><form className="admin-create-form" onSubmit={saveAlert}><h3><Plus size={14} /> ADD FICTIONAL ALERT</h3><div className="form-grid"><Field label="MESSAGE" value={alertDraft.message} placeholder="A staged narrative alert" onChange={(value) => setAlertDraft((current) => ({ ...current, message: value }))} required /><SelectField label="SEVERITY" value={alertDraft.severity} options={["ROUTINE", "ELEVATED", "CRITICAL"]} onChange={(value) => setAlertDraft((current) => ({ ...current, severity: value as Severity }))} /></div><Button type="submit"><Save size={14} /> ADD ALERT</Button></form><div className="admin-record-list">{data.alerts.map((alert) => <article key={alert.id}><div><b>{alert.message}</b><small>{alert.time} · {alert.acknowledged ? "ACKNOWLEDGED" : "OPEN"}</small></div><SeverityPill severity={alert.severity} /><Button variant="ghost" size="sm" disabled={alert.acknowledged} onClick={() => updateData((current) => ({ ...current, alerts: current.alerts.map((item) => item.id === alert.id ? { ...item, acknowledged: true } : item) }))}>{alert.acknowledged ? "ACKNOWLEDGED" : "ACK"}</Button><Button variant="ghost" size="icon" aria-label="Delete alert" onClick={() => updateData((current) => ({ ...current, alerts: current.alerts.filter((item) => item.id !== alert.id) }))}><Trash2 size={14} /></Button></article>)}</div></Panel>}

        {tab === "SYSTEM STATUS" && <Panel title="Display-only status indicators" tag="EDITABLE DEMO VALUES" icon={<SignalIcon />}><div className="status-edit-grid">{data.metrics.map((metric) => <label className="status-edit-tile" key={metric.id}><span>{metric.label}</span><div><Input type="number" min="0" value={metric.value} onChange={(event) => updateData((current) => ({ ...current, metrics: current.metrics.map((item) => item.id === metric.id ? { ...item, value: Math.max(0, Number(event.target.value)) } : item) }))} aria-label={`Set ${metric.label}`} /><b>{metric.unit}</b></div><Progress value={Math.min(100, metric.value)} /><small>{metric.note} · DISPLAY ONLY</small></label>)}</div></Panel>}

        {tab === "EVENTS" && <Panel title="Timeline entries" tag={`${data.events.length} SEEDED`} icon={<ClockIcon />}><form className="admin-create-form" onSubmit={saveEvent}><h3><Plus size={14} /> ADD TIMELINE ENTRY</h3><div className="form-grid"><Field label="EVENT TITLE" value={eventDraft.title} placeholder="Scenario packet reviewed" onChange={(value) => setEventDraft((current) => ({ ...current, title: value }))} required /><Field label="DETAIL" value={eventDraft.detail} placeholder="Fictional event details" onChange={(value) => setEventDraft((current) => ({ ...current, detail: value }))} /><SelectField label="SEVERITY" value={eventDraft.severity} options={["ROUTINE", "ELEVATED", "CRITICAL"]} onChange={(value) => setEventDraft((current) => ({ ...current, severity: value as Severity }))} /></div><Button type="submit"><Save size={14} /> ADD EVENT</Button></form><div className="admin-record-list">{data.events.slice(0, 20).map((item) => <article key={item.id}><div><b>{item.title}</b><small>{item.detail}</small></div><SeverityPill severity={item.severity} /><span>{item.time}</span><Button variant="ghost" size="icon" aria-label={`Delete event ${item.title}`} onClick={() => updateData((current) => ({ ...current, events: current.events.filter((event) => event.id !== item.id) }))}><Trash2 size={14} /></Button></article>)}</div></Panel>}

        {tab === "BRIEFS" && <Panel title="Reports and intelligence briefs" tag="FICTIONAL COPY ONLY" icon={<FileText size={15} />}><form className="admin-create-form" onSubmit={saveBrief}><h3><Plus size={14} /> WRITE A PROP BRIEF</h3><div className="form-grid"><Field label="TITLE" value={briefDraft.title} placeholder="Synthetic sample review" onChange={(value) => setBriefDraft((current) => ({ ...current, title: value }))} required /><SelectField label="CLASSIFICATION" value={briefDraft.classification} options={["LEVEL 2 · FICTIONAL", "LEVEL 3 · FICTIONAL", "LEVEL 4 · FICTIONAL"]} onChange={(value) => setBriefDraft((current) => ({ ...current, classification: value }))} /></div><div className="field-block"><Label htmlFor="brief-body">BRIEF TEXT</Label><Textarea id="brief-body" value={briefDraft.text} onChange={(event) => setBriefDraft((current) => ({ ...current, text: event.target.value }))} placeholder="Write invented narrative copy…" rows={5} /></div><Button type="submit" disabled={!briefDraft.title.trim() || !briefDraft.text.trim()}><Save size={14} /> SAVE FICTIONAL BRIEF</Button></form><div className="admin-record-list brief-record-list">{data.briefs.map((brief) => <article key={brief.id}><div><b>{brief.title}</b><small>{brief.id} · {brief.classification}</small></div><Link to="/reports/$id" params={{ id: brief.id }}><ArrowUpRight size={14} /> REPORT VIEW</Link></article>)}</div><p className="admin-field-note">SIGN-OFF FIELDS ARE DISPLAY-ONLY. Do not use real names, real authorization codes, or external records.</p></Panel>}

        {tab === "TARGETS" && <Panel title="Fictional codename list" tag="INVENTED NAMES ONLY" icon={<Users size={15} />}><div className="admin-warning compact-warning"><AlertTriangle size={15} /><span>Use fictional codenames only. Do not enter names that identify real people.</span></div><form className="inline-create-form" onSubmit={(event) => { event.preventDefault(); if (!targetDraft.trim()) return; updateData((current) => ({ ...current, targets: [...current.targets, targetDraft.trim().toUpperCase()] })); setTargetDraft(""); toast.success("Fictional codename added"); }}><Input value={targetDraft} onChange={(event) => setTargetDraft(event.target.value)} placeholder="SUBJECT PAPER-7" aria-label="Fictional codename" /><Button type="submit" disabled={!targetDraft.trim()}><Plus size={14} /> ADD CODENAME</Button></form><div className="target-list">{data.targets.map((target) => <div key={target}><span><Users size={14} />{target}</span><small>FICTIONAL CODE</small><Button variant="ghost" size="icon" aria-label={`Remove ${target}`} onClick={() => updateData((current) => ({ ...current, targets: current.targets.filter((item) => item !== target) }))}><Trash2 size={14} /></Button></div>)}</div></Panel>}

        {tab === "ASSETS" && <Panel title="Asset management" tag="PROP INVENTORY" icon={<NetworkIcon />}><form className="inline-create-form" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const values = new FormData(form); const name = String(values.get("name") ?? "").trim(); if (!name) return; updateData((current) => ({ ...current, assets: [...current.assets, { id: `asset-${Date.now()}`, name: name.toUpperCase(), type: String(values.get("type") ?? "PROP ASSET").toUpperCase(), status: "STAGED" }] })); form.reset(); toast.success("Fictional asset added"); }}><Input name="name" placeholder="RELAY-16" aria-label="Fictional asset name" required /><Input name="type" placeholder="PROP TYPE" aria-label="Fictional asset type" /><Button type="submit"><Plus size={14} /> ADD ASSET</Button></form><div className="admin-record-list">{data.assets.map((asset) => <article key={asset.id}><div><b>{asset.name}</b><small>{asset.type}</small></div><span className="table-status status-nominal"><i />{asset.status}</span><Button variant="ghost" size="icon" aria-label={`Delete ${asset.name}`} onClick={() => updateData((current) => ({ ...current, assets: current.assets.filter((item) => item.id !== asset.id) }))}><Trash2 size={14} /></Button></article>)}</div><div className="admin-field-note">Topology labels on the command center update from these fictional asset entries.</div></Panel>}
      </div>
    </div>
    <div className="admin-exit-row"><span>Local edits update the prop dashboard immediately and persist in this browser only.</span><Button variant="outline" onClick={() => setAuthorized(false)}><X size={13} /> LOCK PANEL</Button></div>
  </div></AegisShell>;
}

function Field({ label, value, placeholder, onChange, required }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void; required?: boolean }) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <div className="field-block"><Label htmlFor={id}>{label}</Label><Input id={id} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(event.target.value)} /></div>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <div className="field-block"><Label htmlFor={id}>{label}</Label><select id={id} className="admin-select" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></div>;
}

function NumberField({ label, value, max = 100, onChange }: { label: string; value: number; max?: number; onChange: (value: number) => void }) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <div className="field-block"><Label htmlFor={id}>{label}</Label><Input id={id} type="number" min="0" max={max} value={value} onChange={(event) => onChange(Math.min(max, Math.max(0, Number(event.target.value))))} /></div>;
}

function SignalIcon() { return <Activity size={14} />; }
function ClockIcon() { return <Activity size={14} />; }
function NetworkIcon() { return <SignalIcon />; }