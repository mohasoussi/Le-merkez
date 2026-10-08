import { describe, expect, it } from "vitest";
import * as P from "@/generated/prisma/enums";
import * as C from "@/lib/constants";

// Les libellés (src/lib/constants.ts) doivent couvrir exactement les enums du schéma Prisma.
describe("cohérence constantes ↔ schéma", () => {
  const pairs: [string, readonly string[], Record<string, string>][] = [
    ["PipelineStage", C.PIPELINE_STAGES, P.PipelineStage],
    ["LeadSource", C.LEAD_SOURCES, P.LeadSource],
    ["ProjectType", C.PROJECT_TYPES, P.ProjectType],
    ["Sector", C.SECTORS, P.Sector],
    ["BudgetRange", C.BUDGETS, P.BudgetRange],
    ["Timeline", C.TIMELINES, P.Timeline],
    ["ProjectStatus", C.PROJECT_STATUSES, P.ProjectStatus],
    ["FileCategory", C.FILE_CATEGORIES, P.FileCategory],
    ["QuoteStatus", C.QUOTE_STATUSES, P.QuoteStatus],
    ["PaymentKind", C.PAYMENT_KINDS, P.PaymentKind],
    ["PaymentMethod", C.PAYMENT_METHODS, P.PaymentMethod],
    ["SubscriptionStatus", C.SUBSCRIPTION_STATUSES, P.SubscriptionStatus],
  ];
  it.each(pairs)("%s", (_name, local, prisma) => {
    expect([...local].sort()).toEqual(Object.values(prisma).sort());
  });

  it("la timeline client suit le statut", () => {
    const t = C.clientTimeline({ status: "DEVELOPMENT", briefSubmitted: true, contentReceived: true });
    expect(t.map((s) => s.state)).toEqual(["done", "done", "done", "current", "upcoming", "upcoming"]);
    expect(C.projectProgress({ status: "DEVELOPMENT", progressOverride: null })).toBe(55);
    expect(C.projectProgress({ status: "DEVELOPMENT", progressOverride: 35 })).toBe(35);
  });
});
