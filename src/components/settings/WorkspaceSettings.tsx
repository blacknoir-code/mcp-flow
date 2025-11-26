import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/stores/settingsStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

const mockMembers = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin", lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "2", name: "Bob", email: "bob@example.com", role: "Editor", lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "3", name: "Charlie", email: "charlie@example.com", role: "Viewer", lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

export const WorkspaceSettings = () => {
  const { workspace, updateWorkspace } = useSettingsStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    if (inviteEmail) {
      // Mock: add to members
      setShowInviteModal(false);
      setInviteEmail("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Workspace Information</h3>
        <div className="space-y-4">
          <div>
            <Label>Workspace Name</Label>
            <Input
              value={workspace.name}
              onChange={(e) => updateWorkspace({ name: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={workspace.description}
              onChange={(e) => updateWorkspace({ description: e.target.value })}
              className="mt-2"
              placeholder="Optional workspace description"
            />
          </div>
          <div>
            <Label>Domain</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={workspace.domain}
                onChange={(e) => updateWorkspace({ domain: e.target.value })}
                placeholder="example.com"
              />
              {workspace.domainVerified ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckIcon className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => updateWorkspace({ domainVerified: true })}>
                  Verify
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label>Timezone</Label>
            <Select
              value={workspace.timezone}
              onValueChange={(value) => updateWorkspace({ timezone: value })}
            >
              <SelectTrigger className="w-64 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Seats & Members</h3>
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Seat Usage</Label>
              <p className="text-sm text-gray-500">
                {workspace.seats.used} of {workspace.seats.purchased} seats used
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateWorkspace({
                    seats: { ...workspace.seats, purchased: workspace.seats.purchased + 1 },
                  })
                }
              >
                Add Seat
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateWorkspace({
                    seats: {
                      ...workspace.seats,
                      purchased: Math.max(workspace.seats.used, workspace.seats.purchased - 1),
                    },
                  })
                }
              >
                Remove Seat
              </Button>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{
                width: `${(workspace.seats.used / workspace.seats.purchased) * 100}%`,
              }}
            />
          </div>
        </Card>

        <div className="space-y-2">
          {mockMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-500">{member.email}</div>
                <div className="text-xs text-gray-400">
                  Last active {dayjs(member.lastActive).fromNow()}
                </div>
              </div>
              <Badge variant="outline">{member.role}</Badge>
            </div>
          ))}
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => setShowInviteModal(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Single Sign-On (SSO)</Label>
              <p className="text-sm text-gray-500">
                Enable SSO for workspace authentication
              </p>
            </div>
            <Switch
              checked={workspace.sso.enabled}
              onCheckedChange={(checked) =>
                updateWorkspace({
                  sso: { ...workspace.sso, enabled: checked },
                })
              }
            />
          </div>
          {workspace.sso.enabled && (
            <div>
              <Label>SSO Provider</Label>
              <Input
                value={workspace.sso.provider}
                onChange={(e) =>
                  updateWorkspace({
                    sso: { ...workspace.sso, provider: e.target.value },
                  })
                }
                className="mt-2"
                placeholder="e.g., Okta, Auth0"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>SCIM Provisioning</Label>
              <p className="text-sm text-gray-500">
                Enable SCIM for automated user provisioning
              </p>
            </div>
            <Switch
              checked={workspace.scim.enabled}
              onCheckedChange={(checked) =>
                updateWorkspace({
                  scim: { ...workspace.scim, enabled: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join this workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} className="bg-gradient-to-r from-primary to-electric-glow">
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

