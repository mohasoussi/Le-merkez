import "server-only";

type Level = "debug" | "info" | "warn" | "error";

function serializeError(err: unknown) {
  if (err instanceof Error) return { name: err.name, message: err.message, stack: err.stack };
  return err;
}

function write(level: Level, message: string, context?: Record<string, unknown>) {
  if (level === "debug" && process.env.NODE_ENV === "production") return;
  if (process.env.NODE_ENV === "test" && level !== "error") return;
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...(context
      ? Object.fromEntries(Object.entries(context).map(([k, v]) => [k, k === "error" ? serializeError(v) : v]))
      : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Journal structuré (JSON sur stdout) : lisible par tous les hébergeurs. Ne jamais y mettre de mot de passe ni de jeton. */
export const logger = {
  debug: (m: string, c?: Record<string, unknown>) => write("debug", m, c),
  info: (m: string, c?: Record<string, unknown>) => write("info", m, c),
  warn: (m: string, c?: Record<string, unknown>) => write("warn", m, c),
  error: (m: string, c?: Record<string, unknown>) => write("error", m, c),
};
