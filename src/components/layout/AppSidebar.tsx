"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  Tags,
  Settings,
  Sparkles,
  Bot,
  ArrowRight,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Users;
};

const navItems: NavItem[] = [
  { label: "客户工作台", href: "/", icon: LayoutDashboard },
  { label: "客户列表", href: "/customers", icon: Users },
  { label: "新建客户", href: "/customers/new", icon: UserPlus },
  { label: "AI 分析记录", href: "/ai-analyses", icon: BarChart3 },
  { label: "标签管理", href: "/tags", icon: Tags },
  { label: "系统设置", href: "/settings", icon: Settings },
];

export function AppSidebar({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-4 p-4 border-r bg-sidebar">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 px-2 py-1.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold tracking-tight text-base">王二狗</span>
          <span className="rounded-md bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            AI
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Today's stats */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">今日概览</h3>
        <div className="space-y-2.5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-base font-bold tracking-tight">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI mascot card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-4 text-white shadow-md mt-auto">
        <div className="relative z-10 max-w-[70%]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">AI 助手小贴士</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90 mb-3">
            完整的客户资料能帮助 AI 更精准地判断客户价值和需求
          </p>
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-white transition-colors"
          >
            去添加资料
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {/* Robot icon decoration */}
        <div className="absolute bottom-1 right-1 opacity-90">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Bot className="h-9 w-9 text-white" strokeWidth={1.5} />
          </div>
        </div>
        {/* decorative circles */}
        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />
      </div>
    </aside>
  );
}
