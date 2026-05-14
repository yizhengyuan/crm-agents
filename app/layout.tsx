import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/app-config";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen bg-crm-surface text-crm-ink">
          <header className="border-b border-crm-line bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <a href="/" className="text-lg font-semibold">{appConfig.name}</a>
              <nav className="flex gap-4 text-sm text-crm-muted">
                <a href="/customers">客户</a>
                <a href="/tags">标签体系</a>
                <a href="/ai-analyses">AI 分析记录</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
