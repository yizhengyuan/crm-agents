import { resolveClient } from "@/server/ai-client";

export async function extractTextFromImage(
  imageUrl: string,
  mimeType?: string,
): Promise<string> {
  const { client, model } = resolveClient();
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "请识别并提取这张截图中的所有文字内容。只输出识别到的文字，不要添加额外说明。",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "auto" },
          },
        ],
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}
