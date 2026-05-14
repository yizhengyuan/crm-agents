# CRM Customer Knowledge Base MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cloud-ready single-user CRM customer knowledge base that stores customer profiles, timeline materials, editable tag rules, and AI customer analysis with human-confirmed labels.

**Architecture:** Use a Next.js App Router application with small feature modules under `src/features/*`. Domain rules live in pure TypeScript modules with unit tests; persistence is isolated behind repository functions backed by Prisma/PostgreSQL; OpenAI analysis is isolated behind one service so it can be mocked in tests and swapped if the model/provider changes.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Vitest, Testing Library, Playwright, OpenAI Node SDK Responses API, optional Supabase Storage with local filesystem fallback for development.

---

## Scope Check

This plan implements only the approved MVP from `docs/superpowers/specs/2026-05-14-crm-customer-knowledge-base-design.md`:

- Customer list, search, filters, create/edit basics.
- Customer detail page with profile sidebar, material timeline, and AI analysis panel.
- Materials: manual notes, pasted chat text, screenshots, attachments.
- Built-in S/A/B/C/D layers and six fixed stages, with editable descriptions and judgment criteria.
- AI output: customer summary, signals, layer/stage recommendation reasons, risk signals, missing information.
- Human-confirmed layer/stage; AI does not overwrite labels.
- Single-user UI with workspace/user fields reserved in data model.

The following items remain out of this MVP and are not included as implementation tasks:

- Daily AI action recommendations.
- Automatic customer outreach.
- WeChat or Enterprise WeChat automatic sync.
- Complex team permissions and supervisor dashboards.
- Sales performance reporting.

## External References Checked

Use these references during implementation:

- OpenAI Responses API: `https://platform.openai.com/docs/api-reference/responses`
- OpenAI structured outputs guide: `https://platform.openai.com/docs/guides/structured-outputs`
- OpenAI images and vision guide: `https://platform.openai.com/docs/guides/images-vision`

Keep `OPENAI_MODEL` configurable. Use the default in `.env.example` only as the initial project default; do not hard-code the model outside environment loading.

## File Structure Map

Create this structure:

```text
/Users/yzy/Desktop/202605/siyu-manager
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── customers/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [customerId]/page.tsx
│   ├── tags/page.tsx
│   └── ai-analyses/page.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app-config.ts
│   ├── features/
│   │   ├── ai/
│   │   │   ├── ai-analysis-schema.ts
│   │   │   ├── ai-analysis-service.ts
│   │   │   ├── ai-analysis-prompts.ts
│   │   │   └── ai-analysis-actions.ts
│   │   ├── customers/
│   │   │   ├── customer-schema.ts
│   │   │   ├── customer-repository.ts
│   │   │   ├── customer-actions.ts
│   │   │   ├── CustomerList.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   │   └── CustomerTimeline.tsx
│   │   ├── materials/
│   │   │   ├── material-schema.ts
│   │   │   ├── material-repository.ts
│   │   │   ├── material-actions.ts
│   │   │   ├── material-storage.ts
│   │   │   └── MaterialComposer.tsx
│   │   └── tags/
│   │       ├── tag-system.ts
│   │       ├── tag-rules-repository.ts
│   │       ├── tag-rules-actions.ts
│   │       └── TagRulesEditor.tsx
│   ├── server/
│   │   ├── db.ts
│   │   └── env.ts
│   └── test/
│       ├── render.tsx
│       └── fixtures.ts
├── tests/
│   └── e2e/customer-knowledge-base.spec.ts
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── vitest.config.ts
├── playwright.config.ts
└── docker-compose.yml
```

Responsibility boundaries:

- `src/features/tags/*`: fixed taxonomy and editable judgment copy.
- `src/features/customers/*`: customer profile data, customer pages, and customer mutations.
- `src/features/materials/*`: timeline materials and upload/storage concerns.
- `src/features/ai/*`: AI schemas, prompt assembly, OpenAI service, and analysis persistence action.
- `src/server/*`: environment validation and Prisma client.
- `app/*`: route composition only; keep business logic out of route files.

---

## Task 1: Scaffold Next.js, TypeScript, Tailwind, and Tests

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/package.json`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/tsconfig.json`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/next.config.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/tailwind.config.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/postcss.config.mjs`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/vitest.config.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/playwright.config.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/globals.css`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/layout.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/page.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/app-config.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/app-config.test.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/test/render.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/.env.example`

- [ ] **Step 1: Write the failing bootstrap test**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/app-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { appConfig } from "./app-config";

describe("appConfig", () => {
  it("exposes the CRM product name", () => {
    expect(appConfig.name).toBe("私域 CRM 客户知识库");
    expect(appConfig.defaultWorkspaceName).toBe("默认工作区");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/app-config.test.ts
```

Expected: command fails because `package.json`, Vitest, and `src/app-config.ts` are not present.

- [ ] **Step 3: Create package and config files**

Create `/Users/yzy/Desktop/202605/siyu-manager/package.json`:

```json
{
  "name": "crm-agents",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "latest",
    "@supabase/supabase-js": "latest",
    "clsx": "latest",
    "next": "latest",
    "openai": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "jsdom": "latest",
    "postcss": "latest",
    "prisma": "latest",
    "tailwindcss": "latest",
    "tsx": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

Create `/Users/yzy/Desktop/202605/siyu-manager/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crm: {
          ink: "#172033",
          muted: "#64748b",
          line: "#e2e8f0",
          surface: "#f8fafc",
          primary: "#2563eb"
        }
      }
    }
  },
  plugins: []
};

export default config;
```

Create `/Users/yzy/Desktop/202605/siyu-manager/postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `/Users/yzy/Desktop/202605/siyu-manager/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/render.tsx"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
```

Create `/Users/yzy/Desktop/202605/siyu-manager/playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
```

Create `/Users/yzy/Desktop/202605/siyu-manager/.env.example`:

```bash
DATABASE_URL="postgresql://crm:crm@localhost:5432/crm_agents?schema=public"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-5.4-mini"
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_STORAGE_BUCKET="crm-materials"
LOCAL_UPLOAD_DIR=".data/uploads"
```

- [ ] **Step 4: Create app shell files**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/app-config.ts`:

```ts
export const appConfig = {
  name: "私域 CRM 客户知识库",
  defaultWorkspaceName: "默认工作区",
  description: "沉淀客户资料，并让 AI 辅助生成客户理解。"
} as const;
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/test/render.tsx`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `/Users/yzy/Desktop/202605/siyu-manager/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #172033;
  background: #f8fafc;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #f8fafc;
}

a {
  color: inherit;
  text-decoration: none;
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/app-config";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen bg-crm-surface text-crm-ink">
          <header className="border-b border-crm-line bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <a href="/" className="text-lg font-semibold">{appConfig.name}</a>
              <nav className="flex gap-4 text-sm text-crm-muted">
                <a href="/customers">客户</a>
                <a href="/tags">标签体系</a>
                <a href="/ai-analyses">AI 分析记录</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/app/page.tsx`:

```tsx
import { appConfig } from "@/app-config";

export default function HomePage() {
  return (
    <section className="rounded-2xl border border-crm-line bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-crm-primary">CRM MVP</p>
      <h1 className="mt-3 text-3xl font-bold">{appConfig.name}</h1>
      <p className="mt-4 max-w-2xl text-crm-muted">{appConfig.description}</p>
      <div className="mt-6 flex gap-3">
        <a className="rounded-lg bg-crm-primary px-4 py-2 text-white" href="/customers">进入客户列表</a>
        <a className="rounded-lg border border-crm-line px-4 py-2" href="/tags">维护标签体系</a>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Install dependencies and run the bootstrap test**

Run:

```bash
npm install
npm test -- src/app-config.test.ts
```

Expected: Vitest passes `appConfig exposes the CRM product name`.

- [ ] **Step 6: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: TypeScript exits with code 0.

- [ ] **Step 7: Commit**

Run:

```bash
git add package.json package-lock.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs vitest.config.ts playwright.config.ts .env.example app src
git commit -m "chore: scaffold CRM web app"
```

---

## Task 2: Implement Fixed Tag Taxonomy and Editable Rule Seeds

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-system.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-system.test.ts`

- [ ] **Step 1: Write failing taxonomy tests**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-system.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  CUSTOMER_LAYERS,
  CUSTOMER_STAGES,
  VALUE_RISK_RULES,
  findCustomerLayer,
  findCustomerStage
} from "./tag-system";

describe("tag system", () => {
  it("contains five fixed customer layers", () => {
    expect(CUSTOMER_LAYERS.map((layer) => layer.code)).toEqual(["S", "A", "B", "C", "D"]);
    expect(findCustomerLayer("S")?.name).toBe("超高客单客户");
  });

  it("contains six fixed customer stages", () => {
    expect(CUSTOMER_STAGES.map((stage) => stage.code)).toEqual([
      "greeting_materials",
      "discover_needs",
      "build_trust",
      "present_offer",
      "offline_conversion",
      "maintenance_referral"
    ]);
    expect(findCustomerStage("build_trust")?.name).toBe("建信任，高互动");
  });

  it("contains the three one-vote veto risk rules", () => {
    expect(VALUE_RISK_RULES.map((rule) => rule.code)).toEqual([
      "self_centered",
      "entrepreneurial_illusion",
      "networking_mixer"
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/features/tags/tag-system.test.ts
```

Expected: FAIL because `tag-system.ts` does not exist.

- [ ] **Step 3: Implement taxonomy module**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-system.ts`:

```ts
export type CustomerLayerCode = "S" | "A" | "B" | "C" | "D";

export type CustomerStageCode =
  | "greeting_materials"
  | "discover_needs"
  | "build_trust"
  | "present_offer"
  | "offline_conversion"
  | "maintenance_referral";

export type ValueRiskCode = "self_centered" | "entrepreneurial_illusion" | "networking_mixer";

type RuleItem<TCode extends string> = {
  code: TCode;
  name: string;
  description: string;
  criteria: string;
};

export const CUSTOMER_LAYERS: RuleItem<CustomerLayerCode>[] = [
  {
    code: "S",
    name: "超高客单客户",
    description: "有可能付费咨询/顾问产品（≥10 万元），或可能推荐 3 个以上高客单客户的节点型客户。",
    criteria: "重点观察其决策身份、业务规模、付费能力、节点影响力和转介绍潜力。"
  },
  {
    code: "A",
    name: "高客单客户",
    description: "有可能付费创业进化营产品（≥2 万元）的客户。",
    criteria: "重点观察创业状态、增长需求、学习预算和对系统化陪跑的接受度。"
  },
  {
    code: "B",
    name: "准高客单客户",
    description: "有可能付费起源合伙人产品（1 万元左右）的客户。",
    criteria: "重点观察是否处于创业或筹备创业状态，以及是否有明确的启动需求。"
  },
  {
    code: "C",
    name: "中客单客户",
    description: "有可能付费百元线上课或千元线下课的客户。",
    criteria: "重点观察其对低门槛课程、线下活动和主题内容的兴趣。"
  },
  {
    code: "D",
    name: "低客单客户",
    description: "停留在低价引流课和免费资料阶段的客户。",
    criteria: "重点观察是否只领取资料、缺少付费意愿或缺少明确增长需求。"
  }
];

export const CUSTOMER_STAGES: RuleItem<CustomerStageCode>[] = [
  {
    code: "greeting_materials",
    name: "打招呼，给资料",
    description: "加上微信，做好自我介绍，送出免费的引流资料和引流测试。",
    criteria: "适用于刚建立联系、还未形成需求判断的客户。"
  },
  {
    code: "discover_needs",
    name: "探需求，收信息",
    description: "依据资料和测试做好陪学、督学，在互动中探明基础信息和基本需求，完成首次标签。",
    criteria: "适用于已有初步互动，但信息仍在收集阶段的客户。"
  },
  {
    code: "build_trust",
    name: "建信任，高互动",
    description: "在朋友圈、私聊两个场景中互动，给予情绪价值和干货资料，拉近关系。",
    criteria: "适用于需求已初步明确，需要持续建立信任的客户。"
  },
  {
    code: "present_offer",
    name: "亮产品，真连接",
    description: "亮出产品与服务，邀请参与合伙人面诊、低价引流课、线下小活动。",
    criteria: "适用于可开始介绍具体产品或邀请真实连接的客户。"
  },
  {
    code: "offline_conversion",
    name: "来线下，做转化",
    description: "来到线下大课，感受完整内容体系，集中转化。",
    criteria: "适用于已经进入线下场景或临近转化节点的客户。"
  },
  {
    code: "maintenance_referral",
    name: "维护好，转介绍",
    description: "进入创业进化营后，做好陪学、陪聊和朋友圈互动，争取形成转介绍。",
    criteria: "适用于已成交或高信任客户，需要维护和转介绍经营。"
  }
];

export const VALUE_RISK_RULES: RuleItem<ValueRiskCode>[] = [
  {
    code: "self_centered",
    name: "自我中心",
    description: "不尊重主办方，哗众取宠，热爱自我表现，不分场合推销自己。",
    criteria: "出现明显不尊重、不分场合自我推销、破坏社群氛围时标记。"
  },
  {
    code: "entrepreneurial_illusion",
    name: "创业幻觉",
    description: "项目起步期估值超 10 亿，自我评价与真实水平差距过大。",
    criteria: "出现明显估值泡沫、自我认知失真且难以沟通时标记。"
  },
  {
    code: "networking_mixer",
    name: "圈层混子",
    description: "没有任何学习意愿，只想入群加微信、入圈递名片。",
    criteria: "出现只索取人脉资源、不参与学习、不尊重交付边界时标记。"
  }
];

export function findCustomerLayer(code: CustomerLayerCode) {
  return CUSTOMER_LAYERS.find((layer) => layer.code === code);
}

export function findCustomerStage(code: CustomerStageCode) {
  return CUSTOMER_STAGES.find((stage) => stage.code === code);
}
```

- [ ] **Step 4: Run taxonomy tests**

Run:

```bash
npm test -- src/features/tags/tag-system.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/tags/tag-system.ts src/features/tags/tag-system.test.ts
git commit -m "feat: add CRM tag taxonomy"
```

---

## Task 3: Add Customer Domain Schema and Validation

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-schema.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-schema.test.ts`

- [ ] **Step 1: Write failing customer schema tests**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { customerCreateSchema, normalizeCustomerInput } from "./customer-schema";

describe("customer schema", () => {
  it("accepts minimal customer input", () => {
    const parsed = customerCreateSchema.parse({ displayName: "张三" });
    expect(parsed.displayName).toBe("张三");
  });

  it("trims optional text fields and converts empty strings to null", () => {
    const normalized = normalizeCustomerInput({
      displayName: "  李四  ",
      wechatName: "  ",
      company: "  某某科技  ",
      roleTitle: " 创始人 "
    });

    expect(normalized).toEqual({
      displayName: "李四",
      wechatName: null,
      wechatId: null,
      phone: null,
      company: "某某科技",
      industry: null,
      roleTitle: "创始人",
      sourceChannel: null,
      notes: null
    });
  });

  it("rejects an empty display name", () => {
    expect(() => customerCreateSchema.parse({ displayName: "   " })).toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/features/customers/customer-schema.test.ts
```

Expected: FAIL because `customer-schema.ts` does not exist.

- [ ] **Step 3: Implement customer schema**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-schema.ts`:

```ts
import { z } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
  });

export const customerCreateSchema = z.object({
  displayName: z.string().trim().min(1, "客户称呼不能为空"),
  wechatName: optionalText,
  wechatId: optionalText,
  phone: optionalText,
  company: optionalText,
  industry: optionalText,
  roleTitle: optionalText,
  sourceChannel: optionalText,
  notes: optionalText
});

export type CustomerCreateInput = z.input<typeof customerCreateSchema>;
export type NormalizedCustomerCreateInput = z.output<typeof customerCreateSchema>;

export function normalizeCustomerInput(input: CustomerCreateInput): NormalizedCustomerCreateInput {
  return customerCreateSchema.parse(input);
}
```

- [ ] **Step 4: Run customer schema tests**

Run:

```bash
npm test -- src/features/customers/customer-schema.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/customers/customer-schema.ts src/features/customers/customer-schema.test.ts
git commit -m "feat: validate customer input"
```

---

## Task 4: Add Database Schema, Prisma Client, and Seed Data

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/docker-compose.yml`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/prisma/schema.prisma`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/prisma/seed.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/server/db.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/server/env.ts`
- Modify: `/Users/yzy/Desktop/202605/siyu-manager/package.json`

- [ ] **Step 1: Create local PostgreSQL service**

Create `/Users/yzy/Desktop/202605/siyu-manager/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: crm_agents_postgres
    environment:
      POSTGRES_USER: crm
      POSTGRES_PASSWORD: crm
      POSTGRES_DB: crm_agents
    ports:
      - "5432:5432"
    volumes:
      - crm_agents_postgres_data:/var/lib/postgresql/data

volumes:
  crm_agents_postgres_data:
```

- [ ] **Step 2: Create Prisma schema**

Create `/Users/yzy/Desktop/202605/siyu-manager/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum CustomerLayer {
  S
  A
  B
  C
  D
}

enum CustomerStage {
  greeting_materials
  discover_needs
  build_trust
  present_offer
  offline_conversion
  maintenance_referral
}

enum MaterialType {
  manual_note
  chat_text
  screenshot
  attachment
}

model Workspace {
  id        String     @id @default(cuid())
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  users     User[]
  customers Customer[]
  tagRules  TagRule[]
}

model User {
  id          String     @id @default(cuid())
  workspaceId String
  email       String?
  name        String
  role        String     @default("owner")
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  workspace   Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  customers   Customer[] @relation("CustomerOwner")
}

model Customer {
  id                String             @id @default(cuid())
  workspaceId       String
  ownerUserId       String?
  displayName       String
  wechatName        String?
  wechatId          String?
  phone             String?
  company           String?
  industry          String?
  roleTitle         String?
  sourceChannel     String?
  notes             String?
  currentLayer      CustomerLayer?
  currentStage      CustomerStage?
  hasValueRisk      Boolean            @default(false)
  valueRiskNotes    String?
  lastInteractionAt DateTime?
  archivedAt        DateTime?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  workspace         Workspace          @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  owner             User?              @relation("CustomerOwner", fields: [ownerUserId], references: [id], onDelete: SetNull)
  materials         CustomerMaterial[]
  aiAnalyses        AiAnalysis[]

  @@index([workspaceId, currentLayer])
  @@index([workspaceId, currentStage])
  @@index([workspaceId, updatedAt])
}

model CustomerMaterial {
  id          String       @id @default(cuid())
  customerId  String
  type        MaterialType
  title       String
  contentText String?
  fileUrl     String?
  mimeType    String?
  fileName    String?
  createdAt   DateTime     @default(now())
  customer    Customer     @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@index([customerId, createdAt])
}

model AiAnalysis {
  id                    String    @id @default(cuid())
  customerId            String
  model                 String
  materialIds           String[]
  summary               String
  profileSignals        Json
  needSignals           Json
  paymentSignals        Json
  valueRiskSignals      Json
  recommendedLayer      String?
  layerConfidence       Int
  layerReason           String
  recommendedStage      String?
  stageConfidence       Int
  stageReason           String
  evidenceQuotes        Json
  missingInformation    Json
  humanConfirmedLayer   String?
  humanConfirmedStage   String?
  humanFeedbackNote     String?
  createdAt             DateTime  @default(now())
  customer              Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@index([customerId, createdAt])
}

model TagRule {
  id          String    @id @default(cuid())
  workspaceId String
  category    String
  code        String
  name        String
  description String
  criteria    String
  updatedAt   DateTime  @updatedAt
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, category, code])
}
```

- [ ] **Step 3: Create env and db modules**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/server/env.ts`:

```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5.4-mini"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("crm-materials"),
  LOCAL_UPLOAD_DIR: z.string().default(".data/uploads")
});

export const env = envSchema.parse(process.env);
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/server/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 4: Create seed script**

Create `/Users/yzy/Desktop/202605/siyu-manager/prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";
import { CUSTOMER_LAYERS, CUSTOMER_STAGES, VALUE_RISK_RULES } from "../src/features/tags/tag-system";
import { appConfig } from "../src/app-config";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { id: "default-workspace" },
    update: { name: appConfig.defaultWorkspaceName },
    create: { id: "default-workspace", name: appConfig.defaultWorkspaceName }
  });

  await prisma.user.upsert({
    where: { id: "default-owner" },
    update: { name: "默认用户", workspaceId: workspace.id },
    create: { id: "default-owner", name: "默认用户", workspaceId: workspace.id, role: "owner" }
  });

  const rules = [
    ...CUSTOMER_LAYERS.map((rule) => ({ category: "layer", ...rule })),
    ...CUSTOMER_STAGES.map((rule) => ({ category: "stage", ...rule })),
    ...VALUE_RISK_RULES.map((rule) => ({ category: "value_risk", ...rule }))
  ];

  for (const rule of rules) {
    await prisma.tagRule.upsert({
      where: { workspaceId_category_code: { workspaceId: workspace.id, category: rule.category, code: rule.code } },
      update: { name: rule.name, description: rule.description, criteria: rule.criteria },
      create: { workspaceId: workspace.id, category: rule.category, code: rule.code, name: rule.name, description: rule.description, criteria: rule.criteria }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 5: Add Prisma seed config to package.json**

Modify `/Users/yzy/Desktop/202605/siyu-manager/package.json` by adding the top-level `prisma` key after `devDependencies`:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Ensure the final JSON remains valid.

- [ ] **Step 6: Validate schema and run migration**

Run:

```bash
docker compose up -d
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

Expected: Prisma generates a client, applies the `init` migration, and seeds default workspace/user/tag rules.

- [ ] **Step 7: Commit**

Run:

```bash
git add docker-compose.yml prisma src/server package.json package-lock.json
git commit -m "feat: add CRM persistence schema"
```

---

## Task 5: Implement Customer Repository, Actions, List, and Create Page

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-repository.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-actions.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerForm.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerList.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-actions.test.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/customers/page.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/customers/new/page.tsx`

- [ ] **Step 1: Write failing action tests**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-actions.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createCustomerForTest } from "./customer-actions";

describe("customer actions", () => {
  it("normalizes input before creating a customer", async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({ id: "customer_1", displayName: "张三" })
    };

    const result = await createCustomerForTest(
      { displayName: " 张三 ", company: "  增长科技  ", wechatName: " " },
      repository
    );

    expect(repository.create).toHaveBeenCalledWith({
      displayName: "张三",
      wechatName: null,
      wechatId: null,
      phone: null,
      company: "增长科技",
      industry: null,
      roleTitle: null,
      sourceChannel: null,
      notes: null
    });
    expect(result.id).toBe("customer_1");
  });
});
```

- [ ] **Step 2: Run action test to verify failure**

Run:

```bash
npm test -- src/features/customers/customer-actions.test.ts
```

Expected: FAIL because `customer-actions.ts` does not export `createCustomerForTest`.

- [ ] **Step 3: Implement repository and actions**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-repository.ts`:

```ts
import { prisma } from "@/server/db";
import type { NormalizedCustomerCreateInput } from "./customer-schema";

const DEFAULT_WORKSPACE_ID = "default-workspace";
const DEFAULT_OWNER_ID = "default-owner";

export type CustomerRepository = {
  create(input: NormalizedCustomerCreateInput): Promise<{ id: string; displayName: string }>;
};

export const customerRepository: CustomerRepository = {
  async create(input) {
    return prisma.customer.create({
      data: {
        ...input,
        workspaceId: DEFAULT_WORKSPACE_ID,
        ownerUserId: DEFAULT_OWNER_ID
      },
      select: { id: true, displayName: true }
    });
  }
};

export async function listCustomers(params: { query?: string; layer?: string; stage?: string }) {
  return prisma.customer.findMany({
    where: {
      workspaceId: DEFAULT_WORKSPACE_ID,
      archivedAt: null,
      displayName: params.query ? { contains: params.query, mode: "insensitive" } : undefined,
      currentLayer: params.layer ? (params.layer as never) : undefined,
      currentStage: params.stage ? (params.stage as never) : undefined
    },
    orderBy: { updatedAt: "desc" },
    include: { aiAnalyses: { orderBy: { createdAt: "desc" }, take: 1 } }
  });
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeCustomerInput, type CustomerCreateInput } from "./customer-schema";
import { customerRepository, type CustomerRepository } from "./customer-repository";

export async function createCustomerForTest(input: CustomerCreateInput, repository: CustomerRepository) {
  return repository.create(normalizeCustomerInput(input));
}

export async function createCustomerAction(formData: FormData) {
  const customer = await customerRepository.create(
    normalizeCustomerInput({
      displayName: String(formData.get("displayName") ?? ""),
      wechatName: String(formData.get("wechatName") ?? ""),
      wechatId: String(formData.get("wechatId") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      roleTitle: String(formData.get("roleTitle") ?? ""),
      sourceChannel: String(formData.get("sourceChannel") ?? ""),
      notes: String(formData.get("notes") ?? "")
    })
  );

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}
```

- [ ] **Step 4: Run action tests**

Run:

```bash
npm test -- src/features/customers/customer-actions.test.ts
```

Expected: PASS.

- [ ] **Step 5: Implement customer form, list, and pages**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerForm.tsx`:

```tsx
import { createCustomerAction } from "./customer-actions";

const fields = [
  ["displayName", "客户称呼", true],
  ["wechatName", "微信昵称", false],
  ["wechatId", "微信号", false],
  ["phone", "手机号", false],
  ["company", "公司/项目", false],
  ["industry", "行业", false],
  ["roleTitle", "职位/角色", false],
  ["sourceChannel", "来源渠道", false]
] as const;

export function CustomerForm() {
  return (
    <form action={createCustomerAction} className="space-y-5 rounded-2xl border border-crm-line bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([name, label, required]) => (
          <label key={name} className="space-y-2 text-sm font-medium">
            <span>{label}{required ? " *" : ""}</span>
            <input name={name} required={required} className="w-full rounded-lg border border-crm-line px-3 py-2" />
          </label>
        ))}
      </div>
      <label className="block space-y-2 text-sm font-medium">
        <span>备注</span>
        <textarea name="notes" rows={4} className="w-full rounded-lg border border-crm-line px-3 py-2" />
      </label>
      <button className="rounded-lg bg-crm-primary px-4 py-2 text-white" type="submit">创建客户</button>
    </form>
  );
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerList.tsx`:

```tsx
import Link from "next/link";
import type { CustomerLayer, CustomerStage } from "@prisma/client";

type CustomerListItem = {
  id: string;
  displayName: string;
  company: string | null;
  roleTitle: string | null;
  currentLayer: CustomerLayer | null;
  currentStage: CustomerStage | null;
  updatedAt: Date;
};

export function CustomerList({ customers }: { customers: CustomerListItem[] }) {
  if (customers.length === 0) {
    return <div className="rounded-2xl border border-dashed border-crm-line bg-white p-8 text-center text-crm-muted">还没有客户，先创建一个真实客户。</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-crm-line bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-crm-surface text-crm-muted">
          <tr>
            <th className="px-4 py-3">客户</th>
            <th className="px-4 py-3">公司/角色</th>
            <th className="px-4 py-3">分层</th>
            <th className="px-4 py-3">阶段</th>
            <th className="px-4 py-3">更新时间</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t border-crm-line">
              <td className="px-4 py-3 font-medium"><Link href={`/customers/${customer.id}`}>{customer.displayName}</Link></td>
              <td className="px-4 py-3 text-crm-muted">{[customer.company, customer.roleTitle].filter(Boolean).join(" / ") || "-"}</td>
              <td className="px-4 py-3">{customer.currentLayer ?? "未定"}</td>
              <td className="px-4 py-3">{customer.currentStage ?? "未定"}</td>
              <td className="px-4 py-3 text-crm-muted">{customer.updatedAt.toLocaleDateString("zh-CN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/app/customers/page.tsx`:

```tsx
import Link from "next/link";
import { CustomerList } from "@/features/customers/CustomerList";
import { listCustomers } from "@/features/customers/customer-repository";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const customers = await listCustomers({ query: params.query, layer: params.layer, stage: params.stage });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">客户列表</h1>
          <p className="mt-1 text-crm-muted">搜索、筛选并进入客户知识库。</p>
        </div>
        <Link className="rounded-lg bg-crm-primary px-4 py-2 text-white" href="/customers/new">新建客户</Link>
      </div>
      <form className="flex gap-3 rounded-2xl border border-crm-line bg-white p-4">
        <input name="query" defaultValue={params.query ?? ""} placeholder="搜索客户称呼" className="flex-1 rounded-lg border border-crm-line px-3 py-2" />
        <button className="rounded-lg border border-crm-line px-4 py-2">搜索</button>
      </form>
      <CustomerList customers={customers} />
    </div>
  );
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/app/customers/new/page.tsx`:

```tsx
import { CustomerForm } from "@/features/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">新建客户</h1>
        <p className="mt-1 text-crm-muted">先用少量字段建档，后续再持续补充资料。</p>
      </div>
      <CustomerForm />
    </div>
  );
}
```

- [ ] **Step 6: Run verification**

Run:

```bash
npm test -- src/features/customers/customer-actions.test.ts
npm run typecheck
```

Expected: test and typecheck pass.

- [ ] **Step 7: Commit**

Run:

```bash
git add app/customers src/features/customers
git commit -m "feat: add customer list and creation flow"
```

---

## Task 6: Implement Materials Timeline and Storage Adapter

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-schema.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-schema.test.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-storage.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-repository.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-actions.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/MaterialComposer.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerTimeline.tsx`

- [ ] **Step 1: Write failing material schema tests**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { materialCreateSchema } from "./material-schema";

describe("material schema", () => {
  it("accepts pasted chat text", () => {
    const parsed = materialCreateSchema.parse({ customerId: "c1", type: "chat_text", title: "5月14日聊天", contentText: "客户说想增长" });
    expect(parsed.type).toBe("chat_text");
  });

  it("rejects manual text with empty content", () => {
    expect(() => materialCreateSchema.parse({ customerId: "c1", type: "manual_note", title: "记录", contentText: " " })).toThrow();
  });
});
```

- [ ] **Step 2: Run schema test to verify failure**

Run:

```bash
npm test -- src/features/materials/material-schema.test.ts
```

Expected: FAIL because `material-schema.ts` does not exist.

- [ ] **Step 3: Implement material schema**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-schema.ts`:

```ts
import { z } from "zod";

export const materialTypeSchema = z.enum(["manual_note", "chat_text", "screenshot", "attachment"]);

export const materialCreateSchema = z.object({
  customerId: z.string().min(1),
  type: materialTypeSchema,
  title: z.string().trim().min(1, "资料标题不能为空"),
  contentText: z.string().trim().optional(),
  fileUrl: z.string().optional(),
  mimeType: z.string().optional(),
  fileName: z.string().optional()
}).superRefine((value, ctx) => {
  if ((value.type === "manual_note" || value.type === "chat_text") && !value.contentText) {
    ctx.addIssue({ code: "custom", path: ["contentText"], message: "文字资料必须填写内容" });
  }
  if ((value.type === "screenshot" || value.type === "attachment") && !value.fileUrl) {
    ctx.addIssue({ code: "custom", path: ["fileUrl"], message: "文件资料必须包含文件地址" });
  }
});

export type MaterialCreateInput = z.infer<typeof materialCreateSchema>;
```

- [ ] **Step 4: Implement storage, repository, actions, and UI**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-storage.ts`:

```ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/server/env";

export type StoredFile = { fileUrl: string; fileName: string; mimeType: string };

export async function storeMaterialFile(customerId: string, file: File): Promise<StoredFile> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const storageKey = `${customerId}/${safeName}`;

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(storageKey, bytes, { contentType: file.type, upsert: false });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const { data } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(storageKey);
    return { fileUrl: data.publicUrl, fileName: file.name, mimeType: file.type };
  }

  const directory = path.join(process.cwd(), env.LOCAL_UPLOAD_DIR, customerId);
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, safeName);
  await writeFile(target, bytes);
  return { fileUrl: `/${env.LOCAL_UPLOAD_DIR}/${customerId}/${safeName}`, fileName: file.name, mimeType: file.type };
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-repository.ts`:

```ts
import { prisma } from "@/server/db";
import type { MaterialCreateInput } from "./material-schema";

export async function createMaterial(input: MaterialCreateInput) {
  return prisma.customerMaterial.create({ data: input });
}

export async function listMaterials(customerId: string) {
  return prisma.customerMaterial.findMany({ where: { customerId }, orderBy: { createdAt: "desc" } });
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/material-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { materialCreateSchema } from "./material-schema";
import { createMaterial } from "./material-repository";
import { storeMaterialFile } from "./material-storage";

export async function addMaterialAction(customerId: string, formData: FormData) {
  const type = String(formData.get("type"));
  const title = String(formData.get("title") || "客户资料");
  const contentText = String(formData.get("contentText") || "");
  const file = formData.get("file");

  const filePayload = file instanceof File && file.size > 0 ? await storeMaterialFile(customerId, file) : {};

  await createMaterial(
    materialCreateSchema.parse({
      customerId,
      type,
      title,
      contentText,
      ...filePayload
    })
  );

  revalidatePath(`/customers/${customerId}`);
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/materials/MaterialComposer.tsx`:

```tsx
import { addMaterialAction } from "./material-actions";

export function MaterialComposer({ customerId }: { customerId: string }) {
  const action = addMaterialAction.bind(null, customerId);

  return (
    <form action={action} className="space-y-3 rounded-2xl border border-crm-line bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select name="type" className="rounded-lg border border-crm-line px-3 py-2" defaultValue="manual_note">
          <option value="manual_note">手动记录</option>
          <option value="chat_text">聊天文字</option>
          <option value="screenshot">聊天截图</option>
          <option value="attachment">附件</option>
        </select>
        <input name="title" className="rounded-lg border border-crm-line px-3 py-2" placeholder="资料标题" />
      </div>
      <textarea name="contentText" rows={5} className="w-full rounded-lg border border-crm-line px-3 py-2" placeholder="粘贴聊天文字或填写跟进记录" />
      <input name="file" type="file" className="block w-full text-sm" />
      <button type="submit" className="rounded-lg bg-crm-primary px-4 py-2 text-white">添加资料</button>
    </form>
  );
}
```

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerTimeline.tsx`:

```tsx
import type { CustomerMaterial } from "@prisma/client";

export function CustomerTimeline({ materials }: { materials: CustomerMaterial[] }) {
  if (materials.length === 0) {
    return <div className="rounded-2xl border border-dashed border-crm-line bg-white p-6 text-crm-muted">还没有资料，请先添加聊天文字、截图或手动记录。</div>;
  }

  return (
    <ol className="space-y-3">
      {materials.map((material) => (
        <li key={material.id} className="rounded-2xl border border-crm-line bg-white p-4">
          <div className="flex items-center justify-between text-sm text-crm-muted">
            <span>{material.type}</span>
            <time>{material.createdAt.toLocaleString("zh-CN")}</time>
          </div>
          <h3 className="mt-2 font-semibold">{material.title}</h3>
          {material.contentText ? <p className="mt-2 whitespace-pre-wrap text-sm">{material.contentText}</p> : null}
          {material.fileUrl ? <a className="mt-2 block text-sm text-crm-primary" href={material.fileUrl} target="_blank">查看文件：{material.fileName}</a> : null}
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 5: Run material tests and typecheck**

Run:

```bash
npm test -- src/features/materials/material-schema.test.ts
npm run typecheck
```

Expected: tests and typecheck pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/features/materials src/features/customers/CustomerTimeline.tsx
git commit -m "feat: add customer material timeline"
```

---

## Task 7: Implement Customer Detail Page and Manual Label Confirmation

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerDetail.tsx`
- Modify: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-repository.ts`
- Modify: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-actions.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/customers/[customerId]/page.tsx`

- [ ] **Step 1: Add repository functions**

Modify `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-repository.ts` by adding:

```ts
export async function getCustomerDetail(customerId: string) {
  return prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      materials: { orderBy: { createdAt: "desc" } },
      aiAnalyses: { orderBy: { createdAt: "desc" }, take: 5 }
    }
  });
}

export async function updateCustomerLabels(customerId: string, input: { layer: string | null; stage: string | null; valueRiskNotes: string | null }) {
  return prisma.customer.update({
    where: { id: customerId },
    data: {
      currentLayer: input.layer as never,
      currentStage: input.stage as never,
      hasValueRisk: Boolean(input.valueRiskNotes),
      valueRiskNotes: input.valueRiskNotes
    }
  });
}
```

- [ ] **Step 2: Add label action**

Modify `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-actions.ts` by adding:

```ts
import { updateCustomerLabels } from "./customer-repository";

export async function updateCustomerLabelsAction(customerId: string, formData: FormData) {
  await updateCustomerLabels(customerId, {
    layer: String(formData.get("layer") || "") || null,
    stage: String(formData.get("stage") || "") || null,
    valueRiskNotes: String(formData.get("valueRiskNotes") || "").trim() || null
  });

  revalidatePath(`/customers/${customerId}`);
}
```

Ensure import declarations are unique and sorted by module path.

- [ ] **Step 3: Implement detail component**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerDetail.tsx`:

```tsx
import type { AiAnalysis, Customer, CustomerMaterial } from "@prisma/client";
import { CUSTOMER_LAYERS, CUSTOMER_STAGES } from "@/features/tags/tag-system";
import { MaterialComposer } from "@/features/materials/MaterialComposer";
import { CustomerTimeline } from "./CustomerTimeline";
import { updateCustomerLabelsAction } from "./customer-actions";

type CustomerDetailProps = {
  customer: Customer & { materials: CustomerMaterial[]; aiAnalyses: AiAnalysis[] };
};

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const labelAction = updateCustomerLabelsAction.bind(null, customer.id);
  const latestAnalysis = customer.aiAnalyses[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
      <aside className="space-y-4 rounded-2xl border border-crm-line bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm text-crm-muted">客户画像</p>
          <h1 className="mt-1 text-2xl font-bold">{customer.displayName}</h1>
          <p className="mt-2 text-sm text-crm-muted">{[customer.company, customer.roleTitle].filter(Boolean).join(" / ") || "暂无公司和角色"}</p>
        </div>
        <form action={labelAction} className="space-y-3">
          <label htmlFor="customer-layer" className="block text-sm font-medium">客户分层</label>
          <select id="customer-layer" name="layer" defaultValue={customer.currentLayer ?? ""} className="w-full rounded-lg border border-crm-line px-3 py-2">
            <option value="">未定</option>
            {CUSTOMER_LAYERS.map((layer) => <option key={layer.code} value={layer.code}>{layer.code} - {layer.name}</option>)}
          </select>
          <label htmlFor="customer-stage" className="block text-sm font-medium">客户阶段</label>
          <select id="customer-stage" name="stage" defaultValue={customer.currentStage ?? ""} className="w-full rounded-lg border border-crm-line px-3 py-2">
            <option value="">未定</option>
            {CUSTOMER_STAGES.map((stage) => <option key={stage.code} value={stage.code}>{stage.name}</option>)}
          </select>
          <label className="block text-sm font-medium">价值观风险备注</label>
          <textarea name="valueRiskNotes" defaultValue={customer.valueRiskNotes ?? ""} rows={3} className="w-full rounded-lg border border-crm-line px-3 py-2" />
          <button className="w-full rounded-lg bg-crm-primary px-4 py-2 text-white">保存人工标签</button>
        </form>
      </aside>
      <section className="space-y-4">
        <MaterialComposer customerId={customer.id} />
        <CustomerTimeline materials={customer.materials} />
      </section>
      <aside className="rounded-2xl border border-crm-line bg-white p-5 shadow-sm">
        <p className="text-sm text-crm-muted">AI 客户理解</p>
        {latestAnalysis ? (
          <div className="mt-3 space-y-4 text-sm">
            <section><h2 className="font-semibold">摘要</h2><p className="mt-1 whitespace-pre-wrap">{latestAnalysis.summary}</p></section>
            <section><h2 className="font-semibold">分层建议</h2><p className="mt-1">{latestAnalysis.recommendedLayer ?? "信息不足"}：{latestAnalysis.layerReason}</p></section>
            <section><h2 className="font-semibold">阶段建议</h2><p className="mt-1">{latestAnalysis.recommendedStage ?? "信息不足"}：{latestAnalysis.stageReason}</p></section>
          </div>
        ) : (
          <p className="mt-3 text-sm text-crm-muted">还没有 AI 分析。添加资料后可触发分析。</p>
        )}
      </aside>
    </div>
  );
}
```

- [ ] **Step 4: Implement detail route**

Create `/Users/yzy/Desktop/202605/siyu-manager/app/customers/[customerId]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { CustomerDetail } from "@/features/customers/CustomerDetail";
import { getCustomerDetail } from "@/features/customers/customer-repository";

export default async function CustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const customer = await getCustomerDetail(customerId);
  if (!customer) notFound();
  return <CustomerDetail customer={customer} />;
}
```

- [ ] **Step 5: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add app/customers/[customerId] src/features/customers
git commit -m "feat: add customer detail workspace"
```

---

## Task 8: Implement AI Analysis Schema, Prompt Assembly, and Service

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-schema.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-prompts.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-service.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-service.test.ts`

- [ ] **Step 1: Write failing AI service test**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-service.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildCustomerAnalysisPrompt } from "./ai-analysis-prompts";

describe("AI analysis prompt", () => {
  it("includes customer facts, tag rules, and anti-hallucination instruction", () => {
    const prompt = buildCustomerAnalysisPrompt({
      customer: { displayName: "张三", company: "增长科技", roleTitle: "创始人" },
      materials: [{ title: "聊天", type: "chat_text", contentText: "我今年想把营收翻倍" }],
      tagRules: [{ category: "layer", code: "A", name: "高客单客户", description: "可能付费 2 万元以上", criteria: "有创业状态和增长需求" }]
    });

    expect(prompt).toContain("张三");
    expect(prompt).toContain("我今年想把营收翻倍");
    expect(prompt).toContain("高客单客户");
    expect(prompt).toContain("不要凭空猜测");
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- src/features/ai/ai-analysis-service.test.ts
```

Expected: FAIL because AI prompt files do not exist.

- [ ] **Step 3: Implement AI output schema**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-schema.ts`:

```ts
import { z } from "zod";

export const aiSignalSchema = z.object({
  label: z.string(),
  evidence: z.string(),
  confidence: z.number().int().min(0).max(100)
});

export const aiAnalysisOutputSchema = z.object({
  summary: z.string(),
  profileSignals: z.array(aiSignalSchema),
  needSignals: z.array(aiSignalSchema),
  paymentSignals: z.array(aiSignalSchema),
  valueRiskSignals: z.array(aiSignalSchema),
  recommendedLayer: z.enum(["S", "A", "B", "C", "D"]).nullable(),
  layerConfidence: z.number().int().min(0).max(100),
  layerReason: z.string(),
  recommendedStage: z.enum(["greeting_materials", "discover_needs", "build_trust", "present_offer", "offline_conversion", "maintenance_referral"]).nullable(),
  stageConfidence: z.number().int().min(0).max(100),
  stageReason: z.string(),
  evidenceQuotes: z.array(z.string()),
  missingInformation: z.array(z.string())
});

export type AiAnalysisOutput = z.infer<typeof aiAnalysisOutputSchema>;
```

- [ ] **Step 4: Implement prompt builder**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-prompts.ts`:

```ts
type PromptCustomer = { displayName: string; company: string | null; roleTitle: string | null };
type PromptMaterial = { title: string; type: string; contentText: string | null };
type PromptTagRule = { category: string; code: string; name: string; description: string; criteria: string };

export function buildCustomerAnalysisPrompt(input: { customer: PromptCustomer; materials: PromptMaterial[]; tagRules: PromptTagRule[] }) {
  const customerBlock = [
    `客户称呼：${input.customer.displayName}`,
    `公司/项目：${input.customer.company ?? "未知"}`,
    `职位/角色：${input.customer.roleTitle ?? "未知"}`
  ].join("\n");

  const materialBlock = input.materials
    .map((material, index) => [`资料 ${index + 1}`, `标题：${material.title}`, `类型：${material.type}`, `内容：${material.contentText ?? "仅有文件或截图，文字内容不足"}`].join("\n"))
    .join("\n\n");

  const rulesBlock = input.tagRules
    .map((rule) => [`${rule.category}/${rule.code}/${rule.name}`, `说明：${rule.description}`, `判断标准：${rule.criteria}`].join("\n"))
    .join("\n\n");

  return [
    "你是私域 CRM 的客户理解助手。",
    "只基于给定客户资料和业务规则分析，不要凭空猜测。",
    "如果资料不足，请明确指出缺失信息，不要强行给结论。",
    "分层和分阶只是建议，最终由业务人员人工确认。",
    "",
    "# 客户信息",
    customerBlock,
    "",
    "# 客户资料",
    materialBlock || "没有客户资料。",
    "",
    "# 标签规则",
    rulesBlock
  ].join("\n");
}
```

- [ ] **Step 5: Implement OpenAI service**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-service.ts`:

```ts
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/server/env";
import { aiAnalysisOutputSchema, type AiAnalysisOutput } from "./ai-analysis-schema";

export type AnalysisMessageInput = {
  prompt: string;
};

export async function requestCustomerAnalysis(input: AnalysisMessageInput): Promise<AiAnalysisOutput> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required to run customer analysis");
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "user",
        content: [{ type: "input_text", text: input.prompt }]
      }
    ],
    text: {
      format: zodTextFormat(aiAnalysisOutputSchema, "customer_analysis")
    }
  });

  const parsed = response.output_parsed;
  if (!parsed) {
    throw new Error("OpenAI response did not include parsed customer analysis");
  }
  return parsed;
}
```

- [ ] **Step 6: Run AI prompt tests and typecheck**

Run:

```bash
npm test -- src/features/ai/ai-analysis-service.test.ts
npm run typecheck
```

Expected: tests and typecheck pass. If the installed OpenAI SDK exposes a different helper path for `zodTextFormat`, update only `ai-analysis-service.ts` to the helper path documented by the installed SDK, then rerun the same commands.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/features/ai
git commit -m "feat: add AI analysis prompt and schema"
```

---

## Task 9: Persist AI Analysis and Add Trigger Button

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-actions.ts`
- Modify: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerDetail.tsx`
- Modify: `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-repository.ts`

- [ ] **Step 1: Add repository helpers**

Modify `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/customer-repository.ts` by adding:

```ts
export async function getCustomerForAnalysis(customerId: string) {
  return prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      materials: { orderBy: { createdAt: "asc" } },
      workspace: { include: { tagRules: true } }
    }
  });
}

export async function createAiAnalysis(customerId: string, model: string, materialIds: string[], output: import("@/features/ai/ai-analysis-schema").AiAnalysisOutput) {
  return prisma.aiAnalysis.create({
    data: {
      customerId,
      model,
      materialIds,
      summary: output.summary,
      profileSignals: output.profileSignals,
      needSignals: output.needSignals,
      paymentSignals: output.paymentSignals,
      valueRiskSignals: output.valueRiskSignals,
      recommendedLayer: output.recommendedLayer,
      layerConfidence: output.layerConfidence,
      layerReason: output.layerReason,
      recommendedStage: output.recommendedStage,
      stageConfidence: output.stageConfidence,
      stageReason: output.stageReason,
      evidenceQuotes: output.evidenceQuotes,
      missingInformation: output.missingInformation
    }
  });
}
```

- [ ] **Step 2: Implement analysis action**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/ai/ai-analysis-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { env } from "@/server/env";
import { createAiAnalysis, getCustomerForAnalysis } from "@/features/customers/customer-repository";
import { buildCustomerAnalysisPrompt } from "./ai-analysis-prompts";
import { requestCustomerAnalysis } from "./ai-analysis-service";

export async function runCustomerAnalysisAction(customerId: string) {
  const customer = await getCustomerForAnalysis(customerId);
  if (!customer) throw new Error("Customer not found");

  const prompt = buildCustomerAnalysisPrompt({
    customer,
    materials: customer.materials,
    tagRules: customer.workspace.tagRules
  });

  const output = await requestCustomerAnalysis({ prompt });
  await createAiAnalysis(customer.id, env.OPENAI_MODEL, customer.materials.map((material) => material.id), output);
  revalidatePath(`/customers/${customerId}`);
}
```

- [ ] **Step 3: Add trigger button to detail page**

Modify `/Users/yzy/Desktop/202605/siyu-manager/src/features/customers/CustomerDetail.tsx` by importing the action:

```ts
import { runCustomerAnalysisAction } from "@/features/ai/ai-analysis-actions";
```

Inside `CustomerDetail`, add:

```ts
const analysisAction = runCustomerAnalysisAction.bind(null, customer.id);
```

In the AI panel, above the existing latest analysis block, add:

```tsx
<form action={analysisAction}>
  <button className="mb-4 w-full rounded-lg bg-crm-primary px-4 py-2 text-white">重新生成 AI 分析</button>
</form>
```

- [ ] **Step 4: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/ai/ai-analysis-actions.ts src/features/customers
git commit -m "feat: persist customer AI analyses"
```

---

## Task 10: Implement Editable Tag Rules Page

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-rules-repository.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-rules-actions.ts`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/TagRulesEditor.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/tags/page.tsx`

- [ ] **Step 1: Implement repository**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-rules-repository.ts`:

```ts
import { prisma } from "@/server/db";

const DEFAULT_WORKSPACE_ID = "default-workspace";

export async function listTagRules() {
  return prisma.tagRule.findMany({ where: { workspaceId: DEFAULT_WORKSPACE_ID }, orderBy: [{ category: "asc" }, { code: "asc" }] });
}

export async function updateTagRule(ruleId: string, input: { description: string; criteria: string }) {
  return prisma.tagRule.update({ where: { id: ruleId }, data: input });
}
```

- [ ] **Step 2: Implement action**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/tag-rules-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { updateTagRule } from "./tag-rules-repository";

export async function updateTagRuleAction(ruleId: string, formData: FormData) {
  await updateTagRule(ruleId, {
    description: String(formData.get("description") ?? "").trim(),
    criteria: String(formData.get("criteria") ?? "").trim()
  });
  revalidatePath("/tags");
}
```

- [ ] **Step 3: Implement editor**

Create `/Users/yzy/Desktop/202605/siyu-manager/src/features/tags/TagRulesEditor.tsx`:

```tsx
import type { TagRule } from "@prisma/client";
import { updateTagRuleAction } from "./tag-rules-actions";

export function TagRulesEditor({ rules }: { rules: TagRule[] }) {
  return (
    <div className="space-y-4">
      {rules.map((rule) => {
        const action = updateTagRuleAction.bind(null, rule.id);
        return (
          <form key={rule.id} action={action} className="rounded-2xl border border-crm-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-crm-muted">{rule.category}/{rule.code}</p>
                <h2 className="text-lg font-semibold">{rule.name}</h2>
              </div>
              <button className="rounded-lg border border-crm-line px-3 py-2 text-sm">保存</button>
            </div>
            <label className="mt-4 block text-sm font-medium">说明</label>
            <textarea name="description" defaultValue={rule.description} rows={2} className="mt-2 w-full rounded-lg border border-crm-line px-3 py-2" />
            <label className="mt-4 block text-sm font-medium">判断标准</label>
            <textarea name="criteria" defaultValue={rule.criteria} rows={3} className="mt-2 w-full rounded-lg border border-crm-line px-3 py-2" />
          </form>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Implement tags page**

Create `/Users/yzy/Desktop/202605/siyu-manager/app/tags/page.tsx`:

```tsx
import { TagRulesEditor } from "@/features/tags/TagRulesEditor";
import { listTagRules } from "@/features/tags/tag-rules-repository";

export default async function TagsPage() {
  const rules = await listTagRules();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">标签体系设置</h1>
        <p className="mt-1 text-crm-muted">结构固定，说明和判断标准可持续优化。</p>
      </div>
      <TagRulesEditor rules={rules} />
    </div>
  );
}
```

- [ ] **Step 5: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add app/tags src/features/tags/tag-rules-repository.ts src/features/tags/tag-rules-actions.ts src/features/tags/TagRulesEditor.tsx
git commit -m "feat: edit CRM tag rules"
```

---

## Task 11: Add AI Analysis Records Page and MVP E2E Test

**Files:**
- Create: `/Users/yzy/Desktop/202605/siyu-manager/app/ai-analyses/page.tsx`
- Create: `/Users/yzy/Desktop/202605/siyu-manager/tests/e2e/customer-knowledge-base.spec.ts`

- [ ] **Step 1: Implement AI analysis records page**

Create `/Users/yzy/Desktop/202605/siyu-manager/app/ai-analyses/page.tsx`:

```tsx
import { prisma } from "@/server/db";

export default async function AiAnalysesPage() {
  const analyses = await prisma.aiAnalysis.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { customer: { select: { displayName: true } } }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI 分析记录</h1>
        <p className="mt-1 text-crm-muted">用于追溯每次 AI 分析的输出。</p>
      </div>
      <div className="space-y-3">
        {analyses.map((analysis) => (
          <article key={analysis.id} className="rounded-2xl border border-crm-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm text-crm-muted">
              <span>{analysis.customer.displayName}</span>
              <time>{analysis.createdAt.toLocaleString("zh-CN")}</time>
            </div>
            <h2 className="mt-3 font-semibold">{analysis.summary}</h2>
            <p className="mt-2 text-sm">分层建议：{analysis.recommendedLayer ?? "信息不足"}，阶段建议：{analysis.recommendedStage ?? "信息不足"}</p>
          </article>
        ))}
        {analyses.length === 0 ? <div className="rounded-2xl border border-dashed border-crm-line bg-white p-8 text-center text-crm-muted">还没有 AI 分析记录。</div> : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Playwright E2E test**

Create `/Users/yzy/Desktop/202605/siyu-manager/tests/e2e/customer-knowledge-base.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("customer knowledge base flow without AI call", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "进入客户列表" }).click();
  await page.getByRole("link", { name: "新建客户" }).click();

  await page.getByLabel("客户称呼 *").fill("测试客户");
  await page.getByLabel("公司/项目").fill("测试科技");
  await page.getByLabel("职位/角色").fill("创始人");
  await page.getByRole("button", { name: "创建客户" }).click();

  await expect(page.getByRole("heading", { name: "测试客户" })).toBeVisible();
  await page.getByRole("textbox", { name: /粘贴聊天文字|填写跟进记录/ }).fill("客户表达了明确增长需求，希望今年营收翻倍。");
  await page.getByPlaceholder("资料标题").fill("首次聊天记录");
  await page.getByRole("button", { name: "添加资料" }).click();

  await expect(page.getByText("首次聊天记录")).toBeVisible();
  await page.getByLabel("客户分层").selectOption("A");
  await page.getByRole("button", { name: "保存人工标签" }).click();
  await expect(page.getByText("AI 客户理解")).toBeVisible();
});
```

- [ ] **Step 3: Run build and e2e**

Run:

```bash
npm run build
npm run e2e
```

Expected: build exits with code 0, Playwright test passes.

- [ ] **Step 4: Commit**

Run:

```bash
git add app/ai-analyses tests/e2e/customer-knowledge-base.spec.ts
git commit -m "test: cover customer knowledge base flow"
```

---

## Task 12: Final MVP Verification and Documentation

**Files:**
- Modify: `/Users/yzy/Desktop/202605/siyu-manager/README.md`

- [ ] **Step 1: Update README**

Modify `/Users/yzy/Desktop/202605/siyu-manager/README.md`:

```md
# crm-agents

私域 CRM 客户知识库 MVP。

## MVP 能力

- 客户列表、搜索、新建客户。
- 客户详情页：客户画像、人工分层/分阶、资料时间线。
- 资料沉淀：手动记录、聊天文字、截图、附件。
- 标签体系：固定 S/A/B/C/D 分层和 6 个分阶，说明和判断标准可编辑。
- AI 客户理解：摘要、关键信号、分层/分阶理由、风险信号、缺失信息。
- 单人使用优先，数据结构预留团队协作。

## 本地运行

```bash
npm install
cp .env.example .env
docker compose up -d
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

打开 `http://localhost:3000`。

## 验证

```bash
npm test
npm run typecheck
npm run build
npm run e2e
```

## AI 配置

在 `.env` 中配置：

```bash
OPENAI_API_KEY="你的 OpenAI API Key"
OPENAI_MODEL="gpt-5.4-mini"
```

未配置 `OPENAI_API_KEY` 时，客户资料、标签、时间线等 CRM 能力仍可使用；触发 AI 分析会显示缺少 API Key 的错误。
```

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run typecheck
npm run build
npm run e2e
```

Expected: all commands exit with code 0.

- [ ] **Step 3: Check git state**

Run:

```bash
git status --short --branch
```

Expected: only README changes are unstaged before the final commit.

- [ ] **Step 4: Commit README and push**

Run:

```bash
git add README.md
git commit -m "docs: document CRM MVP setup"
git push
```

Expected: remote `origin/main` receives all MVP implementation commits.

---

## Self-Review Checklist

Spec coverage:

- Customer list/search/create: Task 5.
- Customer detail page: Task 7.
- Customer materials timeline: Task 6.
- Manual notes/chat text/screenshots/attachments: Task 6.
- Built-in S/A/B/C/D and six stages: Task 2.
- Editable rule descriptions and criteria: Task 10.
- AI summary/signals/reasons/risks/missing information: Tasks 8 and 9.
- Human-confirmed labels: Task 7.
- AI analysis history: Tasks 9 and 11.
- Single-user UI with workspace/user reserved: Task 4.
- MVP verification with real flow: Task 11 and Task 12.

Plan consistency:

- `CustomerLayerCode`, `CustomerStageCode`, Prisma enum values, and AI schema enum values use the same codes.
- `default-workspace` and `default-owner` are seeded before customer creation.
- AI calls are isolated in `requestCustomerAnalysis` and can be replaced without changing UI components.
- Uploads use Supabase Storage when configured and local filesystem fallback when not configured.

