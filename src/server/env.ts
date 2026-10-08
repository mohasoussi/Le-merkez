import "server-only";
import { z } from "zod";

const bool = z
  .enum(["true", "false", "1", "0", ""])
  .optional()
  .transform((v) => v === "true" || v === "1");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url().default("http://localhost:3000"),
  APP_SECRET: z.string().min(32, "APP_SECRET doit contenir au moins 32 caractères"),
  TRUST_PROXY: bool,
  DATABASE_URL: z.string().min(1),

  EMAIL_DRIVER: z.enum(["console", "smtp"]).default("console"),
  EMAIL_FROM: z.string().default("Studio Web <contact@example.com>"),
  ADMIN_NOTIFICATION_EMAIL: z.string().optional().default(""),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_SECURE: bool,
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
  STORAGE_LOCAL_DIR: z.string().default("./storage"),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  UPLOAD_MAX_MB: z.coerce.number().positive().max(100).default(15),

  TURNSTILE_SITE_KEY: z.string().optional().default(""),
  TURNSTILE_SECRET_KEY: z.string().optional().default(""),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

/** Variables d'environnement validées. Lève une erreur explicite au premier accès si la config est invalide. */
export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Configuration invalide (variables d'environnement) :\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

export const isProduction = () => process.env.NODE_ENV === "production";
