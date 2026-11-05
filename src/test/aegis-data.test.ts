import { describe, expect, it } from "vitest";
import { seedData, STORAGE_KEY } from "@/lib/aegis-data";

describe("AEGIS X fictional prop data", () => {
  it("ships six fabricated mission records", () => {
    expect(seedData.missions).toHaveLength(6);
  });

  it("ships five fictional operators", () => {
    expect(seedData.operators).toHaveLength(5);
  });

  it("ships twelve fictional timeline entries", () => {
    expect(seedData.events).toHaveLength(12);
  });

  it("ships four fictional alerts", () => {
    expect(seedData.alerts).toHaveLength(4);
  });

  it("ships six invented map labels with display-only percentage coordinates", () => {
    expect(seedData.locations).toHaveLength(6);
    expect(seedData.locations.every((location) => location.x >= 0 && location.x <= 100 && location.y >= 0 && location.y <= 100)).toBe(true);
  });

  it("ships three fictional briefs and five local comms threads", () => {
    expect(seedData.briefs).toHaveLength(3);
    expect(seedData.threads).toHaveLength(5);
  });

  it("persists demo edits under the fictional prop storage key", () => {
    expect(STORAGE_KEY).toBe("aegis-x-fictional-prop-v1");
  });
});