import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  Home, Inbox, LayoutGrid, Package, Calendar, Wrench, Users, BarChart3, Settings, Plus,
} from "lucide-react";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search assets, bookings, people…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}><Home className="mr-2 h-4 w-4" />Home</CommandItem>
          <CommandItem onSelect={() => go("/inbox")}><Inbox className="mr-2 h-4 w-4" />Inbox</CommandItem>
          <CommandItem onSelect={() => go("/catalog")}><LayoutGrid className="mr-2 h-4 w-4" />Catalog</CommandItem>
          <CommandItem onSelect={() => go("/assets")}><Package className="mr-2 h-4 w-4" />Assets</CommandItem>
          <CommandItem onSelect={() => go("/bookings")}><Calendar className="mr-2 h-4 w-4" />Bookings</CommandItem>
          <CommandItem onSelect={() => go("/maintenance")}><Wrench className="mr-2 h-4 w-4" />Maintenance</CommandItem>
          <CommandItem onSelect={() => go("/employees")}><Users className="mr-2 h-4 w-4" />Employees</CommandItem>
          <CommandItem onSelect={() => go("/reports")}><BarChart3 className="mr-2 h-4 w-4" />Reports</CommandItem>
          <CommandItem onSelect={() => go("/settings")}><Settings className="mr-2 h-4 w-4" />Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/assets/register")}><Plus className="mr-2 h-4 w-4" />Register new asset</CommandItem>
          <CommandItem onSelect={() => go("/bookings")}><Plus className="mr-2 h-4 w-4" />New booking</CommandItem>
          <CommandItem onSelect={() => go("/maintenance")}><Plus className="mr-2 h-4 w-4" />Report maintenance</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
