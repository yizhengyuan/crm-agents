"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  normalizeCustomerInput,
  type CustomerCreateInput,
} from "./customer-schema";
import {
  customerRepository,
  type CustomerRepository,
} from "./customer-repository";

export async function createCustomerForTest(
  input: CustomerCreateInput,
  repository: CustomerRepository,
) {
  return repository.create(normalizeCustomerInput(input));
}

export async function createCustomerAction(formData: FormData) {
  const customer = await customerRepository.create(
    normalizeCustomerInput({
      displayName: String(formData.get("displayName") ?? ""),
      wechatName: String(formData.get("wechatName") ?? ""),
      wechatId: String(formData.get("wechatId") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      roleTitle: String(formData.get("roleTitle") ?? ""),
      sourceChannel: String(formData.get("sourceChannel") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    }),
  );

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomerLabelsAction(
  customerId: string,
  formData: FormData,
) {
  const { updateCustomerLabels } = await import("./customer-repository");

  await updateCustomerLabels(customerId, {
    layer: String(formData.get("layer") || "") || null,
    stage: String(formData.get("stage") || "") || null,
    valueRiskNotes:
      String(formData.get("valueRiskNotes") || "").trim() || null,
  });

  revalidatePath(`/customers/${customerId}`);
}
