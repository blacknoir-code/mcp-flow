import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkflowPermission } from "@/stores/workflowStore";

interface PermissionManagerProps {
  permissions: WorkflowPermission[];
  onUpdate: (permissions: WorkflowPermission[]) => void;
}

const appIcons: Record<string, any> = {
  Gmail: EnvelopeIcon,
  Jira: CheckCircleIcon,
  Slack: ChatBubbleLeftRightIcon,
};

export const PermissionManager = ({ permissions, onUpdate }: PermissionManagerProps) => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleReconnect = (app: string) => {
    alert(`Reconnecting ${app}... (mock)`);
    const updated = permissions.map((p) =>
      p.app === app ? { ...p, connected: true, lastSync: new Date().toISOString() } : p
    );
    onUpdate(updated);
  };

  const handleRevoke = (app: string) => {
    if (confirm(`Revoke access to ${app}?`)) {
      const updated = permissions.map((p) =>
        p.app === app ? { ...p, connected: false } : p
      );
      onUpdate(updated);
    }
  };

  const selectedPermission = permissions.find((p) => p.app === selectedApp);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-1">Connected Apps</h3>
        <p className="text-sm text-gray-500">
          Manage OAuth permissions for integrated applications
        </p>
      </div>

      <div className="space-y-3">
        {permissions.map((permission) => {
          const Icon = appIcons[permission.app] || CheckCircleIcon;
          return (
            <div
              key={permission.app}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{permission.app}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={permission.connected ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {permission.connected ? "Connected" : "Disconnected"}
                      </Badge>
                      {permission.lastSync && (
                        <span className="text-xs text-gray-500">
                          Synced {new Date(permission.lastSync).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {permission.scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setSelectedApp(permission.app)}
                    size="sm"
                    variant="outline"
                  >
                    View Scopes
                  </Button>
                  {permission.connected ? (
                    <Button
                      onClick={() => handleRevoke(permission.app)}
                      size="sm"
                      variant="outline"
                    >
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleReconnect(permission.app)}
                      size="sm"
                      variant="default"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-1" />
                      Reconnect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPermission && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OAuth Scopes - {selectedPermission.app}</DialogTitle>
              <DialogDescription>
                Permissions required for this workflow
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-2">
              {selectedPermission.scopes.map((scope) => (
                <div key={scope} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{scope}</span>
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

