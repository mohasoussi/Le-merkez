import { Badge, type Tone } from "@/components/ui/Badge";
import { PIPELINE_STAGE_LABELS, PROJECT_STATUS_LABELS, QUOTE_STATUS_LABELS, type PipelineStageCode, type ProjectStatusCode, type QuoteStatusCode } from "@/lib/constants";

const STAGE_TONES: Record<PipelineStageCode, Tone> = {
  NEW: "brand",
  TO_QUALIFY: "info",
  CALL_SCHEDULED: "warning",
  CALL_DONE: "warning",
  QUOTE_SENT: "warning",
  NEGOTIATION: "warning",
  DEPOSIT_RECEIVED: "success",
  IN_PRODUCTION: "success",
  CLIENT_REVIEW: "success",
  COMPLETED: "neutral",
  MAINTENANCE: "neutral",
  LOST: "danger",
};

export const STAGE_DOT: Record<PipelineStageCode, string> = {
  NEW: "bg-brand",
  TO_QUALIFY: "bg-sky-500",
  CALL_SCHEDULED: "bg-amber-500",
  CALL_DONE: "bg-amber-500",
  QUOTE_SENT: "bg-orange-500",
  NEGOTIATION: "bg-orange-500",
  DEPOSIT_RECEIVED: "bg-emerald-500",
  IN_PRODUCTION: "bg-emerald-500",
  CLIENT_REVIEW: "bg-emerald-600",
  COMPLETED: "bg-zinc-400",
  MAINTENANCE: "bg-zinc-500",
  LOST: "bg-red-500",
};

export function StageBadge({ stage }: { stage: PipelineStageCode }) {
  return <Badge tone={STAGE_TONES[stage]}>{PIPELINE_STAGE_LABELS[stage]}</Badge>;
}

const PROJECT_TONES: Record<ProjectStatusCode, Tone> = { BRIEF: "info", DESIGN: "brand", DEVELOPMENT: "brand", REVISION: "warning", VALIDATION: "warning", LAUNCH: "success", DONE: "neutral" };

export function ProjectStatusBadge({ status }: { status: ProjectStatusCode }) {
  return <Badge tone={PROJECT_TONES[status]}>{PROJECT_STATUS_LABELS[status]}</Badge>;
}

const QUOTE_TONES: Record<QuoteStatusCode, Tone> = { DRAFT: "neutral", SENT: "warning", ACCEPTED: "success", REFUSED: "danger", EXPIRED: "neutral" };

export function QuoteStatusBadge({ status }: { status: QuoteStatusCode }) {
  return <Badge tone={QUOTE_TONES[status]}>{QUOTE_STATUS_LABELS[status]}</Badge>;
}
