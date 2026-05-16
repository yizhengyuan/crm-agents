import { CustomerForm } from "@/features/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">新建客户</h1>
        <p className="mt-1 text-muted-foreground">
          先用少量字段建档，后续再持续补充资料。
        </p>
      </div>
      <CustomerForm />
    </div>
  );
}
