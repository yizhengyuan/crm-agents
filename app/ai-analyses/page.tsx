import { prisma } from "@/server/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

const statusBadgeClasses: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  running: "bg-yellow-100 text-yellow-800 border-yellow-200",
  succeeded: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

export default async function AiAnalysesPage() {
  const analyses = await prisma.aiAnalysis.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { customer: { select: { displayName: true } } },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI 分析记录</h1>
        <p className="mt-1 text-muted-foreground">
          用于追溯每次 AI 分析的输出，包括状态、模型和人工确认结果。
        </p>
      </div>

      {analyses.length === 0 ? (
        <Card className="border-dashed p-10 text-center text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-20" />
          还没有 AI 分析记录。
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {analysis.customer.displayName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        statusBadgeClasses[analysis.status],
                      )}
                    >
                      {analysis.status}
                    </Badge>
                    {analysis.promptVersion && (
                      <span className="text-xs text-muted-foreground">
                        prompt {analysis.promptVersion}
                      </span>
                    )}
                  </div>
                  <time className="text-muted-foreground">
                    {analysis.createdAt.toLocaleString("zh-CN")}
                  </time>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  <span>模型：{analysis.model}</span>
                  <span>资料数：{analysis.materialIds.length}</span>
                  {analysis.startedAt && (
                    <span>
                      开始：{analysis.startedAt.toLocaleString("zh-CN")}
                    </span>
                  )}
                  {analysis.completedAt && (
                    <span>
                      完成：{analysis.completedAt.toLocaleString("zh-CN")}
                    </span>
                  )}
                  {analysis.humanConfirmedLayer && (
                    <span>人工分层：{analysis.humanConfirmedLayer}</span>
                  )}
                  {analysis.humanConfirmedStage && (
                    <span>人工阶段：{analysis.humanConfirmedStage}</span>
                  )}
                </div>

                {analysis.status === "failed" ? (
                  <p className="mt-3 rounded-lg bg-destructive/5 p-3 text-sm text-destructive">
                    失败原因：{analysis.errorMessage}
                  </p>
                ) : analysis.summary ? (
                  <>
                    <h2 className="mt-3 font-semibold text-sm">
                      {analysis.summary}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      分层建议：{analysis.recommendedLayer ?? "信息不足"}，阶段建议：
                      {analysis.recommendedStage ?? "信息不足"}
                    </p>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
