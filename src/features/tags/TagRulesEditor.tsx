import type { TagRule } from "@prisma/client";
import { updateTagRuleAction } from "./tag-rules-actions";

export function TagRulesEditor({ rules }: { rules: TagRule[] }) {
  return (
    <div className="space-y-4">
      {rules.map((rule) => {
        const action = updateTagRuleAction.bind(null, rule.id);
        return (
          <form
            key={rule.id}
            action={action}
            className="rounded-2xl border border-crm-line bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-crm-muted">
                  {rule.category}/{rule.code}
                </p>
                <h2 className="text-lg font-semibold">{rule.name}</h2>
              </div>
              <button className="rounded-lg border border-crm-line px-3 py-2 text-sm">
                保存
              </button>
            </div>
            <label className="mt-4 block text-sm font-medium">说明</label>
            <textarea
              name="description"
              defaultValue={rule.description}
              rows={2}
              className="mt-2 w-full rounded-lg border border-crm-line px-3 py-2"
            />
            <label className="mt-4 block text-sm font-medium">判断标准</label>
            <textarea
              name="criteria"
              defaultValue={rule.criteria}
              rows={3}
              className="mt-2 w-full rounded-lg border border-crm-line px-3 py-2"
            />
          </form>
        );
      })}
    </div>
  );
}
