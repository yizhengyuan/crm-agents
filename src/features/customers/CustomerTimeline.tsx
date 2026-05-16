"use client";

import { useState } from "react";
import type { CustomerMaterial } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Camera,
  Pencil,
  Paperclip,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const materialTypeMeta: Record<
  string,
  {
    label: string;
    icon: typeof MessageCircle;
    dot: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  chat_text: {
    label: "聊天记录",
    icon: MessageCircle,
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  screenshot: {
    label: "截图 OCR",
    icon: Camera,
    dot: "bg-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  manual_note: {
    label: "手动记录",
    icon: Pencil,
    dot: "bg-amber-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  attachment: {
    label: "附件",
    icon: Paperclip,
    dot: "bg-violet-500",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
};

function OcrBadge({ material }: { material: CustomerMaterial }) {
  if (material.type !== "screenshot") return null;

  switch (material.ocrStatus) {
    case "pending":
    case "running":
      return (
        <Badge variant="outline" className="gap-1 text-[10px] bg-blue-50 text-blue-700 border-blue-200">
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
          OCR 识别中
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="gap-1 text-[10px] bg-rose-50 text-rose-700 border-rose-200">
          <AlertTriangle className="h-2.5 w-2.5" />
          OCR 失败
        </Badge>
      );
    case "succeeded":
      return (
        <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
          <CheckCircle className="h-2.5 w-2.5" />
          已识别
        </Badge>
      );
    default:
      return null;
  }
}

function groupByDate(materials: CustomerMaterial[]) {
  const groups = new Map<string, CustomerMaterial[]>();
  for (const m of materials) {
    const date = m.createdAt.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(m);
  }
  return Array.from(groups.entries());
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fileSizeText(size: number | null | undefined): string | null {
  if (!size) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function CustomerTimeline({
  materials,
}: {
  materials: CustomerMaterial[];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (materials.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Pencil className="h-8 w-8 mx-auto mb-2 opacity-20" />
          还没有资料,请在下方"添加资料"。
        </CardContent>
      </Card>
    );
  }

  const groups = groupByDate(materials);
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="relative">
      {/* 连续轨 */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-200 via-violet-200 to-amber-200" />

      <div className="space-y-6">
        {groups.map(([date, items], gi) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-2 pl-6">
              <span className="text-xs font-semibold text-muted-foreground">
                {date}
              </span>
            </div>

            <ol className="space-y-3">
              {items.map((m, i) => {
                const meta = materialTypeMeta[m.type] ?? materialTypeMeta.manual_note;
                const Icon = meta.icon;
                const isOpen = expanded.has(m.id);

                return (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min((gi * items.length + i) * 0.04, 0.3) }}
                    className="relative pl-6"
                  >
                    {/* 圆点 */}
                    <span
                      className={cn(
                        "absolute left-0 top-3 block h-3.5 w-3.5 rounded-full ring-4 ring-background",
                        meta.dot,
                      )}
                    />

                    <Card className="hover:shadow-md transition-shadow border-0">
                      <CardContent className="p-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", meta.iconBg)}>
                            <Icon className={cn("h-3.5 w-3.5", meta.iconColor)} />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold">{meta.label}</span>
                              <OcrBadge material={m} />
                              <time className="text-[10px] text-muted-foreground ml-auto">
                                {formatTime(m.createdAt)}
                              </time>
                            </div>

                            {m.title && m.title !== meta.label && (
                              <h3 className="text-sm font-medium">{m.title}</h3>
                            )}

                            {m.contentText && (
                              <div className="relative">
                                <p
                                  className={cn(
                                    "text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap",
                                    !isOpen && m.contentText.length > 160 && "line-clamp-3",
                                  )}
                                >
                                  {m.contentText}
                                </p>
                                {m.contentText.length > 160 && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-[11px] text-primary"
                                    onClick={() => toggle(m.id)}
                                  >
                                    {isOpen ? "收起" : "查看全文"}
                                    <ChevronDown
                                      className={cn(
                                        "h-3 w-3 ml-0.5 transition-transform",
                                        isOpen && "rotate-180",
                                      )}
                                    />
                                  </Button>
                                )}
                              </div>
                            )}

                            {/* 截图缩略图占位 */}
                            {m.type === "screenshot" && m.fileUrl && (
                              <div className="grid grid-cols-4 gap-1.5 max-w-md">
                                <div className="aspect-[4/3] rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={m.fileUrl}
                                    alt={m.fileName ?? "截图"}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            {/* OCR 识别文字 */}
                            {m.extractedText && (
                              <details className="rounded-md bg-muted/40 p-2 text-xs">
                                <summary className="cursor-pointer text-[10px] font-medium text-primary">
                                  查看 OCR 识别文字
                                </summary>
                                <p className="mt-1.5 whitespace-pre-wrap text-muted-foreground text-xs">
                                  {m.extractedText}
                                </p>
                              </details>
                            )}

                            {/* 附件 */}
                            {m.type === "attachment" && m.fileUrl && (
                              <a
                                className="inline-flex items-center gap-2 rounded-md border bg-muted/30 px-2.5 py-1.5 hover:bg-muted/60 transition-colors max-w-md"
                                href={m.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-rose-100 to-rose-200">
                                  <FileText className="h-4 w-4 text-rose-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{m.fileName}</p>
                                  {fileSizeText(m.fileSize) && (
                                    <p className="text-[10px] text-muted-foreground">
                                      {fileSizeText(m.fileSize)}
                                    </p>
                                  )}
                                </div>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
