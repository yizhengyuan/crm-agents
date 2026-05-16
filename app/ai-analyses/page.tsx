import { prisma } from "@/server/db";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    running: "bg-yellow-100 text-yellow-700",
    succeeded: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${colors[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

export default async function AiAnalysesPage() {
  const analyses = await prisma.aiAnalysis.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { customer: { select: { displayName: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI 分析记录</h1>
        <p className="mt-1 text-crm-muted">
          用于追溯每次 AI 分析的输出，包括状态、模型和人工确认结果。
        </p>
      </div>
      <div className="space-y-3">
        {analyses.map((analysis) => (
          <article
            key={analysis.id}
            className="rounded-2xl border border-crm-line bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between text-sm text-crm-muted">
              <div className="flex items-center gap-3">
                <span className="font-medium text-crm-ink">
                  {analysis.customer.displayName}
                </span>
                <StatusBadge status={analysis.status} />
                {analysis.promptVersion ? (
                  <span className="text-xs">
                    prompt {analysis.promptVersion}
                  </span>
                ) : null}
              </div>
              <time>{analysis.createdAt.toLocaleString("zh-CN")}</time>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-crm-muted">
              <span>模型：{analysis.model}</span>
              <span>资料数：{analysis.materialIds.length}</span>
              {analysis.startedAt ? (
                <span>
                  开始：{analysis.startedAt.toLocaleString("zh-CN")}
                </span>
              ) : null}
              {analysis.completedAt ? (
                <span>
                  完成：{analysis.completedAt.toLocaleString("zh-CN")}
                </span>
              ) : null}
              {analysis.humanConfirmedLayer ? (
                <span>人工分层：{analysis.humanConfirmedLayer}</span>
              ) : null}
              {analysis.humanConfirmedStage ? (
                <span>人工阶段：{analysis.humanConfirmedStage}</span>
              ) : null}
            </div>
            {analysis.status === "failed" ? (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                失败原因：{analysis.errorMessage}
              </p>
            ) : analysis.summary ? (
              <>
                <h2 className="mt-3 font-semibold">{analysis.summary}</h2>
                <p className="mt-2 text-sm">
                  分层建议：{analysis.recommendedLayer ?? "信息不足"}，阶段建议：
                  {analysis.recommendedStage ?? "信息不足"}
                </p>
              </>
            ) : null}
          </article>
        ))}
        {analyses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-crm-line bg-white p-8 text-center text-crm-muted">
            还没有 AI 分析记录。
          </div>
        ) : null}
      </div>
    </div>
  );
}
