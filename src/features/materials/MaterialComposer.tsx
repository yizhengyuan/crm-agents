import { addMaterialAction } from "./material-actions";

export function MaterialComposer({ customerId }: { customerId: string }) {
  const action = addMaterialAction.bind(null, customerId);

  return (
    <form
      action={action}
      className="space-y-3 rounded-2xl border border-crm-line bg-white p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <select
          name="type"
          className="rounded-lg border border-crm-line px-3 py-2"
          defaultValue="manual_note"
        >
          <option value="manual_note">手动记录</option>
          <option value="chat_text">聊天文字</option>
          <option value="screenshot">聊天截图</option>
          <option value="attachment">附件</option>
        </select>
        <input
          name="title"
          className="rounded-lg border border-crm-line px-3 py-2"
          placeholder="资料标题"
        />
      </div>
      <textarea
        name="contentText"
        rows={5}
        className="w-full rounded-lg border border-crm-line px-3 py-2"
        placeholder="粘贴聊天文字或填写跟进记录"
      />
      <input name="file" type="file" className="block w-full text-sm" />
      <p className="text-xs text-crm-muted">
        上传截图后系统会自动识别文字，识别结果可在资料时间线中查看和修正。
      </p>
      <button
        type="submit"
        className="rounded-lg bg-crm-primary px-4 py-2 text-white"
      >
        添加资料
      </button>
    </form>
  );
}
