import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatusChip, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Wrench } from "lucide-react";
import { maintenanceTickets, employees, assets, type MaintenanceTicket } from "@/lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/maintenance")({ component: MaintenancePage });

function MaintenancePage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<MaintenanceTicket | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [tab, setTab] = useState<"active" | "history">("active");

  const active = maintenanceTickets.filter((t) => t.status !== "Closed" && t.status !== "Resolved");
  const history = maintenanceTickets.filter((t) => t.status === "Closed" || t.status === "Resolved");
  const list = tab === "active" ? active : history;

  const filtered = useMemo(() => list.filter((t) => {
    if (status !== "all" && t.status !== status) return false;
    if (q && !t.assetName.toLowerCase().includes(q.toLowerCase()) && !t.description.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [list, q, status]);

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description={`${active.length} active tickets · ${history.length} resolved`}
        actions={<Button size="sm" onClick={() => setReportOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Report issue</Button>}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "active" | "history")}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <TabsList>
            <TabsTrigger value="active">Active <span className="ml-1.5 rounded-full bg-primary/10 text-primary px-1.5 text-[10px]">{active.length}</span></TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative w-[240px]">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["Reported", "Assigned", "In Progress", "Waiting Parts", "Resolved", "Closed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={tab}>
          {filtered.length === 0 ? (
            <EmptyState icon={<Wrench className="h-5 w-5" />} title="No tickets" description="Nothing to see here yet." />
          ) : (
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {filtered.map((t) => {
                const tech = employees.find((e) => e.name === t.technician);
                return (
                  <button key={t.id} onClick={() => setSelected(t)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted"><Wrench className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{t.ticket}</span>
                        <span className="text-sm font-medium truncate">{t.assetName}</span>
                        <StatusChip status={t.priority} />
                        <StatusChip status={t.status} />
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground truncate">{t.description} · Reported by {t.reportedBy}</div>
                    </div>
                    {tech && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-6 w-6"><AvatarImage src={tech.avatar} /><AvatarFallback>{tech.name[0]}</AvatarFallback></Avatar>
                        <span className="text-xs">{tech.name.split(" ")[0]}</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(t.reportedAt), { addSuffix: true })}</div>
                  </button>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="font-mono text-xs text-muted-foreground">{selected.ticket}</div>
                <SheetTitle className="mt-1">{selected.assetName}</SheetTitle>
                <div className="mt-2 flex gap-2"><StatusChip status={selected.status} /><StatusChip status={selected.priority} /></div>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div><div className="text-xs text-muted-foreground">Description</div><div className="mt-1">{selected.description}</div></div>
                <div><div className="text-xs text-muted-foreground">Reported by</div><div className="mt-1">{selected.reportedBy}</div></div>
                <div><div className="text-xs text-muted-foreground">Technician</div><div className="mt-1">{selected.technician ?? "Unassigned"}</div></div>
                <div><div className="text-xs text-muted-foreground">Reported</div><div className="mt-1">{format(new Date(selected.reportedAt), "MMM d, yyyy 'at' HH:mm")}</div></div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">Update status</Button>
                  <Button size="sm" className="flex-1" onClick={() => { toast.success("Ticket resolved"); setSelected(null); }}>Mark resolved</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report maintenance issue</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Asset</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
                <SelectContent>{assets.slice(0, 15).map((a) => <SelectItem key={a.id} value={a.id}>{a.name} ({a.tag})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select defaultValue="Medium"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Low", "Medium", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Describe the issue</Label>
              <Textarea placeholder="What's wrong with it?" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Ticket created"); setReportOpen(false); }}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
