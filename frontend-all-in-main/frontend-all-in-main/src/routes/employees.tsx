import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, EmptyState } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Users, Mail, MapPin, Briefcase, Calendar, Package } from "lucide-react";
import { employees, assets, type Employee } from "@/lib/mock-data";
import { format } from "date-fns";

export const Route = createFileRoute("/employees")({ component: EmployeesPage });

function EmployeesPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState<Employee | null>(null);

  const depts = Array.from(new Set(employees.map((e) => e.department)));
  const roles = Array.from(new Set(employees.map((e) => e.role)));

  const filtered = useMemo(() => employees.filter((e) => {
    if (dept !== "all" && e.department !== dept) return false;
    if (role !== "all" && e.role !== role) return false;
    if (q && !e.name.toLowerCase().includes(q.toLowerCase()) && !e.email.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, dept, role]);

  return (
    <div>
      <PageHeader title="Employees" description={`${employees.length} people across ${depts.length} departments`} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
        </div>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {depts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-5 w-5" />} title="No employees found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((e) => {
            const assigned = assets.filter((a) => a.assignedTo === e.name).length;
            return (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
              >
                <Avatar className="h-11 w-11"><AvatarImage src={e.avatar} /><AvatarFallback>{e.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.jobTitle}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="secondary" className="font-normal text-[10px]">{e.department}</Badge>
                    <span className="text-[10px] text-muted-foreground">· {assigned} assets</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16"><AvatarImage src={selected.avatar} /><AvatarFallback>{selected.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <SheetTitle>{selected.name}</SheetTitle>
                    <div className="mt-1 text-sm text-muted-foreground">{selected.jobTitle}</div>
                    <Badge variant="secondary" className="mt-2 font-normal">{selected.role}</Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-3">
                <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={selected.email} />
                <InfoRow icon={<Briefcase className="h-3.5 w-3.5" />} label="Department" value={selected.department} />
                <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={selected.location} />
                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Joined" value={format(new Date(selected.startDate), "MMM d, yyyy")} />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned assets</div>
                </div>
                <div className="space-y-1.5">
                  {assets.filter(a => a.assignedTo === selected.name).slice(0, 6).map((a) => (
                    <div key={a.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{a.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{a.tag}</div>
                      </div>
                    </div>
                  ))}
                  {assets.filter(a => a.assignedTo === selected.name).length === 0 && (
                    <div className="text-xs text-muted-foreground">No assets assigned.</div>
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
