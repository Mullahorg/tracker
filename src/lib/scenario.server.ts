import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const INSTRUCTIONS = `You write short, clearly fictional outcome reports for a film prop "training simulator".
Rules:
- Everything is invented: fictional names, places, numbers. Start with the line "SIMULATED OUTCOME — FICTIONAL TRAINING SCENARIO".
- Describe only narrative results (what the scene shows, the outcome, key fictional readouts).
- Never give real techniques, tools, commands, code, exploit steps, or instructions for surveillance, hacking, malware, or tracking real people. If asked, keep it vague and cinematic.
- Format: a one-line summary, then 4-6 "Label: value" readout lines, then a 2-3 sentence debrief. Under 180 words.`;

export async function generateScenarioOutcome(scenario: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: `Training scenario:\n${scenario}` }],
    maxRetries: 0,
    providerOptions: {
      openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
    },
  });
  return await result.text;
}
