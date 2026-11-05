import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { Shell } from "@/components/prop/shell";
import { simulateScenario } from "@/lib/scenario.functions";

export const Route = createFileRoute("/scenario")({
  head: () => ({
    meta: [
      { title: "Scenario simulator · Sentinel" },
      { name: "description", content: "Describe a fictional training scenario and get an AI-generated simulated outcome." },
      { property: "og:title", content: "Scenario simulator · Sentinel" },
      { property: "og:description", content: "AI-powered fictional training scenario outcomes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ScenarioPage,
});

function ScenarioPage() {
  const run = useServerFn(simulateScenario);
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await run({ data: { scenario } });
      if (res.ok) setOutput(res.text); else setError(res.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="page-head">
        <h1>Scenario simulator</h1>
        <p className="muted">Describe a fictional training scenario. AI writes a simulated outcome — nothing here is real.</p>
      </div>
      <div className="run-grid">
        <form className="card" onSubmit={submit}>
          <label className="field">
            <span>Scenario</span>
            <textarea rows={8} maxLength={1500} value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="e.g. A rookie analyst must locate a missing courier in a fictional coastal city before midnight." />
          </label>
          <button className="btn primary" disabled={loading || scenario.trim().length < 10}><Sparkles size={16} /> {loading ? "Simulating…" : "Generate outcome"}</button>
          {error && <p className="error">{error}</p>}
        </form>
        <div className="terminal scenario-out" aria-live="polite">
          {loading ? <><div>// running simulation…</div><span className="caret" /></> : output ? output : <div>// outcome will appear here</div>}
        </div>
      </div>
    </Shell>
  );
}
