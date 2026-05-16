import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/server/env";
import {
  aiAnalysisOutputSchema,
  type AiAnalysisOutput,
} from "./ai-analysis-schema";

export type AnalysisMessageInput = {
  prompt: string;
};

export async function requestCustomerAnalysis(
  input: AnalysisMessageInput,
): Promise<AiAnalysisOutput> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required to run customer analysis");
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "user",
        content: [{ type: "input_text", text: input.prompt }],
      },
    ],
    text: {
      format: zodTextFormat(aiAnalysisOutputSchema, "customer_analysis"),
    },
  });

  const parsed = response.output_parsed;
  if (!parsed) {
    throw new Error(
      "OpenAI response did not include parsed customer analysis",
    );
  }
  return parsed;
}
