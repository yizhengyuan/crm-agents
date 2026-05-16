import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/app-config";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { prisma } from "@/server/db";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

async function getSidebarStats() {
  const totalCustomers = await prisma.customer.count({
    where: { archivedAt: null },
  });

  const saCustomers = await prisma.customer.count({
    where: {
      archivedAt: null,
      currentLayer: { in: ["S", "A"] },
    },
  });

  const pendingAnalysis = await prisma.customer.count({
    where: {
      archivedAt: null,
      aiAnalyses: { none: { status: "succeeded" } },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newMaterialsToday = await prisma.customerMaterial.count({
    where: { createdAt: { gte: today } },
  });

  return [
    { label: "客户总数", value: String(totalCustomers) },
    { label: "S/A 客户", value: String(saCustomers) },
    { label: "待分析客户", value: String(pendingAnalysis) },
    { label: "今日新增资料", value: String(newMaterialsToday) },
  ];
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stats = await getSidebarStats();

  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-muted/30">
        <div className="flex min-h-screen">
          <AppSidebar stats={stats} />
          <div className="flex flex-1 flex-col min-w-0">
            <AppHeader />
            <main className="flex-1 px-6 py-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
