import { notFound } from "next/navigation";
import { CustomerDetail } from "@/features/customers/CustomerDetail";
import { getCustomerDetail } from "@/features/customers/customer-repository";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = await getCustomerDetail(customerId);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-1.5",
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        返回客户列表
      </Link>
      <CustomerDetail customer={customer} />
    </div>
  );
}
