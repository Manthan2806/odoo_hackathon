import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatusChip } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { bookings, currentUser, type Booking } from "@/lib/mock-data";
import { addDays, addMonths, addWeeks, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({ component: BookingsPage });

function BookingsPage() {
  const [view, setView] = useState<"week" | "month">("week");
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Reserve rooms, equipment, and vehicles."
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New booking</Button>}
      />

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="mine">My bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCursor((c) => view === "week" ? addWeeks(c, -1) : addMonths(c, -1))}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCursor((c) => view === "week" ? addWeeks(c, 1) : addMonths(c, 1))}><ChevronRight className="h-4 w-4" /></Button>
              <div className="text-sm font-medium">{format(cursor, view === "week" ? "'Week of' MMM d, yyyy" : "MMMM yyyy")}</div>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => setCursor(new Date())}>Today</Button>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as "week" | "month")}>
              <TabsList className="h-8">
                <TabsTrigger value="week" className="h-6 text-xs">Week</TabsTrigger>
                <TabsTrigger value="month" className="h-6 text-xs">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {view === "week" ? <WeekView cursor={cursor} onSelect={setSelected} /> : <MonthView cursor={cursor} onSelect={setSelected} />}
        </TabsContent>

        <TabsContent value="mine" className="mt-4">
          <MyBookings onSelect={setSelected} />
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.resource}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2"><StatusChip status={selected.status} /><span className="text-xs text-muted-foreground">{selected.resourceType}</span></div>
                <div className="space-y-1 text-sm">
                  <div className="text-xs text-muted-foreground">When</div>
                  <div>{format(new Date(selected.start), "EEEE, MMM d")}</div>
                  <div className="text-muted-foreground">{format(new Date(selected.start), "HH:mm")} – {format(new Date(selected.end), "HH:mm")}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-xs text-muted-foreground">Booked by</div>
                  <div>{selected.bookedBy}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-xs text-muted-foreground">Purpose</div>
                  <div>{selected.purpose}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">Cancel booking</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function WeekView({ cursor, onSelect }: { cursor: Date; onSelect: (b: Booking) => void }) {
  const start = startOfWeek(cursor, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-border">
            <div />
            {days.map((d) => (
              <div key={d.toISOString()} className="border-l border-border px-2 py-2 text-center">
                <div className="text-[10px] font-medium uppercase text-muted-foreground">{format(d, "EEE")}</div>
                <div className={cn("text-lg font-semibold", isSameDay(d, new Date()) && "text-primary")}>{format(d, "d")}</div>
              </div>
            ))}
          </div>
          {hours.map((h) => (
            <div key={h} className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-border">
              <div className="px-2 py-3 text-right text-[10px] text-muted-foreground">{h.toString().padStart(2, "0")}:00</div>
              {days.map((d) => {
                const cellStart = new Date(d); cellStart.setHours(h, 0, 0, 0);
                const bs = bookings.filter((b) => {
                  const bd = new Date(b.start);
                  return isSameDay(bd, d) && bd.getHours() === h;
                });
                return (
                  <div key={d.toISOString() + h} className="relative border-l border-border h-14">
                    {bs.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => onSelect(b)}
                        className="absolute inset-x-1 top-1 rounded bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 text-[10px] font-medium text-left truncate hover:bg-primary/25"
                      >
                        {b.resource}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MonthView({ cursor, onSelect }: { cursor: Date; onSelect: (b: Booking) => void }) {
  const startMonth = startOfMonth(cursor);
  const gridStart = startOfWeek(startMonth, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b border-border text-[10px] uppercase text-muted-foreground">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="px-2 py-2 text-center font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const dayBookings = bookings.filter((b) => isSameDay(new Date(b.start), d));
            const isCurrent = d.getMonth() === cursor.getMonth();
            return (
              <div key={i} className={cn("min-h-[100px] border-b border-l border-border p-1.5", !isCurrent && "bg-muted/30")}>
                <div className={cn("text-xs font-medium", isSameDay(d, new Date()) ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground")}>
                  {format(d, "d")}
                </div>
                <div className="mt-1 space-y-0.5">
                  {dayBookings.slice(0, 2).map((b) => (
                    <button key={b.id} onClick={() => onSelect(b)} className="block w-full truncate rounded bg-primary/15 text-primary border border-primary/20 px-1 py-0.5 text-left text-[10px] hover:bg-primary/25">
                      {format(new Date(b.start), "HH:mm")} {b.resource}
                    </button>
                  ))}
                  {dayBookings.length > 2 && <div className="text-[10px] text-muted-foreground pl-1">+{dayBookings.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MyBookings({ onSelect }: { onSelect: (b: Booking) => void }) {
  const mine = bookings.filter((b) => b.bookedBy === currentUser.name || Math.random() < 0.3).slice(0, 8);
  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {mine.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No bookings yet.</div>}
      {mine.map((b) => (
        <button key={b.id} onClick={() => onSelect(b)} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-accent/40">
          <div className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-muted">
            <div className="text-[9px] font-medium uppercase text-muted-foreground">{format(new Date(b.start), "MMM")}</div>
            <div className="text-sm font-semibold leading-none">{format(new Date(b.start), "d")}</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{b.resource}</div>
            <div className="text-xs text-muted-foreground">{format(new Date(b.start), "HH:mm")}–{format(new Date(b.end), "HH:mm")} · {b.purpose}</div>
          </div>
          <StatusChip status={b.status} />
        </button>
      ))}
    </div>
  );
}
