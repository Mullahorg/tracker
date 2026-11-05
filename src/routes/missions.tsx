import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownUp, ArrowUpRight, Clock3, Crosshair, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAegis } from "@/components/aegis/aegis-provider";
import { AegisShell, PageHeading, Panel, SeverityPill } from "@/components/aegis/aegis-ui";

export const Route = createFileRoute("/missions")({
  head: () => ({ meta: [{ title: "Mission Roster · AEGIS X" }, { name: "description", content: "Fictional mission roster and scenario workspaces for the AEGIS X movie prop." }, { property: "og:title", content: "Mission Roster · AEGIS X" }, { property: "og:description", content: "Fictional mission roster and scenario workspaces." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MissionsPage,
});

function MissionsPage() {
  const { data } = useAegis();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL STATUS");
  const [sort, setSort] = useState("PRIORITY");
  const missions = useMemo(() => data.missions.filter((mission) => `${mission.id} ${mission.codename} ${mission.objective}`.toLowerCase().includes(query.toLowerCase()) && (status === "ALL STATUS" || mission.status === status)).sort((a, b) => sort === "PROGRESS" ? b.progress - a.progress : sort === "CODE" ? a.codename.localeCompare(b.codename) : ["CRITICAL", "ELEVATED", "ROUTINE"].indexOf(a.priority) - ["CRITICAL", "ELEVATED", "ROUTINE"].indexOf(b.priority)), [data.missions, query, sort, status]);
  const counts = { active: data.missions.filter((item) => item.status === "ACTIVE").length, standby: data.missions.filter((item) => item.status === "STANDBY").length, complete: data.missions.filter((item) => item.status === "COMPLETE").length };
  return <AegisShell><div className="missions-page"><PageHeading eyebrow="AEGIS X / OPERATIONS" title="Mission roster" description="Scenario workspaces · fictional records only" actions={<Link to="/admin" className="button-link"><Plus size={14} /> NEW SCENARIO</Link>} />
    <div className="mission-summary-grid"><article><span>ACTIVE SCENARIOS</span><b>{String(counts.active).padStart(2, "0")}</b><small><i /> IN PROGRESS</small></article><article><span>STANDBY</span><b>{String(counts.standby).padStart(2, "0")}</b><small>QUEUED FOR REVIEW</small></article><article><span>COMPLETED</span><b>{String(counts.complete).padStart(2, "0")}</b><small>ARCHIVED LOCALLY</small></article><article><span>TOTAL RECORDS</span><b>{String(data.missions.length).padStart(2, "0")}</b><small>SEEDED / EDITABLE</small></article></div>
    <Panel title="Scenario records" tag="LOCAL DATASET" icon={<Crosshair size={15} />}><div className="mission-filters"><label className="roster-search"><Search size={14} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find scenario…" aria-label="Search scenarios" /></label><label className="select-filter"><Filter size={13} /><select aria-label="Filter scenario status" value={status} onChange={(event) => setStatus(event.target.value)}>{["ALL STATUS", "ACTIVE", "STANDBY", "COMPLETE"].map((item) => <option key={item}>{item}</option>)}</select></label><Button variant="outline" size="sm" onClick={() => setSort((current) => current === "PRIORITY" ? "PROGRESS" : current === "PROGRESS" ? "CODE" : "PRIORITY")}><ArrowDownUp size={13} /> SORT: {sort}</Button></div>
      <div className="mission-table-wrap"><table className="mission-table"><thead><tr><th>SCENARIO / REF</th><th>PRIORITY</th><th>STATUS</th><th>PROGRESS</th><th>LEAD TEAM</th><th>ETA</th><th /></tr></thead><tbody>{missions.map((mission) => <tr key={mission.id}><td><Link to="/missions/$id" params={{ id: mission.id }} className="table-mission-name">{mission.codename}<small>{mission.id} · {mission.objective}</small></Link></td><td><SeverityPill severity={mission.priority} /></td><td><span className={`table-status status-${mission.status.toLowerCase()}`}><i />{mission.status}</span></td><td><div className="table-progress"><Progress value={mission.progress} /><b>{mission.progress}%</b></div></td><td><div className="table-operators">{mission.operators.map((item) => <span key={item}>{item}</span>)}</div></td><td><span className="table-eta"><Clock3 size={12} />{mission.eta}</span></td><td><Link to="/missions/$id" params={{ id: mission.id }} aria-label={`Open ${mission.codename}`} className="table-open"><ArrowUpRight size={15} /></Link></td></tr>)}</tbody></table>{missions.length === 0 && <div className="table-empty">No matching fictional scenarios.</div>}</div>
      <div className="table-foot"><span>SHOWING {missions.length} OF {data.missions.length} SCENARIO RECORDS</span><span>LOCAL PROP DATASET · NO EXTERNAL CONNECTION</span></div>
    </Panel>
    <div className="mission-page-note"><span>SIMULATED SCENARIO INDEX</span><span>All entries are fabricated narrative content.</span></div>
  </div></AegisShell>;
}