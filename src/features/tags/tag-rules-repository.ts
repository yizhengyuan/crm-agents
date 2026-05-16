import { prisma } from "@/server/db";

const DEFAULT_WORKSPACE_ID = "default-workspace";

export async function listTagRules() {
  return prisma.tagRule.findMany({
    where: { workspaceId: DEFAULT_WORKSPACE_ID },
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });
}

export async function updateTagRule(
  ruleId: string,
  input: { description: string; criteria: string },
) {
  return prisma.tagRule.update({ where: { id: ruleId }, data: input });
}
