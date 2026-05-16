import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, "../docs");
const MANUAL_PATH = resolve(DOCS_DIR, "user-manual.md");
const PDF_PATH = resolve(DOCS_DIR, "user-manual.pdf");

async function main() {
  const md = readFileSync(MANUAL_PATH, "utf-8");

  // Convert markdown to HTML, rewriting image paths to absolute file:// URLs
  const htmlBody = await marked.parse(md, {
    async: true,
    walkTokens: (token) => {
      if (token.type === "image" && token.href && !token.href.startsWith("http") && !token.href.startsWith("file:")) {
        token.href = "file://" + resolve(DOCS_DIR, token.href);
      }
    },
  });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>私域 CRM 客户知识库 - 使用手册</title>
<style>
@page { size: A4; margin: 2.5cm 2cm; }
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 11pt;
  line-height: 1.7;
  color: #1a1a1a;
  max-width: 100%;
  margin: 0;
  padding: 0;
}
h1 {
  font-size: 22pt;
  font-weight: 700;
  color: #111;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 0.3em;
  margin-top: 0;
  margin-bottom: 1em;
  page-break-after: avoid;
}
h2 {
  font-size: 15pt;
  font-weight: 600;
  color: #1e293b;
  margin-top: 1.8em;
  margin-bottom: 0.6em;
  padding-bottom: 0.2em;
  border-bottom: 1px solid #e2e8f0;
  page-break-after: avoid;
}
h3 {
  font-size: 12.5pt;
  font-weight: 600;
  color: #334155;
  margin-top: 1.4em;
  margin-bottom: 0.5em;
  page-break-after: avoid;
}
p { margin: 0.6em 0; }
ul, ol {
  margin: 0.5em 0;
  padding-left: 1.8em;
}
li { margin: 0.3em 0; }
img {
  max-width: 100%;
  height: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin: 1em 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  page-break-inside: avoid;
}
hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5em 0;
}
code {
  background: #f1f5f9;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.9em;
}
strong { font-weight: 600; color: #0f172a; }
blockquote {
  border-left: 3px solid #2563eb;
  margin: 1em 0;
  padding: 0.4em 1em;
  background: #f8fafc;
  border-radius: 0 4px 4px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 10.5pt;
}
th, td {
  border: 1px solid #cbd5e1;
  padding: 0.5em 0.7em;
  text-align: left;
}
th {
  background: #f1f5f9;
  font-weight: 600;
}
tr:nth-child(even) { background: #f8fafc; }
</style>
</head>
<body>
${htmlBody}
</body>
</html>`;

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

  // Clean up temp file
  unlinkSync(tmpHtmlPath);

  console.log("PDF generated:", PDF_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
