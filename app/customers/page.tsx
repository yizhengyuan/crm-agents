import Link from "next/link";
import { CustomerList } from "@/features/customers/CustomerList";
import { listCustomers } from "@/features/customers/customer-repository";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const customers = await listCustomers({
    query: params.query,
    layer: params.layer,
    stage: params.stage,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">客户列表</h1>
          <p className="mt-1 text-crm-muted">搜索、筛选并进入客户知识库。</p>
        </div>
        <Link
          className="rounded-lg bg-crm-primary px-4 py-2 text-white"
          href="/customers/new"
        >
          新建客户
        </Link>
      </div>
      <form className="flex gap-3 rounded-2xl border border-crm-line bg-white p-4">
        <input
          name="query"
          defaultValue={params.query ?? ""}
          placeholder="搜索客户称呼"
          className="flex-1 rounded-lg border border-crm-line px-3 py-2"
        />
        <button className="rounded-lg border border-crm-line px-4 py-2">
          搜索
        </button>
      </form>
      <CustomerList customers={customers} />
    </div>
  );
}
