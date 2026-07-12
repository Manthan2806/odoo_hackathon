import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const map: Record<string, string> = {
  // Asset
  Available: "bg-success/10 text-success border-success/20",
  Assigned: "bg-info/10 text-info border-info/20",
  Reserved: "bg-warning/15 text-warning border-warning/25",
  Maintenance: "bg-warning/15 text-warning border-warning/25",
  Lost: "bg-destructive/10 text-destructive border-destructive/20",
  Retired: "bg-muted text-muted-foreground border-border",
  // Booking
  Pending: "bg-warning/15 text-warning border-warning/25",
  Confirmed: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  Completed: "bg-muted text-muted-foreground border-border",
  // Maintenance
  Reported: "bg-info/10 text-info border-info/20",
  "In Progress": "bg-warning/15 text-warning border-warning/25",
  "Waiting Parts": "bg-warning/15 text-warning border-warning/25",
  Resolved: "bg-success/10 text-success border-success/20",
  Closed: "bg-muted text-muted-foreground border-border",
  // Priority
  Low: "bg-muted text-muted-foreground border-border",
  Medium: "bg-info/10 text-info border-info/20",
  High: "bg-warning/15 text-warning border-warning/25",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  // Requests
  Approved: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Fulfilled: "bg-info/10 text-info border-info/20",
};

export function StatusChip({ status, className }: { status: string; className?: string }) {
  const cls = map[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", cls, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      {icon && <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "destructive";
}) {
  const toneMap = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className={cn("mt-2 text-2xl font-semibold tabular-nums tracking-tight", toneMap[tone])}>{value}</div>
      {delta && <div className="mt-1 text-xs text-muted-foreground">{delta}</div>}
    </div>
  );
}
