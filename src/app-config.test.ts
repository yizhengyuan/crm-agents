import { describe, expect, it } from "vitest";
import { appConfig } from "./app-config";

describe("appConfig", () => {
  it("exposes the CRM product name", () => {
    expect(appConfig.name).toBe("私域 CRM 客户知识库");
    expect(appConfig.defaultWorkspaceName).toBe("默认工作区");
  });
});
