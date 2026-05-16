import { resolveClient } from "@/server/ai-client";
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
  const { client, model } = resolveClient();
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "你是一个销售助理，专门分析客户资料并给出跟进建议。请严格按 JSON 格式输出分析结果，不要输出任何 JSON 之外的内容。",
      },
      { role: "user", content: input.prompt },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("AI response did not include content");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  return aiAnalysisOutputSchema.parse(raw);
}
