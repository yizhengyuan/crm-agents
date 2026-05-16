"use server";

import { revalidatePath } from "next/cache";
import { env } from "@/server/env";
import {
  createAiAnalysisRecord,
  updateAiAnalysisStatus,
  getCustomerForAnalysis,
} from "@/features/customers/customer-repository";
import { buildCustomerAnalysisPrompt } from "./ai-analysis-prompts";
import { requestCustomerAnalysis } from "./ai-analysis-service";

const PROMPT_VERSION = "v1";

export async function runCustomerAnalysisAction(customerId: string) {
  const customer = await getCustomerForAnalysis(customerId);
  if (!customer) throw new Error("Customer not found");

  const materialIds = customer.materials.map((m) => m.id);
  const analysis = await createAiAnalysisRecord(
    customer.id,
    env.OPENAI_MODEL,
    PROMPT_VERSION,
    materialIds,
  );

  try {
    await updateAiAnalysisStatus(analysis.id, {
      status: "running",
      startedAt: new Date(),
    });

    const prompt = buildCustomerAnalysisPrompt({
      customer,
      materials: customer.materials,
      tagRules: customer.workspace.tagRules,
    });

    const output = await requestCustomerAnalysis({ prompt });

    await updateAiAnalysisStatus(analysis.id, {
      status: "succeeded",
      completedAt: new Date(),
      summary: output.summary,
      profileSignals: output.profileSignals,
      needSignals: output.needSignals,
      paymentSignals: output.paymentSignals,
      valueRiskSignals: output.valueRiskSignals,
      recommendedLayer: output.recommendedLayer,
      layerConfidence: output.layerConfidence,
      layerReason: output.layerReason,
      recommendedStage: output.recommendedStage,
      stageConfidence: output.stageConfidence,
      stageReason: output.stageReason,
      evidenceQuotes: output.evidenceQuotes,
      missingInformation: output.missingInformation,
    });
  } catch (error) {
    await updateAiAnalysisStatus(analysis.id, {
      status: "failed",
      errorMessage:
        error instanceof Error ? error.message : String(error),
      completedAt: new Date(),
    });
  }

  revalidatePath(`/customers/${customerId}`);
}
