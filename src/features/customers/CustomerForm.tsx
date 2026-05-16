import { createCustomerAction } from "./customer-actions";

const fields = [
  ["displayName", "客户称呼", true],
  ["wechatName", "微信昵称", false],
  ["wechatId", "微信号", false],
  ["phone", "手机号", false],
  ["company", "公司/项目", false],
  ["industry", "行业", false],
  ["roleTitle", "职位/角色", false],
  ["sourceChannel", "来源渠道", false],
] as const;

export function CustomerForm() {
  return (
    <form
      action={createCustomerAction}
      className="space-y-5 rounded-2xl border border-crm-line bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([name, label, required]) => (
          <label key={name} className="space-y-2 text-sm font-medium">
            <span>
              {label}
              {required ? " *" : ""}
            </span>
            <input
              name={name}
              required={required}
              className="w-full rounded-lg border border-crm-line px-3 py-2"
            />
          </label>
        ))}
      </div>
      <label className="block space-y-2 text-sm font-medium">
        <span>备注</span>
        <textarea
          name="notes"
          rows={4}
          className="w-full rounded-lg border border-crm-line px-3 py-2"
        />
      </label>
      <button
        className="rounded-lg bg-crm-primary px-4 py-2 text-white"
        type="submit"
      >
        创建客户
      </button>
    </form>
  );
}
