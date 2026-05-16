import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, "../docs");
const MANUAL_PATH = resolve(DOCS_DIR, "user-manual.md");
const HTML_PATH = resolve(DOCS_DIR, "user-manual.html");
const PDF_PATH = resolve(DOCS_DIR, "user-manual.pdf");

function buildStyles(): string {
  return `
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 15px;
  line-height: 1.75;
  color: #1a1a1a;
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 32px;
  background: #fff;
}
h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111;
  border-bottom: 3px solid #2563eb;
  padding-bottom: 12px;
  margin-top: 0;
  margin-bottom: 32px;
}
h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin-top: 48px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}
h3 {
  font-size: 17px;
  font-weight: 600;
  color: #334155;
  margin-top: 28px;
  margin-bottom: 12px;
}
p { margin: 12px 0; }
ul, ol {
  margin: 12px 0;
  padding-left: 28px;
}
li { margin: 6px 0; }
img {
  max-width: 100%;
  height: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 32px 0;
}
code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.9em;
}
strong { font-weight: 600; color: #0f172a; }
blockquote {
  border-left: 4px solid #2563eb;
  margin: 16px 0;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 0 6px 6px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}
th, td {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  text-align: left;
}
th {
  background: #f1f5f9;
  font-weight: 600;
}
tr:nth-child(even) { background: #f8fafc; }
@media print {
  body { padding: 0; }
  h1, h2, h3 { page-break-after: avoid; }
  img { page-break-inside: avoid; }
}
`;
}

async function markdownToHtml(mdPath: string, forPdf = false): Promise<string> {
  const md = readFileSync(mdPath, "utf-8");

  const htmlBody = await marked.parse(md, {
    async: true,
    walkTokens: (token) => {
      if (token.type === "image" && token.href && !token.href.startsWith("http") && !token.href.startsWith("file:")) {
        if (forPdf) {
          token.href = "file://" + resolve(DOCS_DIR, token.href);
        }
        // For HTML, keep relative paths as-is
      }
    },
  });

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>私域 CRM 客户知识库 - 使用手册</title>
<style>${buildStyles()}</style>
</head>
<body>
${htmlBody}
</body>
</html>`;
}

async function generateHtml() {
  const html = await markdownToHtml(MANUAL_PATH, false);
  writeFileSync(HTML_PATH, html);
  console.log("HTML generated:", HTML_PATH);
}

async function generatePdf() {
  const html = await markdownToHtml(MANUAL_PATH, true);
  const tmpHtmlPath = resolve(DOCS_DIR, ".manual-tmp.html");
  writeFileSync(tmpHtmlPath, html);

  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("file://" + tmpHtmlPath, { waitUntil: "networkidle" });

  await page.pdf({
    path: PDF_PATH,
    format: "A4",
    printBackground: true,
    margin: { top: "2.5cm", bottom: "2.5cm", left: "2cm", right: "2cm" },
  });

  await browser.close();
  unlinkSync(tmpHtmlPath);
  console.log("PDF generated:", PDF_PATH);
}

async function main() {
  await generateHtml();
  await generatePdf();
  console.log("\nAll done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
