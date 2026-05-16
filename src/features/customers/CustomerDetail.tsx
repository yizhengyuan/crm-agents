import type { AiAnalysis, Customer, CustomerMaterial } from "@prisma/client";
import { CUSTOMER_LAYERS, CUSTOMER_STAGES } from "@/features/tags/tag-system";
import { MaterialComposer } from "@/features/materials/MaterialComposer";
import { CustomerTimeline } from "./CustomerTimeline";
import { updateCustomerLabelsAction } from "./customer-actions";

type CustomerDetailProps = {
  customer: Customer & {
    materials: CustomerMaterial[];
    aiAnalyses: AiAnalysis[];
  };
};

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const labelAction = updateCustomerLabelsAction.bind(null, customer.id);
  const latestAnalysis = customer.aiAnalyses[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
      <aside className="space-y-4 rounded-2xl border border-crm-line bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm text-crm-muted">客户画像</p>
          <h1 className="mt-1 text-2xl font-bold">{customer.displayName}</h1>
          <p className="mt-2 text-sm text-crm-muted">
            {[customer.company, customer.roleTitle]
              .filter(Boolean)
              .join(" / ") || "暂无公司和角色"}
          </p>
        </div>
        <form action={labelAction} className="space-y-3">
          <label htmlFor="customer-layer" className="block text-sm font-medium">
            客户分层
          </label>
          <select
            id="customer-layer"
            name="layer"
            defaultValue={customer.currentLayer ?? ""}
            className="w-full rounded-lg border border-crm-line px-3 py-2"
          >
            <option value="">未定</option>
            {CUSTOMER_LAYERS.map((layer) => (
              <option key={layer.code} value={layer.code}>
                {layer.code} - {layer.name}
              </option>
            ))}
          </select>
          <label
            htmlFor="customer-stage"
            className="block text-sm font-medium"
          >
            客户阶段
          </label>
          <select
            id="customer-stage"
            name="stage"
            defaultValue={customer.currentStage ?? ""}
            className="w-full rounded-lg border border-crm-line px-3 py-2"
          >
            <option value="">未定</option>
            {CUSTOMER_STAGES.map((stage) => (
              <option key={stage.code} value={stage.code}>
                {stage.name}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium">价值观风险备注</label>
          <textarea
            name="valueRiskNotes"
            defaultValue={customer.valueRiskNotes ?? ""}
            rows={3}
            className="w-full rounded-lg border border-crm-line px-3 py-2"
          />
          <button className="w-full rounded-lg bg-crm-primary px-4 py-2 text-white">
            保存人工标签
          </button>
        </form>
      </aside>
      <section className="space-y-4">
        <MaterialComposer customerId={customer.id} />
        <CustomerTimeline materials={customer.materials} />
      </section>
      <aside className="rounded-2xl border border-crm-line bg-white p-5 shadow-sm">
        <p className="text-sm text-crm-muted">AI 客户理解</p>
        {latestAnalysis ? (
          <div className="mt-3 space-y-4 text-sm">
            <section>
              <h2 className="font-semibold">摘要</h2>
              <p className="mt-1 whitespace-pre-wrap">
                {latestAnalysis.summary}
              </p>
            </section>
            <section>
              <h2 className="font-semibold">分层建议</h2>
              <p className="mt-1">
                {latestAnalysis.recommendedLayer ?? "信息不足"}：
                {latestAnalysis.layerReason}
              </p>
            </section>
            <section>
              <h2 className="font-semibold">阶段建议</h2>
              <p className="mt-1">
                {latestAnalysis.recommendedStage ?? "信息不足"}：
                {latestAnalysis.stageReason}
              </p>
            </section>
          </div>
        ) : (
          <p className="mt-3 text-sm text-crm-muted">
            还没有 AI 分析。添加资料后可触发分析。
          </p>
        )}
      </aside>
    </div>
  );
}
