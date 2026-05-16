import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/server/env";

export type StoredFile = {
  fileUrl: string;
  fileKey: string;
  storageBucket: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

function isProductionLike(): boolean {
  return env.ALLOW_LOCAL_UPLOADS !== "true" && process.env.NODE_ENV === "production";
}

export async function storeMaterialFile(
  customerId: string,
  file: File,
): Promise<StoredFile> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const storageKey = `${customerId}/${safeName}`;

  if (
    env.STORAGE_PROVIDER === "supabase" &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    );
    const { error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(storageKey, bytes, { contentType: file.type, upsert: false });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const { data } = supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storageKey);
    return {
      fileUrl: data.publicUrl,
      fileKey: storageKey,
      storageBucket: env.SUPABASE_STORAGE_BUCKET,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    };
  }

  if (isProductionLike()) {
    throw new Error(
      "Local file uploads are not allowed in production. Set ALLOW_LOCAL_UPLOADS=true only for development.",
    );
  }

  const directory = path.join(
    process.cwd(),
    env.LOCAL_UPLOAD_DIR,
    customerId,
  );
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, safeName);
  await writeFile(target, bytes);
  return {
    fileUrl: `/${env.LOCAL_UPLOAD_DIR}/${customerId}/${safeName}`,
    fileKey: storageKey,
    storageBucket: "local",
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
  };
}
