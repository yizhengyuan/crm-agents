export type CustomerLayerCode = "S" | "A" | "B" | "C" | "D";

export type CustomerStageCode =
  | "greeting_materials"
  | "discover_needs"
  | "build_trust"
  | "present_offer"
  | "offline_conversion"
  | "maintenance_referral";

export type ValueRiskCode =
  | "self_centered"
  | "entrepreneurial_illusion"
  | "networking_mixer";

type RuleItem<TCode extends string> = {
  code: TCode;
  name: string;
  description: string;
  criteria: string;
};

export const CUSTOMER_LAYERS: RuleItem<CustomerLayerCode>[] = [
  {
    code: "S",
    name: "超高客单客户",
    description:
      "有可能付费咨询/顾问产品（≥10 万元），或可能推荐 3 个以上高客单客户的节点型客户。",
    criteria: "重点观察其决策身份、业务规模、付费能力、节点影响力和转介绍潜力。",
  },
  {
    code: "A",
    name: "高客单客户",
    description: "有可能付费创业进化营产品（≥2 万元）的客户。",
    criteria: "重点观察创业状态、增长需求、学习预算和对系统化陪跑的接受度。",
  },
  {
    code: "B",
    name: "准高客单客户",
    description: "有可能付费起源合伙人产品（1 万元左右）的客户。",
    criteria: "重点观察是否处于创业或筹备创业状态，以及是否有明确的启动需求。",
  },
  {
    code: "C",
    name: "中客单客户",
    description: "有可能付费百元线上课或千元线下课的客户。",
    criteria: "重点观察其对低门槛课程、线下活动和主题内容的兴趣。",
  },
  {
    code: "D",
    name: "低客单客户",
    description: "停留在低价引流课和免费资料阶段的客户。",
    criteria: "重点观察是否只领取资料、缺少付费意愿或缺少明确增长需求。",
  },
];

export const CUSTOMER_STAGES: RuleItem<CustomerStageCode>[] = [
  {
    code: "greeting_materials",
    name: "打招呼，给资料",
    description: "加上微信，做好自我介绍，送出免费的引流资料和引流测试。",
    criteria: "适用于刚建立联系、还未形成需求判断的客户。",
  },
  {
    code: "discover_needs",
    name: "探需求，收信息",
    description:
      "依据资料和测试做好陪学、督学，在互动中探明基础信息和基本需求，完成首次标签。",
    criteria: "适用于已有初步互动，但信息仍在收集阶段的客户。",
  },
  {
    code: "build_trust",
    name: "建信任，高互动",
    description:
      "在朋友圈、私聊两个场景中互动，给予情绪价值和干货资料，拉近关系。",
    criteria: "适用于需求已初步明确，需要持续建立信任的客户。",
  },
  {
    code: "present_offer",
    name: "亮产品，真连接",
    description:
      "亮出产品与服务，邀请参与合伙人面诊、低价引流课、线下小活动。",
    criteria: "适用于可开始介绍具体产品或邀请真实连接的客户。",
  },
  {
    code: "offline_conversion",
    name: "来线下，做转化",
    description: "来到线下大课，感受完整内容体系，集中转化。",
    criteria: "适用于已经进入线下场景或临近转化节点的客户。",
  },
  {
    code: "maintenance_referral",
    name: "维护好，转介绍",
    description:
      "进入创业进化营后，做好陪学、陪聊和朋友圈互动，争取形成转介绍。",
    criteria: "适用于已成交或高信任客户，需要维护和转介绍经营。",
  },
];

export const VALUE_RISK_RULES: RuleItem<ValueRiskCode>[] = [
  {
    code: "self_centered",
    name: "自我中心",
    description: "不尊重主办方，哗众取宠，热爱自我表现，不分场合推销自己。",
    criteria: "出现明显不尊重、不分场合自我推销、破坏社群氛围时标记。",
  },
  {
    code: "entrepreneurial_illusion",
    name: "创业幻觉",
    description: "项目起步期估值超 10 亿，自我评价与真实水平差距过大。",
    criteria: "出现明显估值泡沫、自我认知失真且难以沟通时标记。",
  },
  {
    code: "networking_mixer",
    name: "圈层混子",
    description: "没有任何学习意愿，只想入群加微信、入圈递名片。",
    criteria: "出现只索取人脉资源、不参与学习、不尊重交付边界时标记。",
  },
];

export function findCustomerLayer(code: CustomerLayerCode) {
  return CUSTOMER_LAYERS.find((layer) => layer.code === code);
}

export function findCustomerStage(code: CustomerStageCode) {
  return CUSTOMER_STAGES.find((stage) => stage.code === code);
}
