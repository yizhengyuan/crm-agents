import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Users,
  UserPlus,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Bot,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { listCustomers } from "@/features/customers/customer-repository";

export const dynamic = "force-dynamic";

const layerBadgeClasses: Record<string, string> = {
  S: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border-amber-300",
  A: "bg-blue-50 text-blue-800 border-blue-200",
  B: "bg-purple-50 text-purple-800 border-purple-200",
  C: "bg-slate-100 text-slate-700 border-slate-200",
  D: "bg-gray-100 text-gray-600 border-gray-200",
};

export default async function HomePage() {
  let customers: Awaited<ReturnType<typeof listCustomers>> = [];
  try {
    customers = await listCustomers({});
  } catch {
    customers = [];
  }

  const totalCustomers = customers.length;
  const saCustomers = customers.filter(
    (c) => c.currentLayer === "S" || c.currentLayer === "A",
  ).length;
  const riskCustomers = customers.filter((c) => c.hasValueRisk).length;
  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="space-y-6 w-full">
      {/* Hero banner */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-sm">
        <CardContent className="relative z-10 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                AI 驱动 · 王二狗销售助理
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              欢迎使用王二狗销售助理
            </h1>
            <p className="text-sm opacity-90 max-w-xl">
              把碎片化的客户资料沉淀为可被 AI 理解的知识,自动给出分层、阶段、风险信号建议。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <Link
              href="/customers/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 bg-white text-indigo-600 hover:bg-white/90 shadow",
              )}
            >
              <UserPlus className="h-4 w-4" />
              新建客户
            </Link>
            <Link
              href="/customers"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              )}
            >
              <Users className="h-4 w-4" />
              查看全部客户
            </Link>
          </div>
        </CardContent>
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />
        <Bot className="absolute right-8 top-1/2 hidden h-24 w-24 -translate-y-1/2 text-white/20 md:block" strokeWidth={1} />
      </Card>

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="客户总数"
          value={totalCustomers}
          hint="持续沉淀中"
        />
        <StatCard
          icon={Layers}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          label="S/A 高价值客户"
          value={saCustomers}
          hint="重点维护对象"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          label="今日新增资料"
          value={8}
          hint="比昨天 +5"
          hintColor="text-emerald-600"
        />
        <StatCard
          icon={AlertTriangle}
          iconBg="bg-rose-100"
          iconColor="text-rose-500"
          label="价值观风险客户"
          value={riskCustomers}
          hint="需要复核"
          hintColor="text-rose-500"
        />
      </div>

      {/* Recent customers */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">最近客户</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                按更新时间排序
              </p>
            </div>
            <Link
              href="/customers"
              className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
            >
              查看全部
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentCustomers.length === 0 ? (
              <div className="border-dashed border-t p-10 text-center text-muted-foreground text-sm">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                还没有客户。
                <Link
                  href="/customers/new"
                  className="text-primary hover:underline ml-1"
                >
                  立刻添加 →
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {recentCustomers.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/customers/${c.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold">
                        {c.displayName.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">
                            {c.displayName}
                          </span>
                          {c.currentLayer && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold border",
                                layerBadgeClasses[c.currentLayer],
                              )}
                            >
                              {c.currentLayer}
                            </Badge>
                          )}
                          {c.hasValueRisk && (
                            <Badge
                              variant="outline"
                              className="text-[10px] gap-0.5 bg-rose-50 text-rose-600 border-rose-200"
                            >
                              <AlertTriangle className="h-2.5 w-2.5" />
                              风险
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {[c.company, c.roleTitle].filter(Boolean).join(" · ") ||
                            "暂无公司信息"}
                        </p>
                      </div>
                      <time className="text-xs text-muted-foreground shrink-0">
                        {c.updatedAt.toLocaleDateString("zh-CN")}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="border-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">快速入口</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickAction
              href="/customers/new"
              icon={UserPlus}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              title="新建客户"
              desc="录入一个真实客户"
            />
            <QuickAction
              href="/tags"
              icon={Layers}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
              title="标签体系"
              desc="查看分层与阶段规则"
            />
            <QuickAction
              href="/ai-analyses"
              icon={Sparkles}
              iconColor="text-violet-600"
              iconBg="bg-violet-100"
              title="AI 分析记录"
              desc="追溯每次 AI 判断"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  hint,
  hintColor = "text-muted-foreground",
}: {
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  hint: string;
  hintColor?: string;
}) {
  return (
    <Card className="border-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg)}>
              <Icon className={cn("h-4 w-4", iconColor)} />
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
          <p className="text-lg font-semibold tracking-tight">{value}</p>
        </div>
        <p className={cn("mt-1.5 text-[11px]", hintColor)}>{hint}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  desc,
}: {
  href: string;
  icon: typeof Users;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 hover:border-primary/30 transition-colors group"
    >
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
