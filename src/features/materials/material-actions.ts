"use server";

import { revalidatePath } from "next/cache";
import { env } from "@/server/env";
import { materialCreateSchema } from "./material-schema";
import { createMaterial, updateMaterialOcrResult } from "./material-repository";
import { storeMaterialFile } from "./material-storage";
import { extractTextFromImage } from "./material-ocr";

export async function addMaterialAction(
  customerId: string,
  formData: FormData,
) {
  const type = String(formData.get("type"));
  const title = String(formData.get("title") || "客户资料");
  const contentText = String(formData.get("contentText") || "");
  const file = formData.get("file");

  const storedFile =
    file instanceof File && file.size > 0
      ? await storeMaterialFile(customerId, file)
      : null;

  const material = await createMaterial(
    materialCreateSchema.parse({
      customerId,
      type,
      title,
      contentText: contentText || undefined,
      ...(storedFile ?? {}),
    }),
  );

  // Screenshots enter OCR pipeline
  if (type === "screenshot" && material.id && storedFile) {
    try {
      await updateMaterialOcrResult(material.id, { ocrStatus: "running" });
      const extractedText = await extractTextFromImage(
        storedFile.fileUrl,
        storedFile.mimeType,
      );
      await updateMaterialOcrResult(material.id, {
        ocrStatus: "succeeded",
        extractedText,
        ocrModel: env.OPENAI_MODEL,
        ocrCompletedAt: new Date(),
      });
    } catch (error) {
      await updateMaterialOcrResult(material.id, {
        ocrStatus: "failed",
        ocrError: String(error),
      });
    }
  }

  revalidatePath(`/customers/${customerId}`);
}
