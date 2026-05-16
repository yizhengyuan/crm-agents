import { describe, expect, it } from "vitest";
import { appConfig } from "./app-config";

describe("appConfig", () => {
  it("exposes the product name", () => {
    expect(appConfig.name).toBe("王二狗销售助理");
    expect(appConfig.defaultWorkspaceName).toBe("默认工作区");
  });

  it("includes a privacy notice about AI data usage", () => {
    expect(appConfig.privacyNotice).toContain("第三方 AI 模型");
    expect(appConfig.privacyNotice).toContain("人工确认");
  });
});
