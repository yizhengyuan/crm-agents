import { appConfig } from "@/app-config";

export default function HomePage() {
  return (
    <section className="rounded-2xl border border-crm-line bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-crm-primary">CRM MVP</p>
      <h1 className="mt-3 text-3xl font-bold">{appConfig.name}</h1>
      <p className="mt-4 max-w-2xl text-crm-muted">{appConfig.description}</p>
      <div className="mt-6 flex gap-3">
        <a className="rounded-lg bg-crm-primary px-4 py-2 text-white" href="/customers">进入客户列表</a>
        <a className="rounded-lg border border-crm-line px-4 py-2" href="/tags">维护标签体系</a>
      </div>
    </section>
  );
}
