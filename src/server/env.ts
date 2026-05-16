import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5.4-mini"),
  STORAGE_PROVIDER: z.enum(["supabase", "s3", "r2", "local"]).default("local"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("crm-materials"),
  LOCAL_UPLOAD_DIR: z.string().default(".data/uploads"),
  ALLOW_LOCAL_UPLOADS: z.enum(["true", "false"]).default("false"),
  APP_ACCESS_PASSWORD: z.string().optional(),
  APP_SESSION_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
