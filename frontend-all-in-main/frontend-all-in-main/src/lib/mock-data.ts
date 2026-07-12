// Comprehensive mock data for AssetFlow
export type AssetStatus = "Available" | "Assigned" | "Reserved" | "Maintenance" | "Lost" | "Retired";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type MaintenanceStatus = "Reported" | "Assigned" | "In Progress" | "Waiting Parts" | "Resolved" | "Closed";
export type Role = "Employee" | "Department Manager" | "Asset Manager" | "Auditor" | "Administrator";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  jobTitle: string;
  avatar: string;
  location: string;
  startDate: string;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: AssetStatus;
  assignedTo?: string;
  department?: string;
  location: string;
  purchaseDate: string;
  warrantyUntil: string;
  serialNumber: string;
  vendor: string;
  value: number;
  image?: string;
}

export interface Booking {
  id: string;
  resource: string;
  resourceType: string;
  bookedBy: string;
  start: string;
  end: string;
  status: BookingStatus;
  purpose: string;
}

export interface MaintenanceTicket {
  id: string;
  ticket: string;
  assetId: string;
  assetName: string;
  reportedBy: string;
  technician?: string;
  status: MaintenanceStatus;
  priority: "Low" | "Medium" | "High" | "Critical";
  reportedAt: string;
  completedAt?: string;
  description: string;
}

export interface Request {
  id: string;
  employee: string;
  department: string;
  asset: string;
  reason: string;
  priority: "Low" | "Medium" | "High";
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled";
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  availability: number;
  total: number;
  description: string;
  tags: string[];
}

export interface ActivityEvent {
  id: string;
  type: string;
  actor: string;
  target: string;
  timestamp: string;
  description: string;
}

const departments = ["Engineering", "Design", "Marketing", "Sales", "Finance", "Operations", "People", "Legal"];
const locations = ["HQ — Floor 3", "HQ — Floor 5", "Remote", "Berlin Office", "London Office", "NYC Office", "Warehouse A"];
const categories = ["Laptop", "Monitor", "Phone", "Tablet", "Peripheral", "Vehicle", "Meeting Room", "Projector", "Software"];
const vendors = ["Apple", "Dell", "Lenovo", "HP", "Samsung", "Logitech", "Microsoft", "Google"];

const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Jamie", "Drew", "Chris", "Emma", "Liam", "Olivia", "Noah", "Ava", "Lucas", "Sophia", "Ethan", "Mia", "Aria"];
const lastNames = ["Chen", "Patel", "Kim", "Nguyen", "Silva", "Johnson", "Garcia", "Müller", "Rossi", "Wagner", "Dubois", "Hernandez", "Cohen", "Sato", "Fischer"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function seedDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const employees: Employee[] = Array.from({ length: 42 }, (_, i) => {
  const first = pick(firstNames, i);
  const last = pick(lastNames, i * 3 + 1);
  const name = `${first} ${last}`;
  const dept = pick(departments, i);
  const roles: Role[] = ["Employee", "Employee", "Employee", "Employee", "Department Manager", "Asset Manager", "Auditor", "Administrator"];
  return {
    id: `EMP-${String(1000 + i)}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@assetflow.io`,
    role: pick(roles, i),
    department: dept,
    jobTitle: pick(["Senior Engineer", "Product Designer", "Marketing Lead", "Account Executive", "Analyst", "Operations Manager", "Recruiter", "Counsel"], i),
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`,
    location: pick(locations, i),
    startDate: seedDate(300 + i * 17),
  };
});

const assetNames = [
  "MacBook Pro 16″ M3", "MacBook Air 15″ M2", "Dell XPS 15", "ThinkPad X1 Carbon", "Studio Display 27″",
  "LG UltraFine 5K", "iPhone 15 Pro", "Pixel 8 Pro", "iPad Pro 12.9″", "Magic Keyboard", "MX Master 3S",
  "AirPods Pro", "Sony WH-1000XM5", "Herman Miller Aeron", "Standing Desk Pro", "4K Projector", "Ford Transit Van",
  "Tesla Model Y", "Meeting Room — Aurora", "Meeting Room — Nebula", "Adobe Creative Cloud", "Figma Enterprise",
  "GitHub Enterprise", "Notion Team", "Zoom Workplace", "Slack Enterprise Grid",
];

const statuses: AssetStatus[] = ["Available", "Assigned", "Assigned", "Assigned", "Reserved", "Maintenance", "Retired"];

export const assets: Asset[] = Array.from({ length: 128 }, (_, i) => {
  const name = pick(assetNames, i);
  const status = pick(statuses, i * 3);
  const assignee = status === "Assigned" ? pick(employees, i) : undefined;
  const category = name.includes("Room") ? "Meeting Room" :
    name.includes("Projector") ? "Projector" :
    name.includes("Van") || name.includes("Tesla") ? "Vehicle" :
    name.includes("Adobe") || name.includes("Figma") || name.includes("GitHub") || name.includes("Notion") || name.includes("Zoom") || name.includes("Slack") ? "Software" :
    name.includes("Display") || name.includes("UltraFine") ? "Monitor" :
    name.includes("iPhone") || name.includes("Pixel") ? "Phone" :
    name.includes("iPad") ? "Tablet" :
    name.includes("Book") || name.includes("XPS") || name.includes("ThinkPad") ? "Laptop" : "Peripheral";
  return {
    id: `AST-${String(2000 + i)}`,
    tag: `AF-${String(10000 + i)}`,
    name,
    category,
    status,
    assignedTo: assignee?.name,
    department: assignee?.department ?? pick(departments, i),
    location: pick(locations, i),
    purchaseDate: seedDate(200 + i * 13),
    warrantyUntil: seedDate(-365 + i * 5),
    serialNumber: `SN${String(100000 + i * 37).padStart(8, "0")}`,
    vendor: pick(vendors, i),
    value: 200 + (i % 20) * 180,
  };
});

export const bookings: Booking[] = Array.from({ length: 34 }, (_, i) => {
  const start = new Date();
  start.setDate(start.getDate() + (i - 10));
  start.setHours(9 + (i % 8), 0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1 + (i % 3));
  const bookingStatuses: BookingStatus[] = ["Pending", "Confirmed", "Confirmed", "Confirmed", "Completed", "Cancelled"];
  const roomAssets = assets.filter(a => a.category === "Meeting Room" || a.category === "Vehicle" || a.category === "Projector");
  const resource = roomAssets[i % roomAssets.length] ?? assets[0];
  return {
    id: `BK-${String(3000 + i)}`,
    resource: resource.name,
    resourceType: resource.category,
    bookedBy: pick(employees, i).name,
    start: start.toISOString(),
    end: end.toISOString(),
    status: pick(bookingStatuses, i),
    purpose: pick(["Team sync", "Client meeting", "Interview", "Workshop", "1:1", "All-hands"], i),
  };
});

export const maintenanceTickets: MaintenanceTicket[] = Array.from({ length: 24 }, (_, i) => {
  const asset = pick(assets, i * 4);
  const mStatuses: MaintenanceStatus[] = ["Reported", "Assigned", "In Progress", "Waiting Parts", "Resolved", "Closed"];
  const status = pick(mStatuses, i);
  return {
    id: `TCK-${String(4000 + i)}`,
    ticket: `MT-${String(4000 + i)}`,
    assetId: asset.id,
    assetName: asset.name,
    reportedBy: pick(employees, i).name,
    technician: i % 3 === 0 ? undefined : pick(employees, i + 5).name,
    status,
    priority: pick(["Low", "Medium", "High", "Critical"] as const, i),
    reportedAt: seedDate(i * 2),
    completedAt: status === "Resolved" || status === "Closed" ? seedDate(i) : undefined,
    description: pick([
      "Screen flickering intermittently.",
      "Battery drains within 2 hours.",
      "Keyboard keys unresponsive.",
      "Overheating under load.",
      "USB-C port loose.",
      "Fan making grinding noise.",
    ], i),
  };
});

export const requests: Request[] = Array.from({ length: 18 }, (_, i) => ({
  id: `REQ-${String(5000 + i)}`,
  employee: pick(employees, i).name,
  department: pick(employees, i).department,
  asset: pick(assetNames, i + 2),
  reason: pick([
    "New hire onboarding",
    "Current device end-of-life",
    "Role change requires upgrade",
    "Damaged in transit",
    "Additional monitor for productivity",
    "Client presentation next week",
  ], i),
  priority: pick(["Low", "Medium", "High"] as const, i),
  submittedAt: seedDate(i),
  status: pick(["Pending", "Pending", "Pending", "Approved", "Rejected", "Fulfilled"] as const, i),
}));

export const catalogItems: CatalogItem[] = [
  { id: "C1", name: "MacBook Pro 16″ M3", category: "Hardware", availability: 4, total: 12, description: "High-performance laptop for engineering and design workloads.", tags: ["Laptop", "Apple", "M3"] },
  { id: "C2", name: "Dell XPS 15", category: "Hardware", availability: 6, total: 10, description: "Windows powerhouse with dedicated GPU.", tags: ["Laptop", "Windows"] },
  { id: "C3", name: "Studio Display 27″", category: "Hardware", availability: 8, total: 20, description: "5K Retina display with built-in camera and speakers.", tags: ["Monitor", "5K"] },
  { id: "C4", name: "iPhone 15 Pro", category: "Hardware", availability: 3, total: 8, description: "Company-issued mobile device.", tags: ["Phone", "iOS"] },
  { id: "C5", name: "Adobe Creative Cloud", category: "Software", availability: 25, total: 50, description: "Full Creative Cloud license — Photoshop, Illustrator, and more.", tags: ["Design", "License"] },
  { id: "C6", name: "Figma Enterprise", category: "Software", availability: 42, total: 100, description: "Enterprise Figma seat with dev mode and audit logs.", tags: ["Design", "SaaS"] },
  { id: "C7", name: "Meeting Room — Aurora", category: "Meeting Rooms", availability: 1, total: 1, description: "12-person conference room with 4K display and video conferencing.", tags: ["Room", "12p"] },
  { id: "C8", name: "Meeting Room — Nebula", category: "Meeting Rooms", availability: 1, total: 1, description: "6-person huddle room with whiteboard.", tags: ["Room", "6p"] },
  { id: "C9", name: "4K Projector", category: "Shared Equipment", availability: 2, total: 3, description: "Portable 4K projector for on-site presentations.", tags: ["AV"] },
  { id: "C10", name: "Ford Transit Van", category: "Vehicles", availability: 1, total: 2, description: "Cargo van for office moves and events.", tags: ["Vehicle"] },
  { id: "C11", name: "Tesla Model Y", category: "Vehicles", availability: 0, total: 1, description: "Executive travel vehicle.", tags: ["Vehicle", "EV"] },
  { id: "C12", name: "Logitech MX Master 3S", category: "Accessories", availability: 14, total: 20, description: "Ergonomic wireless mouse.", tags: ["Peripheral"] },
];

export const activity: ActivityEvent[] = Array.from({ length: 20 }, (_, i) => ({
  id: `EV-${i}`,
  type: pick(["assignment", "registration", "maintenance", "booking", "return", "approval"], i),
  actor: pick(employees, i).name,
  target: pick(assets, i * 3).name,
  timestamp: seedDate(i / 2),
  description: pick([
    "assigned an asset",
    "registered a new asset",
    "reported a maintenance issue",
    "confirmed a booking",
    "returned an asset",
    "approved a request",
  ], i),
}));

export const currentUser = {
  id: "EMP-1000",
  name: "Alex Chen",
  email: "alex.chen@assetflow.io",
  role: "Asset Manager" as Role,
  department: "Operations",
  avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=Alex%20Chen`,
};
