"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { AiAnalysis, Customer, CustomerMaterial } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CUSTOMER_LAYERS, CUSTOMER_STAGES } from "@/features/tags/tag-system";
import { MaterialComposer } from "@/features/materials/MaterialComposer";
import { CustomerTimeline } from "./CustomerTimeline";
import { updateCustomerLabelsAction } from "./customer-actions";
import { runCustomerAnalysisAction } from "@/features/ai/ai-analysis-actions";
import { cn } from "@/lib/utils";
import {
  Star,
  AlertTriangle,
  Sparkles,
  Bot,
  Crown,
  Mountain,
  Target,
  UserCircle2,
  Wallet,
  HelpCircle,
  Pencil,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const layerBadgeClasses: Record<string, string> = {
  S: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border-amber-300",
  A: "bg-blue-50 text-blue-800 border-blue-200",
  B: "bg-purple-50 text-purple-800 border-purple-200",
  C: "bg-slate-100 text-slate-700 border-slate-200",
  D: "bg-gray-100 text-gray-600 border-gray-200",
};

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

type CustomerDetailProps = {
  customer: Customer & {
    materials: CustomerMaterial[];
    aiAnalyses: AiAnalysis[];
  };
};

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium truncate">{value}</span>
    </div>
  );
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const labelAction = updateCustomerLabelsAction.bind(null, customer.id);
  const analysisAction = runCustomerAnalysisAction.bind(null, customer.id);
  const latestAnalysis = customer.aiAnalyses[0];

  const riskPills = (customer.valueRiskNotes ?? "")
    .split(/[,、，；;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_400px]">
      {/* ── 左栏：客户资料 ── */}
      <aside>
        <Card className="overflow-hidden">
          {/* 头像区 */}
          <div className="flex flex-col items-center gap-2 bg-gradient-to-b from-blue-50/60 to-transparent px-5 pt-6 pb-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-2xl font-bold text-indigo-700 ring-4 ring-white shadow-sm">
                {customer.displayName.slice(0, 1)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-base font-bold">
              {customer.displayName}
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground text-center">
              {customer.wechatName && (
                <p>微信: {customer.wechatName}</p>
              )}
            </div>

            {/* layer pills */}
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {customer.currentLayer ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-xs font-semibold gap-1",
                    layerBadgeClasses[customer.currentLayer],
                  )}
                >
                  <Crown className="h-3 w-3" />
                  {customer.currentLayer} 客户
                </Badge>
              ) : null}
              {(customer.currentLayer === "S" || customer.currentLayer === "A") && (
                <Badge
                  variant="outline"
                  className="rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  高价值客户
                </Badge>
              )}
            </div>
          </div>

          {/* 信息字段 */}
          <CardContent className="px-5 py-4 space-y-2 border-t">
            <InfoRow label="公司/项目" value={customer.company} />
            <InfoRow label="行业" value={customer.industry} />
            <InfoRow label="角色" value={customer.roleTitle} />
            <InfoRow label="客户来源" value={customer.sourceChannel} />
            <InfoRow label="微信号" value={customer.wechatId} />
            <InfoRow
              label="首次添加"
              value={customer.createdAt.toLocaleDateString("zh-CN")}
            />
            {customer.lastInteractionAt && (
              <InfoRow
                label="最近互动"
                value={customer.lastInteractionAt.toLocaleString("zh-CN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            )}
            <InfoRow
              label="资料数量"
              value={`${customer.materials.length} 条`}
            />
          </CardContent>

          {/* 当前阶段 */}
          {customer.currentStage && (
            <div className="px-5 py-3 border-t bg-muted/20">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-muted-foreground">当前阶段</span>
              </div>
              <Badge
                variant="outline"
                className="rounded-full text-sm font-medium bg-blue-50 text-blue-700 border-blue-200"
              >
                {CUSTOMER_STAGES.find((s) => s.code === customer.currentStage)?.name}
              </Badge>
            </div>
          )}

          {/* 人工确认 */}
          <div className="px-5 py-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">人工确认</span>
              {customer.currentLayer || customer.currentStage ? (
                <Badge
                  variant="outline"
                  className="rounded-full text-[10px] gap-1 bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  已确认
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full text-[10px] bg-muted text-muted-foreground"
                >
                  未确认
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-[10px] font-bold text-rose-700">
                用
              </div>
              <span>最后确认: 用户001</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {customer.updatedAt.toLocaleString("zh-CN", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* 风险信号 */}
          {riskPills.length > 0 && (
            <div className="px-5 py-3 border-t">
              <span className="text-xs text-muted-foreground">风险信号</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {riskPills.map((r, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full text-xs bg-rose-50 text-rose-600 border-rose-200 gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 备注 */}
          {customer.notes && (
            <div className="px-5 py-3 border-t">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">备注</span>
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">
                {customer.notes}
              </p>
            </div>
          )}

          {/* 编辑标签表单 (collapsed below) */}
          <details className="border-t">
            <summary className="px-5 py-3 cursor-pointer text-xs font-medium text-primary hover:bg-muted/40">
              编辑标签 / 风险备注
            </summary>
            <form action={labelAction} className="px-5 pb-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="layer" className="text-xs">客户分层</Label>
                <Select name="layer" defaultValue={customer.currentLayer ?? ""}>
                  <SelectTrigger id="layer">
                    <SelectValue placeholder="未定" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">未定</SelectItem>
                    {CUSTOMER_LAYERS.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.code} · {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stage" className="text-xs">客户阶段</Label>
                <Select name="stage" defaultValue={customer.currentStage ?? ""}>
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="未定" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">未定</SelectItem>
                    {CUSTOMER_STAGES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="valueRiskNotes" className="text-xs">价值观风险备注</Label>
                <Textarea
                  id="valueRiskNotes"
                  name="valueRiskNotes"
                  defaultValue={customer.valueRiskNotes ?? ""}
                  rows={2}
                  className="resize-none text-xs"
                  placeholder="多个风险信号用逗号分隔"
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                保存标签
              </Button>
            </form>
          </details>
        </Card>
      </aside>

      {/* ── 中间栏：资料时间线 ── */}
      <section className="space-y-4 min-w-0">
        <Tabs defaultValue="timeline">
          <TabsList variant="line" className="w-full justify-start gap-3 border-b rounded-none h-auto bg-transparent p-0">
            <TabsTrigger
              value="timeline"
              className="flex-none rounded-none px-1 pb-3 pt-2 font-medium text-sm data-active:text-primary"
            >
              资料时间线
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="flex-none rounded-none px-1 pb-3 pt-2 font-medium text-sm data-active:text-primary"
            >
              标签记录
            </TabsTrigger>
            <TabsTrigger
              value="followup"
              className="flex-none rounded-none px-1 pb-3 pt-2 font-medium text-sm data-active:text-primary"
            >
              跟进记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4 pt-4">
            <MaterialFilterTabs materials={customer.materials} />
            <MaterialComposer customerId={customer.id} />
          </TabsContent>
          <TabsContent value="tags" className="pt-4">
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                标签变更历史(占位)
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="followup" className="pt-4">
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                跟进记录(占位)
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── 右栏：AI 客户理解 ── */}
      <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-violet-50 via-blue-50 to-blue-50">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm">
                <Bot className="h-4 w-4 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-sm">AI 客户理解</span>
            </div>
            <form action={analysisAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-7 gap-1 border-primary/30 text-primary hover:bg-primary/5"
                disabled={latestAnalysis?.status === "running"}
              >
                {latestAnalysis?.status === "running" ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    分析中
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    重新分析
                  </>
                )}
              </Button>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {latestAnalysis?.status === "running" ? (
              <motion.div key="loading" {...fadeIn} transition={{ duration: 0.2 }}>
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-16 w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </motion.div>
            ) : latestAnalysis?.status === "failed" ? (
              <motion.div key="failed" {...fadeIn} transition={{ duration: 0.2 }}>
                <CardContent className="p-4">
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm">
                    <p className="font-semibold text-rose-700">分析失败</p>
                    <p className="mt-1 text-xs text-rose-600">
                      {latestAnalysis.errorMessage}
                    </p>
                    <p className="mt-2 text-[10px] text-rose-500/70">
                      请检查 API Key 配置或稍后重试。
                    </p>
                  </div>
                </CardContent>
              </motion.div>
            ) : latestAnalysis?.status === "succeeded" ? (
              <motion.div key="ok" {...fadeIn} transition={{ duration: 0.2 }}>
                <CardContent className="space-y-3 p-4">
                  {/* 一句话摘要 */}
                  {latestAnalysis.summary && (
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        一句话摘要
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">
                        {latestAnalysis.summary}
                      </p>
                    </div>
                  )}

                  {/* 2x2 cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 核心需求 */}
                    <AiInsightCard
                      icon={Target}
                      iconColor="text-emerald-600"
                      iconBg="bg-emerald-100"
                      title="核心需求"
                      items={extractList(latestAnalysis.needSignals)}
                    />
                    {/* 画像信号 */}
                    <AiInsightCard
                      icon={UserCircle2}
                      iconColor="text-amber-600"
                      iconBg="bg-amber-100"
                      title="画像信号"
                      items={extractList(latestAnalysis.profileSignals)}
                    />
                    {/* 付费能力 */}
                    <AiInsightCard
                      icon={Wallet}
                      iconColor="text-violet-600"
                      iconBg="bg-violet-100"
                      title="付费能力信号"
                      items={extractList(latestAnalysis.paymentSignals)}
                    />
                    {/* 分层建议 */}
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-3">
                      <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-2">
                        <Crown className="h-3 w-3" />
                        分层建议
                      </p>
                      {latestAnalysis.recommendedLayer ? (
                        <>
                          <p className="text-lg font-bold text-amber-900">
                            {latestAnalysis.recommendedLayer} 客户
                          </p>
                          {latestAnalysis.layerReason && (
                            <p className="text-[10px] text-amber-700/80 mt-1 line-clamp-3">
                              {latestAnalysis.layerReason}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-amber-700/60">信息不足</p>
                      )}
                    </div>
                    {/* 分阶建议 */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 p-3">
                      <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mb-2">
                        <Mountain className="h-3 w-3" />
                        分阶建议
                      </p>
                      {latestAnalysis.recommendedStage ? (
                        <>
                          <p className="text-sm font-bold text-blue-900">
                            {CUSTOMER_STAGES.find(
                              (s) => s.code === latestAnalysis.recommendedStage,
                            )?.name ?? latestAnalysis.recommendedStage}
                          </p>
                          {latestAnalysis.stageReason && (
                            <p className="text-[10px] text-blue-700/80 mt-1 line-clamp-3">
                              {latestAnalysis.stageReason}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-blue-700/60">信息不足</p>
                      )}
                    </div>
                    {/* 风险信号 */}
                    <div className="rounded-xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 p-3">
                      <p className="text-xs font-semibold text-rose-700 flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="h-3 w-3" />
                        风险信号
                      </p>
                      <ul className="space-y-0.5 text-[11px] text-rose-700/90">
                        {extractList(latestAnalysis.valueRiskSignals).slice(0, 4).map((s, i) => (
                          <li key={i} className="flex gap-1">
                            <span className="text-rose-400">·</span>
                            <span className="flex-1">{s}</span>
                          </li>
                        ))}
                        {extractList(latestAnalysis.valueRiskSignals).length === 0 && (
                          <li className="text-rose-500/60">暂无风险</li>
                        )}
                      </ul>
                    </div>
                    {/* 缺失信息 */}
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-3">
                      <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-1.5">
                        <HelpCircle className="h-3 w-3" />
                        缺失信息
                      </p>
                      <ul className="space-y-0.5 text-[11px] text-amber-800">
                        {extractList(latestAnalysis.missingInformation).slice(0, 4).map((s, i) => (
                          <li key={i} className="flex gap-1">
                            <span className="text-amber-400">·</span>
                            <span className="flex-1">{s}</span>
                          </li>
                        ))}
                        {extractList(latestAnalysis.missingInformation).length === 0 && (
                          <li className="text-amber-600/60">资料较完整</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* AI 建议条 */}
                  {latestAnalysis.layerReason && latestAnalysis.stageReason && (
                    <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-violet-200 p-3">
                      <p className="text-xs font-semibold text-violet-700 flex items-center gap-1.5 mb-1">
                        <Lightbulb className="h-3 w-3" />
                        AI 综合建议
                      </p>
                      <p className="text-xs leading-relaxed text-violet-900/80">
                        {latestAnalysis.layerReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            ) : (
              <motion.div key="empty" {...fadeIn} transition={{ duration: 0.2 }}>
                <CardContent className="p-6 text-center">
                  <Bot className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" strokeWidth={1.5} />
                  <p className="text-sm font-medium">还没有 AI 分析</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    添加资料后点击右上方 "重新分析"
                  </p>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </aside>
    </div>
  );
}

function AiInsightCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  items,
}: {
  icon: typeof Target;
  iconColor: string;
  iconBg: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={cn("flex h-5 w-5 items-center justify-center rounded-md", iconBg)}>
          <Icon className={cn("h-3 w-3", iconColor)} />
        </div>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <ul className="space-y-0.5 text-[11px] text-foreground/80">
        {items.slice(0, 4).map((it, i) => (
          <li key={i} className="flex gap-1">
            <span className="text-muted-foreground">·</span>
            <span className="flex-1 truncate">{it}</span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-muted-foreground/70 text-[10px]">信息不足</li>
        )}
      </ul>
    </div>
  );
}

function MaterialFilterTabs({ materials }: { materials: CustomerMaterial[] }) {
  const counts = {
    all: materials.length,
    manual_note: materials.filter((m) => m.type === "manual_note").length,
    chat_text: materials.filter((m) => m.type === "chat_text").length,
    screenshot: materials.filter((m) => m.type === "screenshot").length,
    attachment: materials.filter((m) => m.type === "attachment").length,
  };

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full justify-start gap-1.5 bg-transparent p-0 h-auto flex-wrap">
        <TabsTrigger
          value="all"
          className="flex-none rounded-full bg-muted/60 px-3 h-7 text-xs data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
        >
          全部 {counts.all > 0 && `(${counts.all})`}
        </TabsTrigger>
        <TabsTrigger
          value="manual_note"
          className="flex-none rounded-full bg-muted/60 px-3 h-7 text-xs data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
        >
          手动记录 {counts.manual_note > 0 && `(${counts.manual_note})`}
        </TabsTrigger>
        <TabsTrigger
          value="chat_text"
          className="flex-none rounded-full bg-muted/60 px-3 h-7 text-xs data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
        >
          聊天记录 {counts.chat_text > 0 && `(${counts.chat_text})`}
        </TabsTrigger>
        <TabsTrigger
          value="screenshot"
          className="flex-none rounded-full bg-muted/60 px-3 h-7 text-xs data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
        >
          截图 OCR {counts.screenshot > 0 && `(${counts.screenshot})`}
        </TabsTrigger>
        <TabsTrigger
          value="attachment"
          className="flex-none rounded-full bg-muted/60 px-3 h-7 text-xs data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
        >
          附件 {counts.attachment > 0 && `(${counts.attachment})`}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <CustomerTimeline materials={materials} />
      </TabsContent>
      <TabsContent value="manual_note" className="mt-4">
        <CustomerTimeline materials={materials.filter((m) => m.type === "manual_note")} />
      </TabsContent>
      <TabsContent value="chat_text" className="mt-4">
        <CustomerTimeline materials={materials.filter((m) => m.type === "chat_text")} />
      </TabsContent>
      <TabsContent value="screenshot" className="mt-4">
        <CustomerTimeline materials={materials.filter((m) => m.type === "screenshot")} />
      </TabsContent>
      <TabsContent value="attachment" className="mt-4">
        <CustomerTimeline materials={materials.filter((m) => m.type === "attachment")} />
      </TabsContent>
    </Tabs>
  );
}

function extractList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        return (
          (o.text as string) ??
          (o.signal as string) ??
          (o.item as string) ??
          (o.need as string) ??
          (o.label as string) ??
          (o.value as string) ??
          (o.content as string) ??
          ""
        );
      }
      return "";
    })
    .filter(Boolean);
}
