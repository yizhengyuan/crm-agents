import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Wrench } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">系统设置</h1>
        <p className="mt-1 text-muted-foreground">
          API Key、Prompt、存储、OCR 等系统级配置。
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="flex-row items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">即将上线</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            目前请通过 <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">.env</code>
            文件配置 AI / 存储相关参数:
          </p>
          <ul className="text-sm space-y-1.5 mt-3">
            <li className="flex items-start gap-2">
              <Wrench className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span className="font-mono text-xs">DATABASE_URL</span>
              <span className="text-muted-foreground">— Prisma 数据库连接</span>
            </li>
            <li className="flex items-start gap-2">
              <Wrench className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span className="font-mono text-xs">ANTHROPIC_API_KEY</span>
              <span className="text-muted-foreground">— Claude API Key</span>
            </li>
            <li className="flex items-start gap-2">
              <Wrench className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span className="font-mono text-xs">STORAGE_PROVIDER</span>
              <span className="text-muted-foreground">— local / s3</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
