import Link from "next/link";
import type { CustomerLayer, CustomerStage } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

type CustomerListItem = {
  id: string;
  displayName: string;
  company: string | null;
  roleTitle: string | null;
  currentLayer: CustomerLayer | null;
  currentStage: CustomerStage | null;
  updatedAt: Date;
};

const layerBadgeClasses: Record<string, string> = {
  S: "bg-emerald-100 text-emerald-800 border-emerald-200",
  A: "bg-blue-100 text-blue-800 border-blue-200",
  B: "bg-purple-100 text-purple-800 border-purple-200",
  C: "bg-slate-100 text-slate-700 border-slate-200",
  D: "bg-gray-100 text-gray-600 border-gray-200",
};

const stageLabels: Record<string, string> = {
  greeting_materials: "打招呼",
  discover_needs: "探需求",
  build_trust: "建信任",
  present_offer: "亮产品",
  offline_conversion: "做转化",
  maintenance_referral: "维护转介绍",
};

export function CustomerList({ customers }: { customers: CustomerListItem[] }) {
  if (customers.length === 0) {
    return (
      <Card className="border-dashed p-10 text-center text-muted-foreground">
        <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
        还没有客户，先创建一个真实客户。
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>客户</TableHead>
            <TableHead>公司/角色</TableHead>
            <TableHead>分层</TableHead>
            <TableHead>阶段</TableHead>
            <TableHead className="text-right">更新时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/customers/${customer.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {customer.displayName}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {[customer.company, customer.roleTitle]
                  .filter(Boolean)
                  .join(" / ") || "-"}
              </TableCell>
              <TableCell>
                {customer.currentLayer ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-semibold",
                      layerBadgeClasses[customer.currentLayer],
                    )}
                  >
                    {customer.currentLayer}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">未定</span>
                )}
              </TableCell>
              <TableCell>
                {customer.currentStage ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    {stageLabels[customer.currentStage] ?? customer.currentStage}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">未定</span>
                )}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {customer.updatedAt.toLocaleDateString("zh-CN")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
