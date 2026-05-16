import { z } from "zod";

export const aiSignalSchema = z.object({
  label: z.string(),
  evidence: z.string(),
  confidence: z.number().int().min(0).max(100),
});

export const aiAnalysisOutputSchema = z.object({
  summary: z.string(),
  profileSignals: z.array(aiSignalSchema),
  needSignals: z.array(aiSignalSchema),
  paymentSignals: z.array(aiSignalSchema),
  valueRiskSignals: z.array(aiSignalSchema),
  recommendedLayer: z.enum(["S", "A", "B", "C", "D"]).nullable(),
  layerConfidence: z.number().int().min(0).max(100),
  layerReason: z.string(),
  recommendedStage: z
    .enum([
      "greeting_materials",
      "discover_needs",
      "build_trust",
      "present_offer",
      "offline_conversion",
      "maintenance_referral",
    ])
    .nullable(),
  stageConfidence: z.number().int().min(0).max(100),
  stageReason: z.string(),
  evidenceQuotes: z.array(z.string()),
  missingInformation: z.array(z.string()),
});

export type AiAnalysisOutput = z.infer<typeof aiAnalysisOutputSchema>;
