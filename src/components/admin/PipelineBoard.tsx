"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { CalendarClock, GripVertical } from "lucide-react";
import { moveLeadAction } from "@/server/actions/admin-leads";
import { BUDGET_LABELS, PIPELINE_STAGES, PIPELINE_STAGE_LABELS, SECTOR_LABELS, type BudgetCode, type PipelineStageCode, type SectorCode } from "@/lib/constants";
import { formatCents, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { STAGE_DOT } from "./Badges";

export interface PipelineLead {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  stage: PipelineStageCode;
  budget: BudgetCode;
  sector: SectorCode;
  dealAmountCents: number | null;
  nextCallAt: string | null;
  isDemo: boolean;
  offerName: string | null;
}

export function PipelineBoard({ initial }: { initial: PipelineLead[] }) {
  const [leads, setLeads] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Sur mobile : appui long pour saisir une carte, le défilement horizontal reste possible
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const byStage = useMemo(() => {
    const map = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, [] as PipelineLead[]])) as Record<PipelineStageCode, PipelineLead[]>;
    for (const l of leads) map[l.stage].push(l);
    return map;
  }, [leads]);

  function move(id: string, stage: PipelineStageCode) {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.stage === stage) return;
    const previous = lead.stage;
    setError(null);
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));
    startTransition(async () => {
      const res = await moveLeadAction(id, stage);
      if (!res.ok) {
        setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage: previous } : l)));
        setError(res.error);
      }
    });
  }

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (e.over) move(String(e.active.id), e.over.id as PipelineStageCode);
  };
  const active = leads.find((l) => l.id === activeId);

  return (
    <>
      {error && (
        <p role="alert" className="mb-3 rounded-xl bg-danger-soft px-4 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
      <DndContext
        id="pipeline"
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
        accessibility={{
          screenReaderInstructions: { draggable: "Pour déplacer un prospect, appuyez sur Espace, utilisez les flèches puis Espace pour déposer, ou Échap pour annuler." },
          announcements: {
            onDragStart: () => "Prospect saisi.",
            onDragOver: ({ over }) => (over ? `Au-dessus de la colonne ${PIPELINE_STAGE_LABELS[over.id as PipelineStageCode]}.` : "Hors des colonnes."),
            onDragEnd: ({ over }) => (over ? `Prospect déplacé dans ${PIPELINE_STAGE_LABELS[over.id as PipelineStageCode]}.` : "Déplacement annulé."),
            onDragCancel: () => "Déplacement annulé.",
          },
        }}
      >
        <div className="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 sm:scroll-px-6 lg:scroll-px-10 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10" role="list" aria-label="Pipeline commercial">
          {PIPELINE_STAGES.map((stage) => (
            <Column key={stage} stage={stage} leads={byStage[stage]} onMove={move} />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>{active ? <CardBody lead={active} dragging /> : null}</DragOverlay>
      </DndContext>
    </>
  );
}

function Column({ stage, leads, onMove }: { stage: PipelineStageCode; leads: PipelineLead[]; onMove: (id: string, s: PipelineStageCode) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const total = leads.reduce((s, l) => s + (l.dealAmountCents ?? 0), 0);
  return (
    <section role="listitem" aria-label={PIPELINE_STAGE_LABELS[stage]} ref={setNodeRef} className={cn("flex w-[78vw] max-w-[290px] shrink-0 snap-start flex-col rounded-2xl border bg-white/60 transition-colors sm:w-72", isOver ? "border-brand bg-brand-soft/50" : "border-line")}>
      <header className="flex items-center justify-between gap-2 px-3.5 pb-2 pt-3">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold">
          <span className={cn("size-2 rounded-full", STAGE_DOT[stage])} aria-hidden />
          {PIPELINE_STAGE_LABELS[stage]}
          <span className="rounded-full bg-canvas px-1.5 text-xs font-medium text-muted">{leads.length}</span>
        </h2>
        {total > 0 && <span className="text-xs tabular-nums text-muted">{formatCents(total, { round: true })}</span>}
      </header>
      <ul className="flex min-h-24 flex-1 flex-col gap-2 p-2 pt-1">
        {leads.map((l) => (
          <DraggableCard key={l.id} lead={l} onMove={onMove} />
        ))}
        {leads.length === 0 && <li className="grid flex-1 place-items-center rounded-xl border border-dashed border-line py-6 text-xs text-muted">Déposez ici</li>}
      </ul>
    </section>
  );
}

function DraggableCard({ lead, onMove }: { lead: PipelineLead; onMove: (id: string, s: PipelineStageCode) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });
  return (
    <li ref={setNodeRef} className={cn(isDragging && "opacity-40")}>
      <CardBody lead={lead} handleProps={{ ...attributes, ...listeners }} onMove={onMove} />
    </li>
  );
}

function CardBody({ lead, dragging, handleProps, onMove }: { lead: PipelineLead; dragging?: boolean; handleProps?: Record<string, unknown>; onMove?: (id: string, s: PipelineStageCode) => void }) {
  return (
    <article className={cn("group rounded-xl border border-line bg-white p-3 shadow-soft", dragging && "rotate-2 shadow-lift")}>
      <div className="flex items-start gap-1.5">
        <button type="button" {...handleProps} className="-ml-1 mt-0.5 cursor-grab touch-none rounded p-0.5 text-muted/60 hover:text-ink active:cursor-grabbing" aria-label={`Déplacer ${lead.companyName}`}>
          <GripVertical className="size-4" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <Link href={`/admin/prospects/${lead.id}`} className="block truncate text-sm font-medium hover:text-brand">
            {lead.companyName}
          </Link>
          <p className="truncate text-xs text-muted">
            {lead.firstName} {lead.lastName} · {SECTOR_LABELS[lead.sector]}
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded-md bg-canvas px-1.5 py-0.5 text-ink-soft">{lead.dealAmountCents != null ? formatCents(lead.dealAmountCents, { round: true }) : BUDGET_LABELS[lead.budget]}</span>
        {lead.offerName && <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-brand-strong">{lead.offerName}</span>}
        {lead.nextCallAt && (
          <span className="inline-flex items-center gap-1 rounded-md bg-warning-soft px-1.5 py-0.5 text-warning">
            <CalendarClock className="size-3" aria-hidden /> {formatShortDate(lead.nextCallAt)}
          </span>
        )}
        {lead.isDemo && <span className="rounded-md bg-canvas px-1.5 py-0.5 text-muted">fictif</span>}
      </div>
      {onMove && (
        <label className="mt-2.5 block">
          <span className="sr-only">Changer le statut de {lead.companyName}</span>
          <select
            value={lead.stage}
            onChange={(e) => onMove(lead.id, e.target.value as PipelineStageCode)}
            className="w-full rounded-lg border border-line bg-canvas px-2 py-1.5 text-xs text-ink-soft focus:border-brand focus:outline-none lg:hidden lg:group-hover:block lg:group-focus-within:block"
          >
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>
                {PIPELINE_STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      )}
    </article>
  );
}
