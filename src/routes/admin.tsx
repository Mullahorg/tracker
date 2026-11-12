import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/prop/shell";
import { usePropStore } from "@/components/prop/store";
import { ScenarioPanel } from "@/components/prop/scenario-panel";
import { defaultLook, checkPin, MAX_DURATION_SECONDS, MIN_DURATION_SECONDS, parseRows, rowsToText, type SceneResult, type Tool } from "@/lib/prop-store";

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
          <label className="field">
            <span>Admin PIN</span>
            <input className="pin-input" inputMode="numeric" maxLength={8} type="password" autoFocus value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }} aria-label="Admin PIN" placeholder="••••••" />
            <small className="hint">8-digit PIN issued by your station administrator.</small>
          </label>
          {error && <p className="error">Wrong PIN.</p>}
          <button className="btn primary full" disabled={!pin}>Unlock</button>
        </form>
      ) : <AdminTabs />}
    </Shell>
  );
}

function AdminTabs() {
  const [tab, setTab] = useState<"settings" | "scenario">("settings");
  return (
    <>
      <div className="tabs admin-tabs">
        <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Settings</button>
        <button className={tab === "scenario" ? "active" : ""} onClick={() => setTab("scenario")}>Scenario builder</button>
      </div>
      {tab === "settings" ? <Settings /> : <ScenarioPanel />}
    </>
  );
}

function Settings() {
  const { config, update, reset } = usePropStore();
  const [toolId, setToolId] = useState(config.tools[0]?.id ?? "");
  const tool = config.tools.find((t) => t.id === toolId) ?? config.tools[0];

  if (!tool) return null;

  const setTool = (patch: Partial<Tool>) => update((c) => ({ ...c, tools: c.tools.map((t) => (t.id === tool.id ? { ...t, ...patch } : t)) }));
  const sceneResults = tool.sceneResults ?? [];

  const setScene = (id: string, patch: Partial<SceneResult>) => update((c) => ({
    ...c,
    tools: c.tools.map((item) => item.id === tool.id
      ? { ...item, sceneResults: (item.sceneResults ?? []).map((scene) => scene.id === id ? { ...scene, ...patch } : scene) }
      : item),
  }));

  const addScene = () => setTool({
    sceneResults: [...sceneResults, {
      id: globalThis.crypto.randomUUID(),
      name: `Scene ${sceneResults.length + 1}`,
      result: tool.result.map((row) => ({ ...row })),
    }],
  });

  const removeScene = (id: string) => setTool({ sceneResults: sceneResults.filter((scene) => scene.id !== id) });

  const setLook = (patch: Partial<typeof config.look>) => update((c) => ({ ...c, look: { ...c.look, ...patch } }));

  function onFavicon(file?: File) {
    if (!file) return;
    if (file.size > 300_000) { toast.error("Please use an image under 300 KB."); return; }
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
          <label className="field">
            <span>App name</span>
            <input value={config.appName} onChange={(e) => update((c) => ({ ...c, appName: e.target.value }))} placeholder="Sentinel" />
            <small className="hint">Shown in the header and browser tab title.</small>
          </label>
          <div className="field">
            <span>Site icon (favicon)</span>
            <div className="favicon-row">
              <span className="favicon-preview">{config.favicon ? <img src={config.favicon} alt="Current icon" /> : <img src="/logo.png" alt="Default icon" />}</span>
              <label className="btn">Upload<input type="file" accept="image/*" hidden onChange={(e) => onFavicon(e.target.files?.[0])} /></label>
              {config.favicon && <button className="btn ghost" onClick={() => update((c) => ({ ...c, favicon: null }))}>Remove</button>}
            </div>
            <small className="hint">Square PNG or SVG, under 300 KB, at least 64×64.</small>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Look and feel</h2>
        <div className="form-grid">
          <label className="field">
            <span>Accent colour</span>
            <span className="color-row"><input type="color" value={config.look.accent} onChange={(e) => setLook({ accent: e.target.value })} /><code>{config.look.accent}</code></span>
            <small className="hint">Used for buttons, focus rings, and highlights.</small>
          </label>
          <label className="field">
            <span>Terminal text colour</span>
            <span className="color-row"><input type="color" value={config.look.terminalText} onChange={(e) => setLook({ terminalText: e.target.value })} /><code>{config.look.terminalText}</code></span>
            <small className="hint">Applies to log output and inline code.</small>
          </label>
          <label className="field">
            <span>Falling code amount ({config.look.rain}%)</span>
            <input type="range" min={0} max={60} value={config.look.rain} onChange={(e) => setLook({ rain: +e.target.value })} />
            <small className="hint">Background density of the animated code rain.</small>
          </label>
          <label className="field">
            <span>Moving effects</span>
            <select value={config.look.effects ? "on" : "off"} onChange={(e) => setLook({ effects: e.target.value === "on" })}><option value="on">On</option><option value="off">Off</option></select>
            <small className="hint">Turn off to reduce motion on slower machines.</small>
          </label>
        </div>
        <button className="btn ghost" onClick={() => update((c) => ({ ...c, look: defaultLook }))}>Reset look</button>
      </section>

      <section className="card">
        <h2>Tool results</h2>
        <div className="tabs">{config.tools.map((t) => <button key={t.id} className={t.id === tool.id ? "active" : ""} onClick={() => setToolId(t.id)}>{t.name}</button>)}</div>
        <div className="form-grid">
          <label className="field">
            <span>Tool name</span>
            <input value={tool.name} onChange={(e) => setTool({ name: e.target.value })} placeholder="Satellite uplink" />
            <small className="hint">Displayed on the tool card and header.</small>
          </label>
          <label className="field">
            <span>Description</span>
            <input value={tool.blurb} onChange={(e) => setTool({ blurb: e.target.value })} placeholder="Establish a one-way data link to the target." />
            <small className="hint">One line shown under the tool name.</small>
          </label>
          <label className="field">
            <span>Input label</span>
            <input value={tool.inputLabel} onChange={(e) => setTool({ inputLabel: e.target.value })} placeholder="Target coordinates" />
            <small className="hint">Prompt shown above the target field on the run form.</small>
          </label>
          <label className="field">
            <span>Run outcome</span>
            <select value={tool.outcome} onChange={(e) => setTool({ outcome: e.target.value as Tool["outcome"] })}><option value="success">Success</option><option value="failure">Fail</option></select>
            <small className="hint">Whether the run finishes with a result or a failure notice.</small>
          </label>
          <label className="field">
            <span>Result delay (seconds)</span>
            <input type="number" min={MIN_DURATION_SECONDS} max={MAX_DURATION_SECONDS} step={1} value={tool.durationSeconds} onChange={(e) => { const value = e.currentTarget.valueAsNumber; if (Number.isFinite(value)) setTool({ durationSeconds: Math.min(MAX_DURATION_SECONDS, Math.max(MIN_DURATION_SECONDS, Math.round(value))) }); }} />
            <small className="hint">Between {MIN_DURATION_SECONDS} and {MAX_DURATION_SECONDS}s. Controls the progress animation length.</small>
          </label>
          <label className="field">
            <span>Show map with result</span>
            <select value={tool.showMap ? "yes" : "no"} onChange={(e) => setTool({ showMap: e.target.value === "yes" })}><option value="yes">Yes</option><option value="no">No</option></select>
            <small className="hint">Display a static location tile beside the result.</small>
          </label>
          <label className="field">
            <span>Progress steps (one per line)</span>
            <textarea rows={6} key={tool.id + "s"} defaultValue={tool.steps.join("\n")} onBlur={(e) => { const s = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean); if (s.length) setTool({ steps: s }); }} placeholder={"Establish uplink\nNegotiate handshake\nTransfer data"} />
            <small className="hint">Ordered list shown in the progress panel, one step per line.</small>
          </label>
          <label className="field">
            <span>Result shown (Label: value, one per line)</span>
            <textarea rows={6} key={tool.id + "r"} defaultValue={rowsToText(tool.result)} onBlur={(e) => setTool({ result: parseRows(e.target.value) })} placeholder={"Latitude: 51.5074\nLongitude: -0.1278\nSignal: strong"} />
            <small className="hint">Pairs displayed in the result table. Format: <code>Label: value</code>.</small>
          </label>
          {tool.showMap && <>
            <label className="field">
              <span>Pin left position ({tool.mapX}%)</span>
              <input type="range" min={5} max={95} value={tool.mapX} onChange={(e) => setTool({ mapX: +e.target.value })} />
              <small className="hint">Horizontal placement of the marker on the map.</small>
            </label>
            <label className="field">
              <span>Pin top position ({tool.mapY}%)</span>
              <input type="range" min={5} max={95} value={tool.mapY} onChange={(e) => setTool({ mapY: +e.target.value })} />
              <small className="hint">Vertical placement of the marker on the map.</small>
            </label>
          </>}
        </div>
        {tool.id === "track" && (
          <div className="scene-settings">
            <div className="scene-settings-head">
              <div><h3>Scene results</h3><p className="muted">Each scene name selects its own fictional result.</p></div>
              <button type="button" className="btn" onClick={addScene}>Add scene</button>
            </div>
            {sceneResults.map((scene) => (
              <div className="scene-profile" key={scene.id}>
                <div className="scene-profile-head">
                  <strong>{scene.name || "Unnamed scene"}</strong>
                  {sceneResults.length > 1 && <button type="button" className="btn ghost danger" onClick={() => removeScene(scene.id)} aria-label={`Remove ${scene.name || "scene"}`}>Remove</button>}
                </div>
                <div className="form-grid">
                  <label className="field">
                    <span>Scene name</span>
                    <input value={scene.name} onChange={(e) => setScene(scene.id, { name: e.target.value })} placeholder="Rehearsal B" />
                  </label>
                  <label className="field">
                    <span>Scene result (Label: value, one per line)</span>
                    <textarea rows={6} key={scene.id} defaultValue={rowsToText(scene.result)} onBlur={(e) => setScene(scene.id, { result: parseRows(e.target.value) })} placeholder={"Name: Fictional character\nLast seen: Set location"} />
                    <small className="hint">The result is chosen by scene name, not by a number entered during the run.</small>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button className="btn ghost danger" onClick={() => { if (confirm("Reset all settings?")) { reset(); toast.success("Settings reset"); } }}>Reset to defaults</button>
    </div>
  );
}
