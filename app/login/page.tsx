import { appConfig } from "@/app-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/server/auth-actions";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next ?? "/";
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-5 rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            {appConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            请输入访问密码以查看内容。
          </p>
        </div>

        <input type="hidden" name="next" value={next} />

        <div className="space-y-2">
          <Label htmlFor="password">访问密码</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        </div>

        {error === "invalid" ? (
          <p className="text-sm text-destructive">密码错误,请重试。</p>
        ) : null}
        {error === "misconfigured" ? (
          <p className="text-sm text-destructive">
            服务端未配置访问密码,请联系管理员。
          </p>
        ) : null}

        <Button type="submit" className="w-full">
          进入
        </Button>
      </form>
    </div>
  );
}
