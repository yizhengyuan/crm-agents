import { describe, expect, it } from "vitest";
import {
  CUSTOMER_LAYERS,
  CUSTOMER_STAGES,
  VALUE_RISK_RULES,
  findCustomerLayer,
  findCustomerStage,
} from "./tag-system";

describe("tag system", () => {
  it("contains five fixed customer layers", () => {
    expect(CUSTOMER_LAYERS.map((layer) => layer.code)).toEqual(["S", "A", "B", "C", "D"]);
    expect(findCustomerLayer("S")?.name).toBe("超高客单客户");
  });

  it("contains six fixed customer stages", () => {
    expect(CUSTOMER_STAGES.map((stage) => stage.code)).toEqual([
      "greeting_materials",
      "discover_needs",
      "build_trust",
      "present_offer",
      "offline_conversion",
      "maintenance_referral",
    ]);
    expect(findCustomerStage("build_trust")?.name).toBe("建信任，高互动");
  });

  it("contains the three one-vote veto risk rules", () => {
    expect(VALUE_RISK_RULES.map((rule) => rule.code)).toEqual([
      "self_centered",
      "entrepreneurial_illusion",
      "networking_mixer",
    ]);
  });
});
