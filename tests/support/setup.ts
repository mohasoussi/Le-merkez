import { afterAll, beforeEach } from "vitest";
import { resetDatabase } from "./db";
import { db } from "@/server/db";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await db.$disconnect();
});
