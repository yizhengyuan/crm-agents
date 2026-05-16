import { describe, expect, it, vi } from "vitest";
import { createCustomerForTest } from "./customer-actions";

describe("customer actions", () => {
  it("normalizes input before creating a customer", async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({ id: "customer_1", displayName: "张三" }),
    };

    const result = await createCustomerForTest(
      { displayName: " 张三 ", company: "  增长科技  ", wechatName: " " },
      repository,
    );

    expect(repository.create).toHaveBeenCalledWith({
      displayName: "张三",
      wechatName: null,
      wechatId: null,
      phone: null,
      company: "增长科技",
      industry: null,
      roleTitle: null,
      sourceChannel: null,
      notes: null,
    });
    expect(result.id).toBe("customer_1");
  });
});
