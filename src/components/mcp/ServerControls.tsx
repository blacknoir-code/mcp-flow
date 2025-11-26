import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowPathIcon,
  PowerIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { MCPServer } from "@/data/mockMcpServers";
import { useState } from "react";
import { MockOperationModal } from "./MockOperationModal";
import { clsx } from "clsx";

interface ServerControlsProps {
  server: MCPServer;
  onReloadFunctions: () => Promise<void>;
  onRestart: () => Promise<void>;
  onToggleMaintenance: (enabled: boolean) => void;
  onToggleDisabled: (enabled: boolean) => void;
  onForceHeartbeat: () => void;
}

export const ServerControls = ({
  server,
  onReloadFunctions,
  onRestart,
  onToggleMaintenance,
  onToggleDisabled,
  onForceHeartbeat,
}: ServerControlsProps) => {
  const [isReloading, setIsReloading] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await onReloadFunctions();
    } finally {
      setIsReloading(false);
    }
  };

  const handleRestart = async () => {
    setShowRestartConfirm(false);
    setIsRestarting(true);
    try {
      await onRestart();
    } finally {
      setIsRestarting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-sm">Server Controls</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="maintenance" className="text-sm font-medium">
              Maintenance Mode
            </Label>
            <p className="text-xs text-gray-500">
              Server returns 503 during maintenance
            </p>
          </div>
          <Switch
            id="maintenance"
            checked={server.settings.maintenance}
            onCheckedChange={onToggleMaintenance}
            disabled={server.health === "restarting"}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="disabled" className="text-sm font-medium">
              Disable Server
            </Label>
            <p className="text-xs text-gray-500">
              Prevent all function calls
            </p>
          </div>
          <Switch
            id="disabled"
            checked={server.settings.disabled}
            onCheckedChange={onToggleDisabled}
            disabled={server.health === "restarting"}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <Button
          onClick={handleReload}
          disabled={isReloading || server.health === "restarting"}
          variant="outline"
          className="w-full justify-start"
        >
          <ArrowPathIcon className={clsx("w-4 h-4 mr-2", isReloading && "animate-spin")} />
          {isReloading ? "Reloading..." : "Reload Functions"}
        </Button>

        <Button
          onClick={() => setShowRestartConfirm(true)}
          disabled={isRestarting || server.health === "restarting"}
          variant="outline"
          className="w-full justify-start text-yellow-600 hover:text-yellow-700"
        >
          <PowerIcon className="w-4 h-4 mr-2" />
          {isRestarting ? "Restarting..." : "Restart Server"}
        </Button>

        <Button
          onClick={onForceHeartbeat}
          variant="outline"
          className="w-full justify-start"
        >
          <HeartIcon className="w-4 h-4 mr-2" />
          Force Heartbeat
        </Button>
      </div>

      {showRestartConfirm && (
        <MockOperationModal
          title="Confirm Restart"
          message="Are you sure you want to restart this server? This will temporarily make functions unavailable."
          onConfirm={handleRestart}
          onCancel={() => setShowRestartConfirm(false)}
          operation="restart"
        />
      )}

      {isRestarting && (
        <MockOperationModal
          title="Restarting Server"
          message="Server is restarting. This may take a few seconds..."
          operation="restart"
          isProgress
        />
      )}
    </div>
  );
};

