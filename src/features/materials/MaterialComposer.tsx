"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Upload } from "lucide-react";

export function MaterialComposer({ customerId }: { customerId: string }) {
  const action = addMaterialAction.bind(null, customerId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-4 w-4" />
          添加资料
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
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
            rows={4}
            placeholder="粘贴聊天文字或填写跟进记录"
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Upload className="h-4 w-4" />
              上传文件（截图或附件）
              <input
                name="file"
                type="file"
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              上传截图后系统会自动识别文字，识别结果可在时间线查看和修正。
            </p>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" />
            添加资料
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
