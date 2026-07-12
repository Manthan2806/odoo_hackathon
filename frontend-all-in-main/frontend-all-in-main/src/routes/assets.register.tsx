import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight, Package, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/assets/register")({ component: RegisterAssetPage });

const steps = ["Basic info", "Purchase", "Assignment", "Review", "Success"];

function RegisterAssetPage() {
  const [step, setStep] = useState(0);
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    serial: "",
    vendor: "",
    purchaseDate: "",
    value: "",
    warranty: "",
    assignTo: "",
    department: "",
    location: "",
    notes: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader title="Register asset" description="Add a new asset to your inventory." />

      <div className="mb-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium border",
                i < step ? "bg-primary text-primary-foreground border-primary" :
                i === step ? "border-primary text-primary" : "border-border text-muted-foreground",
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <div className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Asset name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="MacBook Pro 16″ M3" /></FormField>
              <FormField label="Category">
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {["Laptop", "Monitor", "Phone", "Tablet", "Peripheral", "Vehicle", "Meeting Room", "Software"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Serial number"><Input value={form.serial} onChange={(e) => set("serial", e.target.value)} placeholder="SN00000000" /></FormField>
              <FormField label="Vendor"><Input value={form.vendor} onChange={(e) => set("vendor", e.target.value)} placeholder="Apple" /></FormField>
              <div className="col-span-2">
                <FormField label="Notes"><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional description or condition notes" /></FormField>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Purchase date"><Input type="date" value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} /></FormField>
              <FormField label="Warranty until"><Input type="date" value={form.warranty} onChange={(e) => set("warranty", e.target.value)} /></FormField>
              <FormField label="Value (USD)"><Input type="number" value={form.value} onChange={(e) => set("value", e.target.value)} placeholder="2499" /></FormField>
              <FormField label="Location"><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="HQ — Floor 3" /></FormField>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <FormField label="Assign to (optional)"><Input value={form.assignTo} onChange={(e) => set("assignTo", e.target.value)} placeholder="Employee name or leave empty for available" /></FormField>
              <FormField label="Department"><Input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="Engineering" /></FormField>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="text-sm font-medium mb-2">Review details</div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(form).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="font-medium">{v || <span className="text-muted-foreground">—</span>}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                <CircleCheck className="h-7 w-7" />
              </div>
              <div className="mt-4 text-lg font-semibold">Asset registered</div>
              <p className="mt-1 text-sm text-muted-foreground">{form.name || "Your new asset"} has been added to inventory.</p>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => { setStep(0); setForm({ name: "", category: "", serial: "", vendor: "", purchaseDate: "", value: "", warranty: "", assignTo: "", department: "", location: "", notes: "" }); }}>Register another</Button>
                <Button asChild><Link to="/assets"><Package className="h-4 w-4 mr-1.5" />View assets</Link></Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />Back
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (step === 3) toast.success("Asset registered");
                  setStep((s) => s + 1);
                }}
              >
                {step === 3 ? "Submit" : "Continue"}
                {step < 3 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
