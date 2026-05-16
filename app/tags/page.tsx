import { TagRulesEditor } from "@/features/tags/TagRulesEditor";
import { listTagRules } from "@/features/tags/tag-rules-repository";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const rules = await listTagRules();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">标签体系设置</h1>
        <p className="mt-1 text-crm-muted">
          结构固定，说明和判断标准可持续优化。
        </p>
      </div>
      <TagRulesEditor rules={rules} />
    </div>
  );
}
