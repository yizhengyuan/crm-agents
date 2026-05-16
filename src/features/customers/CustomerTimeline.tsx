"use client";

import { useState } from "react";
import type { CustomerMaterial } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
} from "lucide-react";
import { motion } from "framer-motion";

const materialTypeMeta: Record<
  string,
  { label: string; icon: typeof MessageCircle; dot: string }
> = {
  chat_text: {
    label: "聊天记录",
    icon: MessageCircle,
    dot: "bg-emerald-500",
  },
  screenshot: {
    label: "截图",
    icon: Camera,
    dot: "bg-blue-500",
  },
  manual_note: {
    label: "手动记录",
    icon: Pencil,
    dot: "bg-amber-500",
  },
  attachment: {
    label: "附件",
    icon: Paperclip,
    dot: "bg-purple-500",
  },
};

function OcrBadge({ material }: { material: CustomerMaterial }) {
  if (material.type !== "screenshot") return null;

  switch (material.ocrStatus) {
    case "pending":
    case "running":
      return (
        <Badge variant="secondary" className="gap-1 text-xs">
          <Loader2 className="h-3 w-3 animate-spin" />
          OCR 识别中
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          OCR 失败
        </Badge>
      );
    case "succeeded":
      return (
        <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 text-xs">
          <CheckCircle className="h-3 w-3" />
          已识别
        </Badge>
      );
    default:
      return null;
  }
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
          还没有资料，请先添加聊天文字、截图或手动记录。
        </CardContent>
      </Card>
    );
  }

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <ol className="space-y-3">
      {materials.map((m, i) => {
        const meta = materialTypeMeta[m.type] ?? materialTypeMeta.manual_note;
        const Icon = meta.icon;
        const isOpen = expanded.has(m.id);

        return (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.5) }}
          >
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* 时间线圆点 */}
                  <div className="relative mt-1">
                    <span
                      className={cn(
                        "block h-2.5 w-2.5 rounded-full",
                        meta.dot,
                      )}
                    />
                    {i < materials.length - 1 && (
                      <span className="absolute top-3 left-1/2 h-full w-px -translate-x-1/2 bg-border" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="gap-1 text-xs font-normal">
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </Badge>
                      <OcrBadge material={m} />
                      <time className="text-xs text-muted-foreground ml-auto">
                        {m.createdAt.toLocaleString("zh-CN")}
                      </time>
                    </div>

                    <h3 className="font-semibold text-sm">{m.title}</h3>

                    {m.contentText && (
                      <div className="relative">
                        <p
                          className={cn(
                            "text-sm text-muted-foreground whitespace-pre-wrap",
                            !isOpen && m.contentText.length > 200 && "line-clamp-3",
                          )}
                        >
                          {m.contentText}
                        </p>
                        {m.contentText.length > 200 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => toggle(m.id)}
                          >
                            {isOpen ? "收起" : "展开全文"}
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 ml-1 transition-transform",
                                isOpen && "rotate-180",
                              )}
                            />
                          </Button>
                        )}
                      </div>
                    )}

                    {m.extractedText && (
                      <details className="rounded-lg bg-muted/50 p-3 text-sm">
                        <summary className="cursor-pointer font-medium text-primary text-xs">
                          查看 OCR 识别文字
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                          {m.extractedText}
                        </p>
                      </details>
                    )}

                    {m.fileUrl && (
                      <a
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        查看文件：{m.fileName}
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
  );
}
