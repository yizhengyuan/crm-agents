import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerList } from "@/features/customers/CustomerList";
import { listCustomers } from "@/features/customers/customer-repository";
import { cn } from "@/lib/utils";
import { UserPlus, Search } from "lucide-react";

export const dynamic = "force-dynamic";

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
          <h1 className="text-2xl font-bold tracking-tight">客户列表</h1>
          <p className="mt-1 text-muted-foreground">
            搜索、筛选并管理你的客户。
          </p>
        </div>
        <Link
          href="/customers/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <UserPlus className="h-4 w-4" />
          新建客户
        </Link>
      </div>

      <Card>
        <CardContent className="pt-4">
          <form className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={params.query ?? ""}
                placeholder="搜索客户称呼"
                className="pl-9"
              />
            </div>
            <Button variant="outline" type="submit">
              <Search className="h-4 w-4" />
              搜索
            </Button>
          </form>
        </CardContent>
      </Card>

      <CustomerList customers={customers} />
    </div>
  );
}
