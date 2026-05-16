import { notFound } from "next/navigation";
import { CustomerDetail } from "@/features/customers/CustomerDetail";
import { getCustomerDetail } from "@/features/customers/customer-repository";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = await getCustomerDetail(customerId);
  if (!customer) notFound();
  return <CustomerDetail customer={customer} />;
}
