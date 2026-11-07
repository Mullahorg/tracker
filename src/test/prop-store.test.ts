import { describe, expect, it } from "vitest";
import { checkLogin, checkPin, parseRows, resultViewForTool } from "@/lib/prop-store";

describe("access codes", () => {
  it("accepts the login password zero4321#", () => {
    expect(checkLogin("zero4321#")).toBe(true);
    expect(checkLogin("zero4321")).toBe(false);
  });
  it("unlocks admin with 1838 only", () => {
    expect(checkPin("1838")).toBe(true);
    expect(checkPin("1234")).toBe(false);
  });
  it("parses admin result lines", () => {
    expect(parseRows("Name: Jane\nCity: Nairobi")).toEqual([{ label: "Name", value: "Jane" }, { label: "City", value: "Nairobi" }]);
  });
});

import { mergeConfig as _merge, defaultConfig as _def, DEFAULT_DURATION_SECONDS } from "@/lib/prop-store";
describe("tool list", () => {
  it("has 10 tools", () => expect(_def.tools).toHaveLength(10));
  it("defaults every tool to a successful simulated result after eight seconds", () => {
    expect(_def.tools.every((tool) => tool.outcome === "success" && tool.durationSeconds === 8)).toBe(true);
    expect(DEFAULT_DURATION_SECONDS).toBe(8);
  });
  it("adds new tools to older saved settings without losing edits", () => {
    const c = _merge({ tools: [{ ..._def.tools[0]!, name: "Edited" }] });
    expect(c.tools).toHaveLength(10);
    expect(c.tools[0]!.name).toBe("Edited");
  });
  it("fills timing and outcome defaults for older saved tool settings", () => {
    const first = _def.tools[0];
    if (!first) throw new Error("Expected a default tool");
    const legacyTool = { ...first, name: "Edited" } as Record<string, unknown>;
    delete legacyTool.outcome;
    delete legacyTool.durationSeconds;
    const config = _merge({ tools: [legacyTool as unknown as typeof first] });
    expect(config.tools[0]?.["outcome"]).toBe("success");
    expect(config.tools[0]?.["durationSeconds"]).toBe(8);
  });
  it("keeps an admin-selected failure and delay within the supported range", () => {
    const first = _def.tools[0];
    if (!first) throw new Error("Expected a default tool");
    const config = _merge({ tools: [{ ...first, outcome: "failure", durationSeconds: 14 }] });
    expect(config.tools[0]?.outcome).toBe("failure");
    expect(config.tools[0]?.durationSeconds).toBe(14);
  });
  it("assigns a dedicated simulated result view to every tool type", () => {
    expect(_def.tools.map((tool) => resultViewForTool(tool.id))).toEqual([
      "location", "spyware", "network", "archive", "credential", "chat", "camera", "network", "mail", "satellite",
    ]);
    expect(resultViewForTool("unknown")).toBe("generic");
  });
  it("uses fictional app identities and reserved invalid email domains in example results", () => {
    const passwordTool = _def.tools.find((tool) => tool.id === "password");
    const mailTool = _def.tools.find((tool) => tool.id === "mail");
    expect(passwordTool?.result.some((row) => row.value.includes("@paperkite.invalid"))).toBe(true);
    expect(passwordTool?.result.some((row) => row.label === "Matched hash" && row.value.includes("SIMULATED_SAMPLE_ONLY"))).toBe(true);
    expect(passwordTool?.result.some((row) => row.label === "Outcome" && row.value.includes("no password revealed"))).toBe(true);
    expect(mailTool?.result.every((row) => row.label.includes("@paperkite.invalid"))).toBe(true);
  });
});
