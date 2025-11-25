import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Users, 
  Zap,
  Moon,
  Sun,
  Trash2,
  Save
} from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    workflow: true,
    errors: true,
  });

  return (
    <div className="min-h-full">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your browser preferences and account settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Sarah Chen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah@company.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Product Manager @ TechCorp" />
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Appearance Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme across the browser
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive workflow updates via email
                  </p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, email: checked})
                  } 
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to your Slack workspace
                  </p>
                </div>
                <Switch 
                  checked={notifications.slack} 
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, slack: checked})
                  } 
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Workflow Completion</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when workflows complete successfully
                  </p>
                </div>
                <Switch 
                  checked={notifications.workflow} 
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, workflow: checked})
                  } 
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Error Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about workflow errors
                  </p>
                </div>
                <Switch 
                  checked={notifications.errors} 
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, errors: checked})
                  } 
                />
              </div>
            </div>
          </Card>

          {/* Execution Limits Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Execution Limits</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Concurrent Workflows</Label>
                  <Badge variant="outline">5 / 10</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maximum number of workflows running simultaneously
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Monthly Executions</Label>
                  <Badge variant="outline">2,345 / 10,000</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "23.45%" }} />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </Card>

          {/* Team Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Team Workspace</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workspace Name</Label>
                <Input defaultValue="TechCorp Engineering" />
              </div>

              <div className="space-y-3">
                <Label>Team Members</Label>
                <div className="space-y-2">
                  {[
                    { name: "Sarah Chen", role: "Owner", email: "sarah@company.com" },
                    { name: "Mike Johnson", role: "Admin", email: "mike@company.com" },
                    { name: "Lisa Park", role: "Member", email: "lisa@company.com" },
                  ].map((member) => (
                    <div key={member.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Security & Privacy</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Keys</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Manage your API keys and tokens
                </p>
                <Button variant="outline">View API Keys</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Retention</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Control how long execution logs are stored
                </p>
                <Button variant="outline">Configure Retention</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-destructive">Danger Zone</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Permanently delete your account and all data
                </p>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
