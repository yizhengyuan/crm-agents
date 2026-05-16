import Link from "next/link";
import type { CustomerLayer, CustomerStage } from "@prisma/client";

type CustomerListItem = {
  id: string;
  displayName: string;
  company: string | null;
  roleTitle: string | null;
  currentLayer: CustomerLayer | null;
  currentStage: CustomerStage | null;
  updatedAt: Date;
};

export function CustomerList({ customers }: { customers: CustomerListItem[] }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-crm-line bg-white p-8 text-center text-crm-muted">
        还没有客户，先创建一个真实客户。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-crm-line bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-crm-surface text-crm-muted">
          <tr>
            <th className="px-4 py-3">客户</th>
            <th className="px-4 py-3">公司/角色</th>
            <th className="px-4 py-3">分层</th>
            <th className="px-4 py-3">阶段</th>
            <th className="px-4 py-3">更新时间</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t border-crm-line">
              <td className="px-4 py-3 font-medium">
                <Link href={`/customers/${customer.id}`}>
                  {customer.displayName}
                </Link>
              </td>
              <td className="px-4 py-3 text-crm-muted">
                {[customer.company, customer.roleTitle]
                  .filter(Boolean)
                  .join(" / ") || "-"}
              </td>
              <td className="px-4 py-3">{customer.currentLayer ?? "未定"}</td>
              <td className="px-4 py-3">
                {customer.currentStage ?? "未定"}
              </td>
              <td className="px-4 py-3 text-crm-muted">
                {customer.updatedAt.toLocaleDateString("zh-CN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
