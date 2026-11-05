import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/prop/shell";
import { usePropStore } from "@/components/prop/store";
import { checkPin, parseRows, rowsToText, type Tool } from "@/lib/prop-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Sentinel" },
      { name: "description", content: "Configure Sentinel console branding and the results each tool shows." },
      { property: "og:title", content: "Admin · Sentinel" },
      { property: "og:description", content: "Sentinel admin settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  return (
    <Shell>
      {!unlocked ? (
        <form className="card narrow center" onSubmit={(e) => { e.preventDefault(); if (checkPin(pin)) setUnlocked(true); else { setError(true); setPin(""); } }}>
          <h1>Admin</h1>
          <p className="muted">Enter the admin PIN.</p>
          <input className="pin-input" inputMode="numeric" maxLength={8} type="password" autoFocus value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }} aria-label="Admin PIN" />
          {error && <p className="error">Wrong PIN.</p>}
          <button className="btn primary full" disabled={!pin}>Unlock</button>
        </form>
      ) : <Settings />}
    </Shell>
  );
}

function Settings() {
  const { config, update, reset } = usePropStore();
  const [toolId, setToolId] = useState(config.tools[0].id);
  const tool = config.tools.find((t) => t.id === toolId) ?? config.tools[0];

  const setTool = (patch: Partial<Tool>) => update((c) => ({ ...c, tools: c.tools.map((t) => (t.id === tool.id ? { ...t, ...patch } : t)) }));

  function onFavicon(file?: File) {
    if (!file) return;
    if (file.size > 300_000) return toast.error("Please use an image under 300 KB.");
    const reader = new FileReader();
    reader.onload = () => { update((c) => ({ ...c, favicon: String(reader.result) })); toast.success("Icon updated"); };
    reader.readAsDataURL(file);
  }

  return (
    <div className="admin">
      <div className="page-head"><h1>Admin</h1><p className="muted">Changes save automatically on this device.</p></div>

      <section className="card">
        <h2>Branding</h2>
        <div className="form-grid">
          <label className="field"><span>App name</span><input value={config.appName} onChange={(e) => update((c) => ({ ...c, appName: e.target.value }))} /></label>
          <div className="field">
            <span>Site icon (favicon)</span>
            <div className="favicon-row">
              <span className="favicon-preview">{config.favicon ? <img src={config.favicon} alt="Current icon" /> : <span className="brand-dot" />}</span>
              <label className="btn">Upload<input type="file" accept="image/*" hidden onChange={(e) => onFavicon(e.target.files?.[0])} /></label>
              {config.favicon && <button className="btn ghost" onClick={() => update((c) => ({ ...c, favicon: null }))}>Remove</button>}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Tool results</h2>
        <div className="tabs">{config.tools.map((t) => <button key={t.id} className={t.id === tool.id ? "active" : ""} onClick={() => setToolId(t.id)}>{t.name}</button>)}</div>
        <div className="form-grid">
          <label className="field"><span>Tool name</span><input value={tool.name} onChange={(e) => setTool({ name: e.target.value })} /></label>
          <label className="field"><span>Description</span><input value={tool.blurb} onChange={(e) => setTool({ blurb: e.target.value })} /></label>
          <label className="field"><span>Input label</span><input value={tool.inputLabel} onChange={(e) => setTool({ inputLabel: e.target.value })} /></label>
          <label className="field"><span>Show map with result</span><select value={tool.showMap ? "yes" : "no"} onChange={(e) => setTool({ showMap: e.target.value === "yes" })}><option value="yes">Yes</option><option value="no">No</option></select></label>
          <label className="field"><span>Progress steps (one per line)</span><textarea rows={6} key={tool.id + "s"} defaultValue={tool.steps.join("\n")} onBlur={(e) => { const s = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean); if (s.length) setTool({ steps: s }); }} /></label>
          <label className="field"><span>Result shown (Label: value, one per line)</span><textarea rows={6} key={tool.id + "r"} defaultValue={rowsToText(tool.result)} onBlur={(e) => setTool({ result: parseRows(e.target.value) })} /></label>
          {tool.showMap && <>
            <label className="field"><span>Pin left position ({tool.mapX}%)</span><input type="range" min={5} max={95} value={tool.mapX} onChange={(e) => setTool({ mapX: +e.target.value })} /></label>
            <label className="field"><span>Pin top position ({tool.mapY}%)</span><input type="range" min={5} max={95} value={tool.mapY} onChange={(e) => setTool({ mapY: +e.target.value })} /></label>
          </>}
        </div>
      </section>

      <button className="btn ghost danger" onClick={() => { if (confirm("Reset all settings?")) { reset(); toast.success("Settings reset"); } }}>Reset to defaults</button>
    </div>
  );
}
