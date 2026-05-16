import type { CustomerMaterial } from "@prisma/client";

function OcrStatusBadge({
  material,
}: {
  material: CustomerMaterial;
}) {
  if (material.type !== "screenshot") return null;

  switch (material.ocrStatus) {
    case "pending":
    case "running":
      return (
        <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
          OCR 识别中…
        </span>
      );
    case "failed":
      return (
        <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
          OCR 失败：{material.ocrError}
        </span>
      );
    case "succeeded":
      return (
        <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
          已识别文字
        </span>
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
  if (materials.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-crm-line bg-white p-6 text-crm-muted">
        还没有资料，请先添加聊天文字、截图或手动记录。
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {materials.map((material) => (
        <li
          key={material.id}
          className="rounded-2xl border border-crm-line bg-white p-4"
        >
          <div className="flex items-center justify-between text-sm text-crm-muted">
            <div className="flex items-center gap-2">
              <span>{material.type}</span>
              <OcrStatusBadge material={material} />
            </div>
            <time>{material.createdAt.toLocaleString("zh-CN")}</time>
          </div>
          <h3 className="mt-2 font-semibold">{material.title}</h3>
          {material.contentText ? (
            <p className="mt-2 whitespace-pre-wrap text-sm">
              {material.contentText}
            </p>
          ) : null}
          {material.extractedText ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-crm-primary">
                查看 OCR 识别文字
              </summary>
              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-crm-surface p-3 text-sm">
                {material.extractedText}
              </p>
            </details>
          ) : null}
          {material.fileUrl ? (
            <a
              className="mt-2 block text-sm text-crm-primary"
              href={material.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看文件：{material.fileName}
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
