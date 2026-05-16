import { z } from "zod";

export const materialTypeSchema = z.enum([
  "manual_note",
  "chat_text",
  "screenshot",
  "attachment",
]);

export const materialCreateSchema = z
  .object({
    customerId: z.string().min(1),
    type: materialTypeSchema,
    title: z.string().trim().min(1, "资料标题不能为空"),
    contentText: z.string().trim().optional(),
    fileUrl: z.string().optional(),
    fileKey: z.string().optional(),
    storageBucket: z.string().optional(),
    mimeType: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().int().positive().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      (value.type === "manual_note" || value.type === "chat_text") &&
      !value.contentText
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["contentText"],
        message: "文字资料必须填写内容",
      });
    }
    if (
      (value.type === "screenshot" || value.type === "attachment") &&
      !value.fileUrl
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["fileUrl"],
        message: "文件资料必须包含文件地址",
      });
    }
  });

export type MaterialCreateInput = z.infer<typeof materialCreateSchema>;
