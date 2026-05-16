"use server";

import { revalidatePath } from "next/cache";
import { updateTagRule } from "./tag-rules-repository";

export async function updateTagRuleAction(
  ruleId: string,
  formData: FormData,
) {
  await updateTagRule(ruleId, {
    description: String(formData.get("description") ?? "").trim(),
    criteria: String(formData.get("criteria") ?? "").trim(),
  });
  revalidatePath("/tags");
}
