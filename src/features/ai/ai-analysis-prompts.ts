type PromptCustomer = {
  displayName: string;
  company: string | null;
  roleTitle: string | null;
};

type PromptMaterial = {
  title: string;
  type: string;
  contentText: string | null;
  extractedText: string | null;
};

type PromptTagRule = {
  category: string;
  code: string;
  name: string;
  description: string;
  criteria: string;
};

export function buildCustomerAnalysisPrompt(input: {
  customer: PromptCustomer;
  materials: PromptMaterial[];
  tagRules: PromptTagRule[];
}) {
  const customerBlock = [
    `客户称呼：${input.customer.displayName}`,
    `公司/项目：${input.customer.company ?? "未知"}`,
    `职位/角色：${input.customer.roleTitle ?? "未知"}`,
  ].join("\n");

  const materialBlock = input.materials
    .map((material, index) => {
      const parts = [
        `资料 ${index + 1}`,
        `标题：${material.title}`,
        `类型：${material.type}`,
      ];
      if (material.contentText)
        parts.push(`手动/粘贴文字：${material.contentText}`);
      if (material.extractedText)
        parts.push(`截图识别文字：${material.extractedText}`);
      if (!material.contentText && !material.extractedText)
        parts.push("内容：仅有文件或截图，文字内容不足");
      return parts.join("\n");
    })
    .join("\n\n");

  const rulesBlock = input.tagRules
    .map((rule) =>
      [
        `${rule.category}/${rule.code}/${rule.name}`,
        `说明：${rule.description}`,
        `判断标准：${rule.criteria}`,
      ].join("\n"),
    )
    .join("\n\n");

  return [
    "你是私域 CRM 的客户理解助手。",
    "只基于给定客户资料和业务规则分析，不要凭空猜测。",
    "如果资料不足，请明确指出缺失信息，不要强行给结论。",
    "分层和分阶只是建议，最终由业务人员人工确认。",
    "",
    "# 客户信息",
    customerBlock,
    "",
    "# 客户资料",
    materialBlock || "没有客户资料。",
    "",
    "# 标签规则",
    rulesBlock,
    "",
    "# 输出格式",
    "请严格输出如下 JSON 结构（所有字段都必须有，无内容时用空字符串、空数组或 null）：",
    "{",
    '  "summary": string,                                  // 客户综合判断的一段话',
    '  "profileSignals": [{ "label": string, "evidence": string, "confidence": 0-100 }],',
    '  "needSignals": [{ "label": string, "evidence": string, "confidence": 0-100 }],',
    '  "paymentSignals": [{ "label": string, "evidence": string, "confidence": 0-100 }],',
    '  "valueRiskSignals": [{ "label": string, "evidence": string, "confidence": 0-100 }],',
    '  "recommendedLayer": "S"|"A"|"B"|"C"|"D"|null,        // 信息不足时填 null',
    '  "layerConfidence": 0-100,',
    '  "layerReason": string,',
    '  "recommendedStage": "greeting_materials"|"discover_needs"|"build_trust"|"present_offer"|"offline_conversion"|"maintenance_referral"|null,',
    '  "stageConfidence": 0-100,',
    '  "stageReason": string,',
    '  "evidenceQuotes": [string],                          // 关键证据原文',
    '  "missingInformation": [string]                       // 暂时缺失、影响判断的信息',
    "}",
    "只返回 JSON，不要加任何前后说明或代码块标记。",
  ].join("\n");
}
