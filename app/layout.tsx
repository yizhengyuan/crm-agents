import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/app-config";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Users, Tags, BarChart3 } from "lucide-react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
            <Link
              href="/"
              className="font-semibold text-lg tracking-tight hover:text-primary transition-colors"
            >
              {appConfig.name}
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/customers"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <Users className="h-4 w-4" />
                客户
              </Link>
              <Link
                href="/tags"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <Tags className="h-4 w-4" />
                标签体系
              </Link>
              <Link
                href="/ai-analyses"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <BarChart3 className="h-4 w-4" />
                AI 分析
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
