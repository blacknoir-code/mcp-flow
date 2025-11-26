import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettingsStore } from "@/stores/settingsStore";
import { ConfirmModal } from "./ConfirmModal";
import { useToastSystem } from "./ToastSystem";
import { appendAuditLog } from "@/stores/auditStore";

export const DataRetentionPanel = () => {
  const { retention, updateRetention } = useSettingsStore();
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const toast = useToastSystem();

  const handlePurge = async () => {
    setIsPurging(true);
    // Simulate purge operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPurging(false);
    toast.showSuccess("Purge completed. Removed 1,234 run logs and 567 audit logs.");
    appendAuditLog({
      user: "current_user",
      userEmail: "user@example.com",
      eventType: "settings",
      action: "purge_data",
      metadata: { retentionDays: retention.runLogsDays },
    });
  };

  const storageUsed = 45; // Mock percentage
  const storageQuota = 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Retention Periods</h3>
        <div className="space-y-4">
          <div>
            <Label>Run Logs Retention (days)</Label>
            <Select
              value={retention.runLogsDays.toString()}
              onValueChange={(value) =>
                updateRetention({ runLogsDays: parseInt(value) })
              }
            >
              <SelectTrigger className="w-48 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {retention.runLogsDays < 90 && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ Warning: Retention period below regulatory minimum (90 days)
              </p>
            )}
          </div>

          <div>
            <Label>Audit Logs Retention (days)</Label>
            <Select
              value={retention.auditLogsDays.toString()}
              onValueChange={(value) =>
                updateRetention({ auditLogsDays: parseInt(value) })
              }
            >
              <SelectTrigger className="w-48 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
                <SelectItem value="1095">1095 days (3 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Purge Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Purge on Delete</Label>
              <p className="text-sm text-gray-500">
                Immediately delete data when retention period expires (vs soft-delete)
              </p>
            </div>
            <Switch
              checked={retention.purgeOnDelete}
              onCheckedChange={(checked) =>
                updateRetention({ purgeOnDelete: checked })
              }
            />
          </div>

          <div>
            <Label>Auto-purge Schedule</Label>
            <Select
              value={retention.autoPurgeSchedule}
              onValueChange={(value) =>
                updateRetention({
                  autoPurgeSchedule: value as "daily" | "weekly" | "monthly",
                })
              }
            >
              <SelectTrigger className="w-48 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="font-semibold">
                {storageUsed}% / {storageQuota}GB
              </span>
            </div>
            <Progress value={storageUsed} className="h-2" />
            <p className="text-xs text-gray-500">
              Estimated based on current retention settings
            </p>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Manual Purge</h3>
        <Button
          variant="destructive"
          onClick={() => setShowPurgeModal(true)}
        >
          Run Manual Purge
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Permanently delete logs older than the retention period
        </p>
      </div>

      <ConfirmModal
        open={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
        onConfirm={handlePurge}
        title="Confirm Manual Purge"
        description="This will permanently delete all logs older than the retention period. This action cannot be undone."
        confirmText={isPurging ? "Purging..." : "Purge Now"}
        variant="destructive"
      />
    </div>
  );
};

