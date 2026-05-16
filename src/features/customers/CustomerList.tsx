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
import { Users, AlertTriangle, MessageCircle } from "lucide-react";

type CustomerListItem = {
  id: string;
  displayName: string;
  wechatName: string | null;
  company: string | null;
  roleTitle: string | null;
  sourceChannel: string | null;
  currentLayer: CustomerLayer | null;
  currentStage: CustomerStage | null;
  hasValueRisk: boolean;
  lastInteractionAt: Date | null;
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
    <Card className="overflow-hidden border-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="min-w-[140px]">客户</TableHead>
            <TableHead className="hidden md:table-cell">公司/角色</TableHead>
            <TableHead className="hidden lg:table-cell">阶段</TableHead>
            <TableHead>分层</TableHead>
            <TableHead className="hidden xl:table-cell">来源</TableHead>
            <TableHead className="hidden xl:table-cell text-center">风险</TableHead>
            <TableHead className="hidden 2xl:table-cell">最近互动</TableHead>
            <TableHead className="text-right">更新</TableHead>
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
                  <div className="flex flex-col">
                    <span>{customer.displayName}</span>
                    {customer.wechatName && (
                      <span className="text-[11px] text-muted-foreground font-normal">
                        @{customer.wechatName}
                      </span>
                    )}
                  </div>
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {[customer.company, customer.roleTitle]
                  .filter(Boolean)
                  .join(" / ") || "-"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {customer.currentStage ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    {stageLabels[customer.currentStage] ?? customer.currentStage}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">未定</span>
                )}
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
              <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">
                {customer.sourceChannel ?? "-"}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-center">
                {customer.hasValueRisk ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] gap-0.5 bg-rose-50 text-rose-600 border-rose-200"
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    风险
                  </Badge>
                ) : (
                  <span className="text-muted-foreground/40 text-xs">-</span>
                )}
              </TableCell>
              <TableCell className="hidden 2xl:table-cell text-muted-foreground text-sm">
                {customer.lastInteractionAt
                  ? customer.lastInteractionAt.toLocaleDateString("zh-CN")
                  : "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                {customer.updatedAt.toLocaleDateString("zh-CN")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
