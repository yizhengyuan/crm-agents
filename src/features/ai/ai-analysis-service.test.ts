import { describe, expect, it } from "vitest";
import { buildCustomerAnalysisPrompt } from "./ai-analysis-prompts";

describe("AI analysis prompt", () => {
  it("includes customer facts, tag rules, extracted text, and anti-hallucination instruction", () => {
    const prompt = buildCustomerAnalysisPrompt({
      customer: {
        displayName: "张三",
        company: "增长科技",
        roleTitle: "创始人",
      },
      materials: [
        {
          title: "聊天",
          type: "chat_text",
          contentText: "我今年想把营收翻倍",
          extractedText: null,
        },
        {
          title: "截图",
          type: "screenshot",
          contentText: null,
          extractedText: "客户在群里说想做增长",
        },
      ],
      tagRules: [
        {
          category: "layer",
          code: "A",
          name: "高客单客户",
          description: "可能付费 2 万元以上",
          criteria: "有创业状态和增长需求",
        },
      ],
    });

    expect(prompt).toContain("张三");
    expect(prompt).toContain("我今年想把营收翻倍");
    expect(prompt).toContain("客户在群里说想做增长");
    expect(prompt).toContain("高客单客户");
    expect(prompt).toContain("不要凭空猜测");
  });
});
