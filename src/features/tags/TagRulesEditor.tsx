"use client";

import type { TagRule } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { updateTagRuleAction } from "./tag-rules-actions";
import { cn } from "@/lib/utils";
import { Layers, ArrowRightLeft, ShieldAlert } from "lucide-react";

const categoryMeta: Record<string, { label: string; icon: typeof Layers }> = {
  layer: { label: "客户分层", icon: Layers },
  stage: { label: "客户分阶", icon: ArrowRightLeft },
  value_risk: { label: "价值观风险", icon: ShieldAlert },
};

function groupByCategory(rules: TagRule[]) {
  const groups = new Map<string, TagRule[]>();
  for (const r of rules) {
    const list = groups.get(r.category) ?? [];
    list.push(r);
    groups.set(r.category, list);
  }
  return groups;
}

export function TagRulesEditor({ rules }: { rules: TagRule[] }) {
  const groups = groupByCategory(rules);

  return (
    <div className="space-y-4">
      {Array.from(groups.entries()).map(([category, items]) => {
        const meta = categoryMeta[category] ?? { label: category, icon: Layers };
        const Icon = meta.icon;

        return (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {meta.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                {items.map((rule) => {
                  const action = updateTagRuleAction.bind(null, rule.id);
                  return (
                    <AccordionItem key={rule.id} value={rule.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-mono text-xs shrink-0",
                              category === "layer" && "font-semibold",
                            )}
                          >
                            {rule.code}
                          </Badge>
                          <span className="font-medium text-sm">
                            {rule.name}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <form action={action} className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${rule.id}-desc`}>说明</Label>
                            <Textarea
                              id={`${rule.id}-desc`}
                              name="description"
                              defaultValue={rule.description}
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${rule.id}-criteria`}>判断标准</Label>
                            <Textarea
                              id={`${rule.id}-criteria`}
                              name="criteria"
                              defaultValue={rule.criteria}
                              rows={3}
                            />
                          </div>
                          <Button type="submit" size="sm">
                            保存
                          </Button>
                        </form>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
