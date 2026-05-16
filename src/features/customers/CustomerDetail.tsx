"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AiAnalysis, Customer, CustomerMaterial } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  Building2,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const layerBadgeClasses: Record<string, string> = {
  S: "bg-emerald-100 text-emerald-800 border-emerald-200",
  A: "bg-blue-100 text-blue-800 border-blue-200",
  B: "bg-purple-100 text-purple-800 border-purple-200",
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

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const labelAction = updateCustomerLabelsAction.bind(null, customer.id);
  const analysisAction = runCustomerAnalysisAction.bind(null, customer.id);
  const latestAnalysis = customer.aiAnalyses[0];
  const [aiOpen, setAiOpen] = useState(true);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
      {/* ── 左栏：客户画像 ── */}
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{customer.displayName}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {customer.wechatName && `@${customer.wechatName}`}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 当前分层 & 阶段 */}
            <div className="flex flex-wrap gap-2">
              {customer.currentLayer ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm font-semibold",
                    layerBadgeClasses[customer.currentLayer],
                  )}
                >
                  {customer.currentLayer} 层
                </Badge>
              ) : (
                <Badge variant="outline" className="text-sm text-muted-foreground">
                  未分层
                </Badge>
              )}
              {customer.currentStage ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-sm">
                  {CUSTOMER_STAGES.find((s) => s.code === customer.currentStage)?.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-sm text-muted-foreground">
                  未分阶
                </Badge>
              )}
              {customer.hasValueRisk && (
                <Badge variant="destructive" className="text-sm gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  风险
                </Badge>
              )}
            </div>

            {/* 基本信息 */}
            <div className="space-y-2 text-sm">
              {customer.company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{[customer.company, customer.industry].filter(Boolean).join(" · ")}</span>
                </div>
              )}
              {customer.roleTitle && (
                <p className="text-muted-foreground">{customer.roleTitle}</p>
              )}
              {customer.sourceChannel && (
                <p className="text-xs text-muted-foreground">
                  来源：{customer.sourceChannel}
                </p>
              )}
            </div>

            <div className="border-t pt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>资料数量</span>
                <span className="font-medium text-foreground">{customer.materials.length}</span>
              </div>
              {customer.lastInteractionAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    最近互动：{customer.lastInteractionAt.toLocaleDateString("zh-CN")}
                  </span>
                </div>
              )}
            </div>

            {/* 人工确认标签 */}
            <form action={labelAction} className="border-t pt-3 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="layer">客户分层</Label>
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
                <Label htmlFor="stage">客户阶段</Label>
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
                <Label htmlFor="valueRiskNotes">价值观风险备注</Label>
                <Textarea
                  id="valueRiskNotes"
                  name="valueRiskNotes"
                  defaultValue={customer.valueRiskNotes ?? ""}
                  rows={2}
                  className="resize-none"
                />
              </div>

              <Button type="submit" className="w-full" size="sm">
                保存标签
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI 小助手提示 */}
        {!latestAnalysis || latestAnalysis.status !== "succeeded" ? (
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-purple-900">AI 小助手</p>
                <p className="mt-1 text-purple-700">
                  添加客户资料后，我可以帮你分析客户的画像、需求和风险信号。
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </aside>

      {/* ── 中间栏：资料时间线 ── */}
      <section className="space-y-4 min-w-0">
        <MaterialComposer customerId={customer.id} />
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
            <TabsTrigger value="manual_note" className="flex-1">手动记录</TabsTrigger>
            <TabsTrigger value="chat_text" className="flex-1">聊天记录</TabsTrigger>
            <TabsTrigger value="screenshot" className="flex-1">截图</TabsTrigger>
            <TabsTrigger value="attachment" className="flex-1">附件</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <CustomerTimeline materials={customer.materials} />
          </TabsContent>
          <TabsContent value="manual_note">
            <CustomerTimeline materials={customer.materials.filter((m) => m.type === "manual_note")} />
          </TabsContent>
          <TabsContent value="chat_text">
            <CustomerTimeline materials={customer.materials.filter((m) => m.type === "chat_text")} />
          </TabsContent>
          <TabsContent value="screenshot">
            <CustomerTimeline materials={customer.materials.filter((m) => m.type === "screenshot")} />
          </TabsContent>
          <TabsContent value="attachment">
            <CustomerTimeline materials={customer.materials.filter((m) => m.type === "attachment")} />
          </TabsContent>
        </Tabs>
      </section>

      {/* ── 右栏：AI 客户理解 ── */}
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI 客户理解
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAiOpen(!aiOpen)}
              >
                {aiOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {aiOpen && (
              <motion.div {...fadeIn} transition={{ duration: 0.2 }}>
                <CardContent className="space-y-4 pt-0">
                  <form action={analysisAction}>
                    <Button
                      className="w-full"
                      disabled={latestAnalysis?.status === "running"}
                    >
                      {latestAnalysis?.status === "running" ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                          分析中…
                        </span>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          重新分析
                        </>
                      )}
                    </Button>
                  </form>

                  {latestAnalysis?.status === "running" ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : latestAnalysis?.status === "failed" ? (
                    <Card className="bg-destructive/5 border-destructive/20">
                      <CardContent className="p-4 text-sm">
                        <p className="font-semibold text-destructive">分析失败</p>
                        <p className="mt-1 text-muted-foreground">
                          {latestAnalysis.errorMessage}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          请检查 API Key 配置或稍后重试。
                        </p>
                      </CardContent>
                    </Card>
                  ) : latestAnalysis?.status === "succeeded" ? (
                    <div className="space-y-3">
                      {/* 摘要 */}
                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                        <CardContent className="p-3 text-sm">
                          <p className="text-xs font-medium text-blue-600 mb-1">一句话摘要</p>
                          <p className="whitespace-pre-wrap">{latestAnalysis.summary}</p>
                        </CardContent>
                      </Card>

                      {/* 分层建议 */}
                      <Card>
                        <CardContent className="p-3 text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">分层建议</p>
                            {latestAnalysis.recommendedLayer && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "font-semibold",
                                  layerBadgeClasses[latestAnalysis.recommendedLayer],
                                )}
                              >
                                {latestAnalysis.recommendedLayer} 层
                              </Badge>
                            )}
                          </div>
                          {latestAnalysis.layerReason && (
                            <p className="text-muted-foreground">{latestAnalysis.layerReason}</p>
                          )}
                          {latestAnalysis.layerConfidence != null && (
                            <p className="text-xs text-muted-foreground">
                              置信度 {latestAnalysis.layerConfidence}%
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* 阶段建议 */}
                      <Card>
                        <CardContent className="p-3 text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">阶段建议</p>
                            {latestAnalysis.recommendedStage && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                {CUSTOMER_STAGES.find(
                                  (s) => s.code === latestAnalysis.recommendedStage,
                                )?.name ?? latestAnalysis.recommendedStage}
                              </Badge>
                            )}
                          </div>
                          {latestAnalysis.stageReason && (
                            <p className="text-muted-foreground">{latestAnalysis.stageReason}</p>
                          )}
                          {latestAnalysis.stageConfidence != null && (
                            <p className="text-xs text-muted-foreground">
                              置信度 {latestAnalysis.stageConfidence}%
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* 风险信号 */}
                      {latestAnalysis.valueRiskSignals &&
                        Array.isArray(latestAnalysis.valueRiskSignals) &&
                        (latestAnalysis.valueRiskSignals as unknown[]).length > 0 && (
                          <Card className="bg-red-50/50 border-red-200">
                            <CardContent className="p-3 text-sm space-y-1">
                              <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                风险信号
                              </p>
                              <ul className="list-disc list-inside text-red-700 space-y-0.5">
                                {(latestAnalysis.valueRiskSignals as Array<{ signal: string }>).map(
                                  (s, i) => (
                                    <li key={i}>{s.signal}</li>
                                  ),
                                )}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                      {/* 缺失信息 */}
                      {latestAnalysis.missingInformation &&
                        Array.isArray(latestAnalysis.missingInformation) &&
                        (latestAnalysis.missingInformation as unknown[]).length > 0 && (
                          <Card className="bg-amber-50/50 border-amber-200">
                            <CardContent className="p-3 text-sm space-y-1">
                              <p className="text-xs font-medium text-amber-700">缺失信息</p>
                              <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                                {(latestAnalysis.missingInformation as Array<{ item: string }>).map(
                                  (m, i) => (
                                    <li key={i}>{m.item}</li>
                                  ),
                                )}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted p-6 text-center text-sm text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      还没有 AI 分析
                      <br />
                      添加资料后点击"重新分析"
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </aside>
    </div>
  );
}
