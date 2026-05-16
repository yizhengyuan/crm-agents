"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, PanelLeft, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/server/auth-actions";

const titleMap: Record<string, string> = {
  "/": "客户工作台",
  "/customers": "客户列表",
  "/customers/new": "新建客户",
  "/ai-analyses": "AI 分析记录",
  "/tags": "标签管理",
  "/settings": "系统设置",
};

function resolveTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];
  if (pathname.startsWith("/customers/") && pathname !== "/customers/new") {
    return "客户详情";
  }
  return "王二狗销售助理";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center gap-2 lg:gap-3">
        <button
          type="button"
          aria-label="展开菜单"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索客户、资料、标签..."
            className="pl-9 h-9 rounded-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="通知"
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            12
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-xs font-semibold text-rose-700">
            用
          </div>
          <span className="text-sm font-medium hidden sm:block">我的</span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="退出登录"
            title="退出登录"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
