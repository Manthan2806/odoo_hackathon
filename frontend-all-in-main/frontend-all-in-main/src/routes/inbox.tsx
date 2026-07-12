import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatusChip, EmptyState } from "@/components/shared";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Inbox as InboxIcon, Check, X, MessageSquare, Clock, Package, FileText } from "lucide-react";
import { requests, maintenanceTickets, employees, assets } from "@/lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/inbox")({ component: InboxPage });

type Tab = "approvals" | "fulfillment" | "verification";

function InboxPage() {
  const [tab, setTab] = useState<Tab>("approvals");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pending = requests.filter((r) => r.status === "Pending");
  const fulfillment = requests.filter((r) => r.status === "Approved");
  const verification = maintenanceTickets.filter((t) => t.status === "Resolved");

  const rows: { id: string; primary: string; secondary: string; badge: string; date: string; extra?: string }[] = tab === "approvals"
    ? pending.map((r) => ({ id: r.id, primary: `${r.employee} → ${r.asset}`, secondary: `${r.department} · ${r.reason}`, badge: r.priority, date: r.submittedAt }))
    : tab === "fulfillment"
      ? fulfillment.map((r) => ({ id: r.id, primary: r.asset, secondary: `For ${r.employee} · ${r.department}`, badge: r.priority, date: r.submittedAt, extra: "Due in 2 days" }))
      : verification.map((t) => ({ id: t.id, primary: t.assetName, secondary: `${t.technician ?? "Unassigned"} · ${t.description}`, badge: t.priority, date: t.completedAt ?? t.reportedAt }));

  const filtered = useMemo(() => rows.filter((r) => !q || r.primary.toLowerCase().includes(q.toLowerCase()) || r.secondary.toLowerCase().includes(q.toLowerCase())), [rows, q]);

  const selected = filtered.find((r) => r.id === selectedId);
  const selectedRequest = requests.find(r => r.id === selectedId);
  const selectedTicket = maintenanceTickets.find(t => t.id === selectedId);
  const selectedEmp = selectedRequest ? employees.find(e => e.name === selectedRequest.employee) : null;

  const doAction = (label: string) => { toast.success(label); setSelectedId(null); };

  return (
    <div>
      <PageHeader title="Inbox" description="Actionable items assigned to you." />

      <Tabs value={tab} onValueChange={(v) => { setTab(v as Tab); setSelectedId(null); }}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <TabsList>
            <TabsTrigger value="approvals">Approvals <span className="ml-1.5 rounded-full bg-primary/10 text-primary px-1.5 text-[10px]">{pending.length}</span></TabsTrigger>
            <TabsTrigger value="fulfillment">Fulfillment <span className="ml-1.5 rounded-full bg-primary/10 text-primary px-1.5 text-[10px]">{fulfillment.length}</span></TabsTrigger>
            <TabsTrigger value="verification">Verification <span className="ml-1.5 rounded-full bg-primary/10 text-primary px-1.5 text-[10px]">{verification.length}</span></TabsTrigger>
          </TabsList>
          <div className="relative w-[280px]">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search inbox…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
          </div>
        </div>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={<InboxIcon className="h-5 w-5" />} title="Inbox zero" description="No items in this queue right now." />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted"><Package className="h-4 w-4 text-muted-foreground" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium truncate">{r.primary}</div>
                    <StatusChip status={r.badge} />
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground truncate">{r.secondary}</div>
                </div>
                {r.extra && <span className="text-xs text-warning">{r.extra}</span>}
                <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(r.date), { addSuffix: true })}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.primary}</SheetTitle>
                <div className="mt-2 flex items-center gap-2">
                  <StatusChip status={selected.badge} />
                  <span className="text-xs text-muted-foreground">{format(new Date(selected.date), "MMM d, yyyy 'at' HH:mm")}</span>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                {selectedEmp && (
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-2">Requested by</div>
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarImage src={selectedEmp.avatar} /><AvatarFallback>{selectedEmp.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm font-medium">{selectedEmp.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedEmp.jobTitle} · {selectedEmp.department}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Timeline</div>
                  <ol className="relative border-l border-border pl-5 space-y-3 text-sm">
                    <li><span className="absolute -left-[7px] h-3 w-3 rounded-full bg-primary" /><div className="font-medium">Submitted</div><div className="text-xs text-muted-foreground">{format(new Date(selected.date), "MMM d, HH:mm")}</div></li>
                    <li><span className="absolute -left-[7px] h-3 w-3 rounded-full border-2 border-border bg-background" /><div className="font-medium text-muted-foreground">Awaiting your review</div></li>
                  </ol>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Details</div>
                  <div className="text-sm text-foreground">{selected.secondary}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Comments</div>
                  <div className="rounded-lg border border-border p-3">
                    <textarea className="w-full text-sm outline-none bg-transparent resize-none" rows={2} placeholder="Add a note…" />
                    <div className="mt-2 flex justify-end"><Button size="sm" variant="outline"><MessageSquare className="h-3.5 w-3.5 mr-1.5" />Comment</Button></div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-border pt-4">
                  {tab === "approvals" && (
                    <>
                      <Button variant="outline" className="flex-1" onClick={() => doAction("Request rejected")}><X className="h-4 w-4 mr-1.5" />Reject</Button>
                      <Button className="flex-1" onClick={() => doAction("Request approved")}><Check className="h-4 w-4 mr-1.5" />Approve</Button>
                    </>
                  )}
                  {tab === "fulfillment" && (
                    <Button className="flex-1" onClick={() => doAction("Marked as fulfilled")}><Package className="h-4 w-4 mr-1.5" />Mark fulfilled</Button>
                  )}
                  {tab === "verification" && (
                    <>
                      <Button variant="outline" className="flex-1" onClick={() => doAction("Sent back for rework")}><Clock className="h-4 w-4 mr-1.5" />Reopen</Button>
                      <Button className="flex-1" onClick={() => doAction("Verification complete")}><Check className="h-4 w-4 mr-1.5" />Verify</Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
