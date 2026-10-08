import "server-only";
import { db } from "@/server/db";
import type { ActivityType, Prisma } from "@/generated/prisma/client";

type Tx = Prisma.TransactionClient | typeof db;

export function logActivity(
  tx: Tx,
  data: {
    type: ActivityType;
    message: string;
    actorId?: string | null;
    leadId?: string | null;
    clientId?: string | null;
    projectId?: string | null;
    metadata?: Prisma.InputJsonValue;
  },
) {
  return tx.activity.create({ data });
}
