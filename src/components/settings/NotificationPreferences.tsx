import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToastSystem } from "./ToastSystem";
import { appendAuditLog } from "@/stores/auditStore";

export const NotificationPreferences = () => {
  const { notifications, updateNotifications } = useSettingsStore();
  const toast = useToastSystem();

  const handleTestNotification = (channel: string) => {
    toast.showSuccess(`Test notification sent via ${channel}`);
    appendAuditLog({
      user: "current_user",
      userEmail: "user@example.com",
      eventType: "settings",
      action: "test_notification",
      metadata: { channel },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {Object.entries(notifications.channels).map(([key, channel]) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="font-medium capitalize">{key}</Label>
                  {key === "slack" && !channel.enabled && (
                    <Badge variant="outline" className="text-xs">
                      Integration Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {key === "inApp" && "Show toast notifications in the app"}
                  {key === "email" && "Send email notifications"}
                  {key === "slack" && "Send notifications to Slack workspace"}
                  {key === "webhook" && "Send notifications to webhook endpoint"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={channel.enabled}
                  onCheckedChange={(checked) =>
                    updateNotifications({
                      channels: {
                        ...notifications.channels,
                        [key]: { ...channel, enabled: checked },
                      },
                    })
                  }
                />
                {channel.enabled && (
                  <Select
                    value={channel.frequency}
                    onValueChange={(value) =>
                      updateNotifications({
                        channels: {
                          ...notifications.channels,
                          [key]: { ...channel, frequency: value as "immediate" | "digest" | "off" },
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="digest">Digest</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestNotification(key)}
                  disabled={!channel.enabled}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Events</h3>
        <div className="space-y-3">
          {Object.entries(notifications.events).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <p className="text-sm text-gray-500">
                  {key === "workflowCompleted" && "Notify when workflows complete successfully"}
                  {key === "workflowFailed" && "Notify when workflows fail or encounter errors"}
                  {key === "integrationDisconnected" && "Notify when integrations disconnect"}
                  {key === "billingEvents" && "Notify about billing and subscription events"}
                  {key === "adminApprovals" && "Notify when admin approvals are required"}
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  updateNotifications({
                    events: {
                      ...notifications.events,
                      [key]: checked,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

