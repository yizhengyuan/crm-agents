import { appConfig } from "@/app-config";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Users, Layers, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center py-20">
      <Card className="max-w-2xl w-full text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{appConfig.name}</CardTitle>
          <p className="mt-2 text-muted-foreground">{appConfig.description}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link
            href="/customers"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            <Users className="h-5 w-5" />
            进入客户列表
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex gap-3 justify-center">
            <Link
              href="/tags"
              className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
            >
              <Layers className="h-4 w-4" />
              标签体系
            </Link>
            <Link
              href="/ai-analyses"
              className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
            >
              <BarChart3 className="h-4 w-4" />
              AI 分析记录
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
