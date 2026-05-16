import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  CUSTOMER_LAYERS,
  CUSTOMER_STAGES,
  VALUE_RISK_RULES,
} from "../src/features/tags/tag-system";
import { appConfig } from "../src/app-config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { id: "default-workspace" },
    update: { name: appConfig.defaultWorkspaceName },
    create: { id: "default-workspace", name: appConfig.defaultWorkspaceName },
  });

  await prisma.user.upsert({
    where: { id: "default-owner" },
    update: { name: "默认用户", workspaceId: workspace.id },
    create: {
      id: "default-owner",
      name: "默认用户",
      workspaceId: workspace.id,
      role: "owner",
    },
  });

  const rules = [
    ...CUSTOMER_LAYERS.map((rule) => ({ category: "layer", ...rule })),
    ...CUSTOMER_STAGES.map((rule) => ({ category: "stage", ...rule })),
    ...VALUE_RISK_RULES.map((rule) => ({ category: "value_risk", ...rule })),
  ];

  for (const rule of rules) {
    await prisma.tagRule.upsert({
      where: {
        workspaceId_category_code: {
          workspaceId: workspace.id,
          category: rule.category,
          code: rule.code,
        },
      },
      update: {
        name: rule.name,
        description: rule.description,
        criteria: rule.criteria,
      },
      create: {
        workspaceId: workspace.id,
        category: rule.category,
        code: rule.code,
        name: rule.name,
        description: rule.description,
        criteria: rule.criteria,
      },
    });
  }

  console.log(
    "Seed complete: workspace, owner, tag rules, and default prompt version v1.",
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
