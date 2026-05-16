import { prisma } from "@/server/db";
import type { NormalizedCustomerCreateInput } from "./customer-schema";

const DEFAULT_WORKSPACE_ID = "default-workspace";
const DEFAULT_OWNER_ID = "default-owner";

export type CustomerRepository = {
  create(input: NormalizedCustomerCreateInput): Promise<{ id: string; displayName: string }>;
};

export const customerRepository: CustomerRepository = {
  async create(input) {
    return prisma.customer.create({
      data: {
        ...input,
        workspaceId: DEFAULT_WORKSPACE_ID,
        ownerUserId: DEFAULT_OWNER_ID,
      },
      select: { id: true, displayName: true },
    });
  },
};

export async function listCustomers(params: {
  query?: string;
  layer?: string;
  stage?: string;
}) {
  return prisma.customer.findMany({
    where: {
      workspaceId: DEFAULT_WORKSPACE_ID,
      archivedAt: null,
      displayName: params.query
        ? { contains: params.query, mode: "insensitive" }
        : undefined,
      currentLayer: params.layer ? (params.layer as never) : undefined,
      currentStage: params.stage ? (params.stage as never) : undefined,
    },
    orderBy: { updatedAt: "desc" },
    include: { aiAnalyses: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
}
