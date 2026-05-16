import { z } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
  });

export const customerCreateSchema = z.object({
  displayName: z.string().trim().min(1, "客户称呼不能为空"),
  wechatName: optionalText,
  wechatId: optionalText,
  phone: optionalText,
  company: optionalText,
  industry: optionalText,
  roleTitle: optionalText,
  sourceChannel: optionalText,
  notes: optionalText,
});

export type CustomerCreateInput = z.input<typeof customerCreateSchema>;
export type NormalizedCustomerCreateInput = z.output<typeof customerCreateSchema>;

export function normalizeCustomerInput(
  input: CustomerCreateInput,
): NormalizedCustomerCreateInput {
  return customerCreateSchema.parse(input);
}
