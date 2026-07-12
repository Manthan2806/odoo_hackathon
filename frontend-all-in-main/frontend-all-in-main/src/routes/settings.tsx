import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { employees } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const categories = [
  { name: "Laptop", count: 42 }, { name: "Monitor", count: 28 }, { name: "Phone", count: 18 },
  { name: "Tablet", count: 12 }, { name: "Peripheral", count: 34 }, { name: "Vehicle", count: 3 },
  { name: "Meeting Room", count: 8 }, { name: "Software", count: 15 },
];

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);

  return (
    <div>
      <PageHeader title="Settings" description="Manage users, categories, and system preferences." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & roles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Workspace</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Organization name</Label><Input defaultValue="Acme Corp" /></div>
                <div className="space-y-1.5"><Label>Default location</Label><Input defaultValue="HQ — Floor 3" /></div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="text-sm font-medium">Email notifications</div>
                  <div className="text-xs text-muted-foreground">Send approval and maintenance updates via email</div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Auto-assign on registration</div>
                  <div className="text-xs text-muted-foreground">Assign new assets to a requester's queue automatically</div>
                </div>
                <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
              </div>
              <div className="flex justify-end border-t border-border pt-4">
                <Button size="sm" onClick={() => toast.success("Settings saved")}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Team members</CardTitle>
              <Button size="sm">Invite user</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {employees.slice(0, 12).map((e) => (
                  <div key={e.id} className="flex items-center gap-3 px-6 py-3">
                    <Avatar><AvatarImage src={e.avatar} /><AvatarFallback>{e.name[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{e.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{e.email}</div>
                    </div>
                    <Badge variant="secondary" className="font-normal">{e.role}</Badge>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Asset categories</CardTitle>
              <Button size="sm">New category</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.count} assets</div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "Slack", desc: "Post approval requests to a channel", connected: true },
              { name: "Google Workspace", desc: "Sync employees and calendars", connected: true },
              { name: "Okta SSO", desc: "Single sign-on for your team", connected: false },
              { name: "Jira", desc: "Create maintenance tickets in Jira", connected: false },
            ].map((i) => (
              <Card key={i.name}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.desc}</div>
                  </div>
                  <Button size="sm" variant={i.connected ? "outline" : "default"}>
                    {i.connected ? "Connected" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
