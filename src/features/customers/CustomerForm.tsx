import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCustomerAction } from "./customer-actions";
import { UserPlus } from "lucide-react";

const fields = [
  ["displayName", "客户称呼", true],
  ["wechatName", "微信昵称", false],
  ["wechatId", "微信号", false],
  ["phone", "手机号", false],
  ["company", "公司/项目", false],
  ["industry", "行业", false],
  ["roleTitle", "职位/角色", false],
  ["sourceChannel", "来源渠道", false],
] as const;

export function CustomerForm() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          新建客户
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createCustomerAction} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([name, label, required]) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>
                  {label}
                  {required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                <Input
                  id={name}
                  name={name}
                  required={required}
                  placeholder={label}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="客户的初步印象或需要跟进的事项"
            />
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto">
            <UserPlus className="h-4 w-4" />
            创建客户
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
