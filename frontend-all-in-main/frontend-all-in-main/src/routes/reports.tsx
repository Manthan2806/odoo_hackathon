import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MetricCard } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Package, Wrench, TrendingUp, Users } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Line, LineChart, Cell,
} from "recharts";
import { assets, maintenanceTickets, employees, activity } from "@/lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const monthly = Array.from({ length: 12 }, (_, i) => ({
  month: format(new Date(2025, i, 1), "MMM"),
  registrations: 8 + Math.round(Math.random() * 12),
  retirements: 2 + Math.round(Math.random() * 4),
  maintenance: 3 + Math.round(Math.random() * 8),
}));

const deptUtil = ["Engineering", "Design", "Marketing", "Sales", "Finance", "Operations"].map((d) => {
  const total = assets.filter((a) => a.department === d).length || 5;
  const inUse = assets.filter((a) => a.department === d && a.status === "Assigned").length;
  return { dept: d, total, inUse, utilization: Math.round((inUse / total) * 100) };
});

function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Insight into asset utilization, maintenance trends, and compliance."
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Export</Button>}
      />

      <Tabs defaultValue="utilization">
        <TabsList>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Assets tracked" value={assets.length} icon={<Package className="h-4 w-4" />} />
            <MetricCard label="Utilization" value={`${Math.round((assets.filter(a => a.status === "Assigned").length / assets.length) * 100)}%`} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
            <MetricCard label="Open tickets" value={maintenanceTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved").length} tone="warning" icon={<Wrench className="h-4 w-4" />} />
            <MetricCard label="People" value={employees.length} icon={<Users className="h-4 w-4" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Asset registrations vs retirements</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e4e6ec" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#8891a3", fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8891a3", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="registrations" fill="#3b6df6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="retirements" fill="#e5484d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Maintenance trend</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e4e6ec" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#8891a3", fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8891a3", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="maintenance" stroke="#e6a23c" strokeWidth={2} dot={{ fill: "#e6a23c", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Utilization by department</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deptUtil.map((d) => (
                  <div key={d.dept} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{d.dept}</span>
                      <span className="text-muted-foreground tabular-nums">{d.inUse}/{d.total} · {d.utilization}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${d.utilization}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Compliance score" value="94%" tone="success" />
            <MetricCard label="Audit events (30d)" value="1,284" />
            <MetricCard label="Alerts open" value={3} tone="warning" />
            <MetricCard label="Last audit" value="2 days ago" />
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Audit log</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {activity.map((ev) => (
                  <div key={ev.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-2.5 text-sm">
                    <span className="font-mono text-xs text-muted-foreground w-16">{ev.type.toUpperCase()}</span>
                    <div className="min-w-0">
                      <span className="font-medium">{ev.actor}</span>{" "}
                      <span className="text-muted-foreground">{ev.description}</span>{" "}
                      <span className="font-medium">{ev.target}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ev.timestamp), { addSuffix: true })}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
