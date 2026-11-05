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
