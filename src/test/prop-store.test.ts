import { describe, expect, it } from "vitest";
import { checkLogin, checkPin, parseRows } from "@/lib/prop-store";

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

import { mergeConfig as _merge, defaultConfig as _def } from "@/lib/prop-store";
describe("tool list", () => {
  it("has 10 tools", () => expect(_def.tools).toHaveLength(10));
  it("adds new tools to older saved settings without losing edits", () => {
    const c = _merge({ tools: [{ ..._def.tools[0]!, name: "Edited" }] });
    expect(c.tools).toHaveLength(10);
    expect(c.tools[0]!.name).toBe("Edited");
  });
});
