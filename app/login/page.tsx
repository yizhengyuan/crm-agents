import { appConfig } from "@/app-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/server/auth-actions";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next ?? "/";
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* 品牌标识 */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200 mb-4">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {appConfig.name}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 text-center max-w-xs">
            {appConfig.description}
          </p>
        </div>

        {/* 登录卡片 */}
        <form
          action={loginAction}
          className="space-y-5 rounded-2xl border border-slate-200/60 bg-white/80 p-7 shadow-xl shadow-slate-200/50 backdrop-blur-sm"
        >
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-slate-700 flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              访问密码
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                placeholder="请输入密码"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20"
              />
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {error === "invalid" ? (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 border border-red-100">
              密码错误，请重试。
            </div>
          ) : null}
          {error === "misconfigured" ? (
            <div className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700 border border-amber-100">
              服务端未配置访问密码，请联系管理员。
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-200/50 transition-all"
          >
            进入系统
          </Button>
        </form>

        {/* 底部提示 */}
        <p className="mt-6 text-center text-xs text-slate-400">
          受密码保护 · 仅授权用户可访问
        </p>
      </div>
    </div>
  );
}
