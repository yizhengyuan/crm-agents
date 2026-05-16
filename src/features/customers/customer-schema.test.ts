import { describe, expect, it } from "vitest";
import { customerCreateSchema, normalizeCustomerInput } from "./customer-schema";

describe("customer schema", () => {
  it("accepts minimal customer input", () => {
    const parsed = customerCreateSchema.parse({ displayName: "张三" });
    expect(parsed.displayName).toBe("张三");
  });

  it("trims optional text fields and converts empty strings to null", () => {
    const normalized = normalizeCustomerInput({
      displayName: "  李四  ",
      wechatName: "  ",
      company: "  某某科技  ",
      roleTitle: " 创始人 ",
    });

    expect(normalized).toEqual({
      displayName: "李四",
      wechatName: null,
      wechatId: null,
      phone: null,
      company: "某某科技",
      industry: null,
      roleTitle: "创始人",
      sourceChannel: null,
      notes: null,
    });
  });

  it("rejects an empty display name", () => {
    expect(() => customerCreateSchema.parse({ displayName: "   " })).toThrow();
  });
});
