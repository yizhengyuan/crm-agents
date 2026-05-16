# crm-agents

私域 CRM 客户知识库 MVP v2。

## MVP 能力

- 客户列表、搜索、新建客户。
- 客户详情页：客户画像、人工分层/分阶、资料时间线。
- 资料沉淀：手动记录、聊天文字、截图、附件。
- 截图 OCR：上传截图后自动识别文字，支持人工修正。
- 标签体系：固定 S/A/B/C/D 分层和 6 个分阶，说明和判断标准可编辑。
- AI 客户理解：摘要、关键信号、分层/分阶理由、风险信号、缺失信息。
- AI 分析状态机：可追踪 pending/running/succeeded/failed，支持重试。
- 单人使用优先，数据结构预留团队协作。
- 基础访问保护：`APP_ACCESS_PASSWORD` + cookie session。

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

未配置 `OPENAI_API_KEY` 时，客户资料、标签、时间线等 CRM 能力仍可使用；触发 AI 分析或截图 OCR 会显示失败状态。

## 安全与隐私

- 客户资料（聊天文字、截图、附件）会发送至第三方 AI 模型进行分析。
- AI 分析仅为建议，客户分层和阶段最终由人工确认。
- 生产环境必须设置 `APP_ACCESS_PASSWORD`。
- 生产环境 `ALLOW_LOCAL_UPLOADS=false`，文件存储在对象存储中。
- Cookie 为 HttpOnly / SameSite / Secure（生产环境）。
