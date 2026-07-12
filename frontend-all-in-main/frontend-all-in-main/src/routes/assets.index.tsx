import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatusChip, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, ArrowUpDown, MoreHorizontal, Package, QrCode, FileText, Wrench, ClipboardList, Calendar } from "lucide-react";
import { assets, employees, maintenanceTickets, type Asset } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/assets/")({ component: AssetsPage });

function AssetsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof Asset>("tag");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [drawerAsset, setDrawerAsset] = useState<Asset | null>(null);
  const pageSize = 12;

  const filtered = useMemo(() => {
    return assets
      .filter((a) => {
        if (status !== "all" && a.status !== status) return false;
        if (category !== "all" && a.category !== category) return false;
        if (q) {
          const s = q.toLowerCase();
          return a.name.toLowerCase().includes(s) || a.tag.toLowerCase().includes(s) || a.assignedTo?.toLowerCase().includes(s) || a.serialNumber.toLowerCase().includes(s);
        }
        return true;
      })
      .sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [q, status, category, sortKey, sortDir]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const toggleSort = (k: keyof Asset) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };
  const toggleSelect = (id: string) => {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (paged.every((a) => selected.has(a.id))) {
      setSelected((s) => { const n = new Set(s); paged.forEach((a) => n.delete(a.id)); return n; });
    } else {
      setSelected((s) => { const n = new Set(s); paged.forEach((a) => n.add(a.id)); return n; });
    }
  };

  const categories = Array.from(new Set(assets.map((a) => a.category)));
  const statuses = ["Available", "Assigned", "Reserved", "Maintenance", "Lost", "Retired"];

  return (
    <div>
      <PageHeader
        title="Assets"
        description={`${assets.length} assets across ${categories.length} categories`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Export</Button>
            <Button size="sm" asChild><Link to="/assets/register"><Plus className="h-4 w-4 mr-1.5" />Register asset</Link></Button>
          </>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, tag, serial…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
            <span className="text-muted-foreground">{selected.size} selected</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs">Assign</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">Move</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">Export</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">Retire</Button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-5 w-5" />}
          title="No assets match your filters"
          description="Try adjusting your search or clearing filters."
          action={<Button size="sm" onClick={() => { setQ(""); setStatus("all"); setCategory("all"); }}>Clear filters</Button>}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 w-9">
                    <Checkbox checked={paged.length > 0 && paged.every((a) => selected.has(a.id))} onCheckedChange={toggleAll} />
                  </th>
                  {[
                    ["tag", "Tag"], ["name", "Asset"], ["category", "Category"], ["status", "Status"],
                    ["assignedTo", "Assigned to"], ["department", "Department"], ["location", "Location"],
                    ["warrantyUntil", "Warranty"],
                  ].map(([key, label]) => (
                    <th key={key} className="px-3 py-2.5 text-left font-medium">
                      <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort(key as keyof Asset)}>
                        {label}<ArrowUpDown className="h-3 w-3 opacity-40" />
                      </button>
                    </th>
                  ))}
                  <th className="px-3 py-2.5 w-9"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((a) => {
                  const emp = employees.find((e) => e.name === a.assignedTo);
                  return (
                    <tr
                      key={a.id}
                      className="border-t border-border hover:bg-accent/40 cursor-pointer"
                      onClick={() => setDrawerAsset(a)}
                    >
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(a.id)} onCheckedChange={() => toggleSelect(a.id)} />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{a.tag}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted"><Package className="h-3.5 w-3.5 text-muted-foreground" /></div>
                          <div className="font-medium">{a.name}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5"><Badge variant="secondary" className="font-normal">{a.category}</Badge></td>
                      <td className="px-3 py-2.5"><StatusChip status={a.status} /></td>
                      <td className="px-3 py-2.5">
                        {emp ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarImage src={emp.avatar} /><AvatarFallback>{emp.name[0]}</AvatarFallback></Avatar>
                            <span className="text-xs">{emp.name}</span>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{a.department}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{a.location}</td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">{format(new Date(a.warrantyUntil), "MMM d, yyyy")}</td>
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs">
            <div className="text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="px-2 tabular-nums">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" className="h-7" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}

      <AssetDrawer asset={drawerAsset} onClose={() => setDrawerAsset(null)} />
    </div>
  );
}

function AssetDrawer({ asset, onClose }: { asset: Asset | null; onClose: () => void }) {
  if (!asset) return null;
  const emp = employees.find((e) => e.name === asset.assignedTo);
  const tickets = maintenanceTickets.filter((t) => t.assetId === asset.id);

  return (
    <Sheet open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-muted-foreground">{asset.tag}</div>
              <SheetTitle className="mt-1 text-xl">{asset.name}</SheetTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">{asset.category}</Badge>
                <StatusChip status={asset.status} />
              </div>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-muted">
              <QrCode className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="px-6">
          <TabsList className="mt-4 w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-4">
            {["overview", "history", "maintenance", "warranty", "documents", "activity"].map((v) => (
              <TabsTrigger
                key={v}
                value={v}
                className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-1 text-sm capitalize data-[state=active]:border-primary data-[state=active]:shadow-none"
              >{v}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="pt-4 pb-8 space-y-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Field label="Serial number" value={asset.serialNumber} mono />
              <Field label="Vendor" value={asset.vendor} />
              <Field label="Purchase date" value={format(new Date(asset.purchaseDate), "MMM d, yyyy")} />
              <Field label="Warranty until" value={format(new Date(asset.warrantyUntil), "MMM d, yyyy")} />
              <Field label="Value" value={`$${asset.value.toLocaleString()}`} />
              <Field label="Location" value={asset.location} />
              <Field label="Department" value={asset.department ?? "—"} />
            </dl>

            {emp && (
              <div className="rounded-lg border border-border p-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">Assigned to</div>
                <div className="flex items-center gap-3">
                  <Avatar><AvatarImage src={emp.avatar} /><AvatarFallback>{emp.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <div className="text-sm font-medium">{emp.name}</div>
                    <div className="text-xs text-muted-foreground">{emp.jobTitle} · {emp.department}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">Reassign</Button>
              <Button size="sm" variant="outline" className="flex-1"><Wrench className="h-3.5 w-3.5 mr-1.5" />Report issue</Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4 pb-8">
            <Timeline
              events={[
                { icon: <Package className="h-3.5 w-3.5" />, label: "Registered", date: asset.purchaseDate, meta: `by ${asset.vendor}` },
                ...(emp ? [{ icon: <ClipboardList className="h-3.5 w-3.5" />, label: `Assigned to ${emp.name}`, date: asset.purchaseDate, meta: emp.department }] : []),
                { icon: <Wrench className="h-3.5 w-3.5" />, label: "Preventive maintenance completed", date: new Date(Date.now() - 30 * 864e5).toISOString(), meta: "By tech team" },
                { icon: <Calendar className="h-3.5 w-3.5" />, label: "Last inventory check", date: new Date(Date.now() - 7 * 864e5).toISOString(), meta: "Passed" },
              ]}
            />
          </TabsContent>

          <TabsContent value="maintenance" className="pt-4 pb-8">
            {tickets.length === 0 ? (
              <EmptyState icon={<Wrench className="h-5 w-5" />} title="No maintenance history" description="This asset has no reported issues." />
            ) : (
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div key={t.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{t.ticket}</div>
                      <StatusChip status={t.status} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{t.description}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="warranty" className="pt-4 pb-8">
            <div className="rounded-lg border border-border p-4">
              <div className="text-sm font-medium">Warranty active until {format(new Date(asset.warrantyUntil), "MMMM d, yyyy")}</div>
              <div className="mt-2 text-xs text-muted-foreground">Provider: {asset.vendor} · Coverage: standard hardware defects and manufacturing issues.</div>
              <Button variant="outline" size="sm" className="mt-3"><FileText className="h-3.5 w-3.5 mr-1.5" />View warranty document</Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="pt-4 pb-8">
            <EmptyState icon={<FileText className="h-5 w-5" />} title="No documents attached" description="Upload receipts, warranty cards, or handover forms." action={<Button size="sm">Upload file</Button>} />
          </TabsContent>

          <TabsContent value="activity" className="pt-4 pb-8">
            <Timeline
              events={[
                { icon: <ClipboardList className="h-3.5 w-3.5" />, label: "Status changed to " + asset.status, date: new Date(Date.now() - 2 * 864e5).toISOString(), meta: "System" },
                { icon: <Package className="h-3.5 w-3.5" />, label: "Location updated", date: new Date(Date.now() - 12 * 864e5).toISOString(), meta: asset.location },
                { icon: <Wrench className="h-3.5 w-3.5" />, label: "Inspected", date: new Date(Date.now() - 25 * 864e5).toISOString(), meta: "Passed" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={"mt-0.5 " + (mono ? "font-mono text-xs" : "")}>{value}</dd>
    </div>
  );
}

function Timeline({ events }: { events: { icon: React.ReactNode; label: string; date: string; meta: string }[] }) {
  return (
    <ol className="relative border-l border-border pl-6">
      {events.map((e, i) => (
        <li key={i} className="mb-4 last:mb-0">
          <span className="absolute -left-[11px] flex h-[22px] w-[22px] items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
            {e.icon}
          </span>
          <div className="text-sm font-medium">{e.label}</div>
          <div className="text-xs text-muted-foreground">{format(new Date(e.date), "MMM d, yyyy")} · {e.meta}</div>
        </li>
      ))}
    </ol>
  );
}
