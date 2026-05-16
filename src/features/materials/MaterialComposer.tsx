"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMaterialAction } from "./material-actions";
import { Plus, Upload, X } from "lucide-react";

export function MaterialComposer({ customerId }: { customerId: string }) {
  const action = addMaterialAction.bind(null, customerId);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="h-4 w-4" />
        添加资料
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Plus className="h-4 w-4 text-primary" />
                添加资料
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                aria-label="收起"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form action={action} className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <Select name="type" defaultValue="manual_note">
                  <SelectTrigger>
                    <SelectValue placeholder="资料类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual_note">手动记录</SelectItem>
                    <SelectItem value="chat_text">聊天文字</SelectItem>
                    <SelectItem value="screenshot">聊天截图</SelectItem>
                    <SelectItem value="attachment">附件</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="title" placeholder="资料标题" required />
              </div>

              <Textarea
                name="contentText"
                rows={3}
                placeholder="粘贴聊天文字或填写跟进记录"
                className="resize-none"
              />

              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md border border-dashed px-3 py-2">
                <Upload className="h-3.5 w-3.5" />
                上传文件(截图或附件)
                <input name="file" type="file" className="hidden" />
              </label>

              <Button type="submit" className="w-full" size="sm">
                <Plus className="h-3.5 w-3.5" />
                保存资料
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
