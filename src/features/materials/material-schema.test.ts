import { describe, expect, it } from "vitest";
import { materialCreateSchema } from "./material-schema";

describe("material schema", () => {
  it("accepts pasted chat text", () => {
    const parsed = materialCreateSchema.parse({
      customerId: "c1",
      type: "chat_text",
      title: "5月14日聊天",
      contentText: "客户说想增长",
    });
    expect(parsed.type).toBe("chat_text");
  });

  it("rejects manual text with empty content", () => {
    expect(() =>
      materialCreateSchema.parse({
        customerId: "c1",
        type: "manual_note",
        title: "记录",
        contentText: " ",
      }),
    ).toThrow();
  });

  it("accepts screenshot with file payload", () => {
    const parsed = materialCreateSchema.parse({
      customerId: "c1",
      type: "screenshot",
      title: "截图",
      fileUrl: "https://example.com/img.png",
      fileKey: "c1/img.png",
      storageBucket: "crm-materials",
      fileName: "img.png",
      mimeType: "image/png",
      fileSize: 1024,
    });
    expect(parsed.type).toBe("screenshot");
    expect(parsed.fileUrl).toBe("https://example.com/img.png");
  });
});
