import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const WORKSPACE_ID = "default-workspace";
const OWNER_ID = "default-owner";
const COUNT = 100;

const surnames = [
  "李", "王", "张", "刘", "陈", "杨", "黄", "赵", "吴", "周",
  "徐", "孙", "马", "朱", "胡", "郭", "何", "高", "林", "罗",
  "郑", "梁", "谢", "宋", "唐", "许", "韩", "冯", "邓", "曹",
];

const givenSyllables = [
  "明", "强", "伟", "磊", "勇", "军", "杰", "涛", "斌", "波",
  "辉", "鹏", "建", "华", "鑫", "宇", "浩", "凯", "晨", "阳",
  "婷", "雪", "莉", "丽", "敏", "静", "娜", "芳", "雯", "璐",
  "佳", "嘉", "怡", "悦", "妍", "瑶", "瑞", "晗", "彤", "媛",
];

const companyPrefix = [
  "蓝海", "云上", "智联", "聚创", "锐新", "盛达", "天宇", "拓展",
  "万象", "维度", "星辰", "源动", "卓越", "未来", "极客", "数创",
  "心动", "翰林", "汇通", "海纳", "瀚海", "百川", "鼎盛", "翼起",
];

const companySuffix = [
  "科技", "网络", "信息", "咨询", "传媒", "文化", "教育", "电商",
  "供应链", "数据", "营销", "智能", "孵化器", "投资", "传播",
];

const industries = [
  "教育培训", "短视频MCN", "私域代运营", "美业连锁", "餐饮连锁",
  "美妆护肤", "母婴用品", "知识付费", "B2B SaaS", "电商代运营",
  "心理咨询", "健身工作室", "广告投放", "财税咨询", "法律服务",
  "高端制造业", "新消费品牌", "宠物用品", "服装设计师",
];

const roles = [
  "创始人", "CEO", "联合创始人", "市场总监", "增长负责人",
  "运营总监", "操盘手", "品牌负责人", "投资人", "项目经理",
  "店长", "合伙人", "渠道总监", "投流负责人", "私域负责人",
];

const channels = [
  "朋友介绍", "抖音直播间", "视频号", "小红书", "微博",
  "线下沙龙", "公众号", "朋友圈广告", "知乎", "百度",
  "B站", "Boss直聘", "拉勾", "活动方介绍", "客户转介",
];

const layers = ["S", "A", "B", "C", "D", null, null] as const; // null 表示未分层
const layerWeights = [3, 12, 25, 30, 10, 15, 5]; // 总权重 100

const stages = [
  "greeting_materials",
  "discover_needs",
  "build_trust",
  "present_offer",
  "offline_conversion",
  "maintenance_referral",
  null,
] as const;
const stageWeights = [18, 22, 20, 18, 10, 8, 4];

const valueRiskNotes = [
  "客户长期不主动回复，疑似已被竞品锁定。",
  "出现明确价格异议，预算与方案不匹配。",
  "客户多次取消会议，黏度低。",
  null, null, null, null, null, null, null,
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted<T>(arr: readonly T[], weights: readonly number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

function makeName(): string {
  const surname = pick(surnames);
  const len = Math.random() < 0.6 ? 1 : 2;
  const given = Array.from({ length: len }, () => pick(givenSyllables)).join("");
  return surname + given;
}

function makePhone(): string {
  const prefixes = ["138", "139", "150", "158", "186", "188", "199", "176"];
  const tail = Math.floor(10000000 + Math.random() * 90000000).toString();
  return pick(prefixes) + tail;
}

function makeWechatId(name: string): string {
  const pinyinHint = ["xz", "lk", "wy", "mh", "gs", "tj", "yq", "zr"];
  const num = Math.floor(100 + Math.random() * 9000);
  return `${pick(pinyinHint)}_${name.charCodeAt(0).toString(16).slice(-2)}${num}`;
}

function makeCompany(): string {
  return `${pick(companyPrefix)}${pick(companySuffix)}`;
}

function daysAgo(maxDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * maxDays));
  d.setHours(Math.floor(Math.random() * 24));
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
}

async function main() {
  console.log(`Generating ${COUNT} customers...`);
  const data = Array.from({ length: COUNT }, () => {
    const name = makeName();
    const layer = pickWeighted(layers, layerWeights);
    const stage = pickWeighted(stages, stageWeights);
    const note = pick(valueRiskNotes);
    return {
      workspaceId: WORKSPACE_ID,
      ownerUserId: OWNER_ID,
      displayName: name,
      wechatName: Math.random() < 0.7 ? `${name}-${pick(["蓝色", "在路上", "做内容", "增长中", "稳住"])}` : null,
      wechatId: Math.random() < 0.85 ? makeWechatId(name) : null,
      phone: Math.random() < 0.6 ? makePhone() : null,
      company: Math.random() < 0.7 ? makeCompany() : null,
      industry: Math.random() < 0.8 ? pick(industries) : null,
      roleTitle: Math.random() < 0.7 ? pick(roles) : null,
      sourceChannel: Math.random() < 0.85 ? pick(channels) : null,
      notes: Math.random() < 0.4
        ? pick([
            "上次沟通需求集中在团队复制方法。",
            "对价格敏感，但愿意先试 1 个月。",
            "客户对于交付节奏期待很高。",
            "客户最近在做 IP 打造，关注私域转化。",
            "目前在评估 2-3 家服务方。",
          ])
        : null,
      currentLayer: layer as never,
      currentStage: stage as never,
      hasValueRisk: Boolean(note),
      valueRiskNotes: note,
      lastInteractionAt: daysAgo(60),
      createdAt: daysAgo(180),
    };
  });

  const result = await prisma.customer.createMany({ data, skipDuplicates: false });
  console.log(`Inserted ${result.count} customers.`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
