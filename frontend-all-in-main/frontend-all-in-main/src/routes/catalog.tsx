import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Package, LayoutGrid } from "lucide-react";
import { catalogItems, type CatalogItem } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/catalog")({ component: CatalogPage });

function CatalogPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [avail, setAvail] = useState("all");
  const [request, setRequest] = useState<CatalogItem | null>(null);

  const categories = Array.from(new Set(catalogItems.map((c) => c.category)));

  const filtered = useMemo(() => catalogItems.filter((c) => {
    if (cat !== "all" && c.category !== cat) return false;
    if (avail === "in" && c.availability === 0) return false;
    if (avail === "out" && c.availability > 0) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase()) && !c.description.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, cat, avail]);

  return (
    <div>
      <PageHeader title="Catalog" description="Browse and request assets from your internal marketplace." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search catalog…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={avail} onValueChange={setAvail}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any availability</SelectItem>
            <SelectItem value="in">In stock</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<LayoutGrid className="h-5 w-5" />} title="Nothing matches" description="Try broadening your search or filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const ratio = item.availability / item.total;
            const availTone = item.availability === 0 ? "text-destructive" : ratio < 0.3 ? "text-warning" : "text-success";
            return (
              <div key={item.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-muted/40 to-muted">
                  <Package className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{item.category}</div>
                      <div className="mt-0.5 text-sm font-semibold leading-tight">{item.name}</div>
                    </div>
                    <span className={`text-xs font-medium ${availTone}`}>{item.availability}/{item.total}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.map((t) => <Badge key={t} variant="secondary" className="font-normal text-[10px]">{t}</Badge>)}
                  </div>
                  <Button size="sm" className="mt-3" disabled={item.availability === 0} onClick={() => setRequest(item)}>
                    {item.availability === 0 ? "Unavailable" : "Request"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!request} onOpenChange={(o) => !o && setRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request {request?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Textarea placeholder="Why do you need this asset?" />
            </div>
            <div className="space-y-1.5">
              <Label>Urgency</Label>
              <Select defaultValue="medium">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
              <div className="font-medium mb-1">Estimated approval path</div>
              <div className="text-muted-foreground">Department Manager → Asset Manager → Fulfillment</div>
              <div className="mt-1 text-muted-foreground">Typical turnaround: 1–2 business days</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequest(null)}>Cancel</Button>
            <Button onClick={() => { toast.success("Request submitted"); setRequest(null); }}>Submit request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
