import OpenAI from "openai";
import { env } from "@/server/env";

export async function extractTextFromImage(
  imageUrl: string,
  mimeType?: string,
): Promise<string> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for OCR / vision recognition");
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "请识别并提取这张截图中的所有文字内容。只输出识别到的文字，不要添加额外说明。",
          },
          { type: "input_image", image_url: imageUrl, detail: "auto" },
        ],
      },
    ],
  });

  return response.output_text?.trim() ?? "";
}
