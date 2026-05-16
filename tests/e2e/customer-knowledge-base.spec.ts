import { expect, test } from "@playwright/test";

test("customer knowledge base v2 flow", async ({ page }) => {
  // 1. Login (when APP_ACCESS_PASSWORD is set, skip otherwise)
  await page.goto("/");
  if (page.url().includes("/login")) {
    await page.getByLabel("访问密码").fill(process.env.E2E_APP_PASSWORD ?? "");
    await page.getByRole("button", { name: "登录" }).click();
  }

  // 2. Create customer
  await page.getByRole("link", { name: "进入客户列表" }).click();
  await page.getByRole("link", { name: "新建客户" }).click();
  await page.getByLabel("客户称呼 *").fill("测试客户");
  await page.getByLabel("公司/项目").fill("测试科技");
  await page.getByLabel("职位/角色").fill("创始人");
  await page.getByRole("button", { name: "创建客户" }).click();
  await expect(page.getByRole("heading", { name: "测试客户" })).toBeVisible();

  // 3. Add manual note
  await page
    .getByRole("textbox", { name: /粘贴聊天文字|填写跟进记录/ })
    .fill("客户表达了明确增长需求，希望今年营收翻倍。");
  await page.getByPlaceholder("资料标题").fill("首次聊天记录");
  await page.getByRole("button", { name: "添加资料" }).click();
  await expect(page.getByText("首次聊天记录")).toBeVisible();

  // 4. Manual label confirmation
  await page.getByLabel("客户分层").selectOption("A");
  await page.getByRole("button", { name: "保存人工标签" }).click();

  // 5. Check AI analysis panel is visible
  await expect(page.getByText("AI 客户理解")).toBeVisible();

  // 6. Navigate to AI history
  await page.getByRole("link", { name: "AI 分析记录" }).click();
  await expect(
    page.getByRole("heading", { name: "AI 分析记录" }),
  ).toBeVisible();
});
