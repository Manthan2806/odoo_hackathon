import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Inbox, Calendar, Wrench, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { PageHeader, MetricCard, StatusChip } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { assets, bookings, requests, maintenanceTickets, activity, currentUser, employees } from "@/lib/mock-data";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({ component: HomePage });

const trend = Array.from({ length: 12 }, (_, i) => ({
  month: format(new Date(2025, i, 1), "MMM"),
  assigned: 40 + Math.round(Math.sin(i / 2) * 15) + i * 2,
  returned: 20 + Math.round(Math.cos(i / 2) * 8) + i,
}));

const deptData = [
  { name: "Engineering", value: 48 },
  { name: "Design", value: 22 },
  { name: "Sales", value: 31 },
  { name: "Marketing", value: 18 },
  { name: "Operations", value: 15 },
];

const pieColors = ["#3b6df6", "#22b07d", "#e6a23c", "#e5484d", "#9b5cf6"];

function HomePage() {
  const assigned = assets.filter((a) => a.status === "Assigned").length;
  const available = assets.filter((a) => a.status === "Available").length;
  const inMaint = assets.filter((a) => a.status === "Maintenance").length;
  const pending = requests.filter((r) => r.status === "Pending").length;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's happening across your organization today."
        actions={
          <>
            <Button variant="outline" size="sm">Export report</Button>
            <Button size="sm" asChild><Link to="/assets/register"><Plus className="h-4 w-4 mr-1" />Register asset</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total assets" value={assets.length} delta={`${available} available`} icon={<Package className="h-4 w-4" />} />
        <MetricCard label="Assigned" value={assigned} delta={`${Math.round((assigned / assets.length) * 100)}% utilization`} icon={<TrendingUp className="h-4 w-4" />} tone="success" />
        <MetricCard label="Pending approvals" value={pending} delta="Requires action" icon={<Inbox className="h-4 w-4" />} tone="warning" />
        <MetricCard label="In maintenance" value={inMaint} delta={`${maintenanceTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved").length} open tickets`} icon={<Wrench className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Asset activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Assignments and returns over the last year</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3b6df6]" />Assigned</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#22b07d]" />Returned</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b6df6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b6df6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22b07d" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22b07d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e4e6ec" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#8891a3", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8891a3", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="assigned" stroke="#3b6df6" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="returned" stroke="#22b07d" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">By department</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Assigned assets</p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {deptData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Pending approvals</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/inbox">View all <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {requests.filter(r => r.status === "Pending").slice(0, 5).map((r) => {
                const emp = employees.find(e => e.name === r.employee);
                return (
                  <div key={r.id} className="flex items-center gap-3 px-6 py-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={emp?.avatar} />
                      <AvatarFallback>{r.employee.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.employee} requested {r.asset}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.reason} · {r.department}</div>
                    </div>
                    <StatusChip status={r.priority} />
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs">Reject</Button>
                      <Button size="sm" className="h-7 text-xs">Approve</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Upcoming bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/bookings"><ArrowRight className="h-3 w-3" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.filter(b => new Date(b.start) > new Date()).slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-muted text-center">
                  <div className="text-[9px] font-medium uppercase text-muted-foreground">{format(new Date(b.start), "MMM")}</div>
                  <div className="text-sm font-semibold leading-none">{format(new Date(b.start), "d")}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{b.resource}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(b.start), "HH:mm")}–{format(new Date(b.end), "HH:mm")} · {b.purpose}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Recent activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {activity.slice(0, 8).map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 px-6 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-sm">
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
    </div>
  );
}
