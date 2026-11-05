import { createServerFn } from "@tanstack/react-start";

export const simulateScenario = createServerFn({ method: "POST" })
  .inputValidator((input: { scenario: string }) => {
    const scenario = String(input?.scenario ?? "").trim();
    if (scenario.length < 10) throw new Error("Describe the scenario in a bit more detail.");
    if (scenario.length > 1500) throw new Error("Please keep the scenario under 1500 characters.");
    return { scenario };
  })
  .handler(async ({ data }) => {
    const { generateScenarioOutcome } = await import("./scenario.server");
    try {
      const text = await generateScenarioOutcome(data.scenario);
      if (!text.trim()) return { ok: false as const, error: "No outcome was generated. Try a different scenario." };
      return { ok: true as const, text };
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode;
      console.error("scenario generation failed", e);
      if (status === 429) return { ok: false as const, error: "Too many requests. Please wait a moment and try again." };
      if (status === 402) return { ok: false as const, error: "AI credits have run out. Add credits in your workspace to continue." };
      if (status === 403) return { ok: false as const, error: "This request was declined by the AI service." };
      return { ok: false as const, error: "The simulator couldn't generate an outcome right now." };
    }
  });
