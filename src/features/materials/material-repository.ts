import type { OcrStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import type { MaterialCreateInput } from "./material-schema";

export async function createMaterial(input: MaterialCreateInput) {
  return prisma.customerMaterial.create({
    data: {
      ...input,
      ocrStatus:
        input.type === "screenshot" ? "pending" : "not_required",
    },
  });
}

export async function listMaterials(customerId: string) {
  return prisma.customerMaterial.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateMaterialOcrResult(
  materialId: string,
  input: {
    ocrStatus: OcrStatus;
    extractedText?: string;
    ocrModel?: string;
    ocrError?: string;
    ocrCompletedAt?: Date;
  },
) {
  return prisma.customerMaterial.update({
    where: { id: materialId },
    data: input,
  });
}
