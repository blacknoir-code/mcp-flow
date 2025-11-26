import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowPathIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Integration } from "@/data/mockIntegrations";
import dayjs from "dayjs";

interface TokenManagerProps {
  integration: Integration;
  onRotate: () => void;
  onRevoke: () => void;
  onUpdateSettings: (settings: any) => void;
}

export const TokenManager = ({
  integration,
  onRotate,
  onRevoke,
  onUpdateSettings,
}: TokenManagerProps) => {
  const [showToken, setShowToken] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(integration.token.valueMasked);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-sm">Token Management</h3>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Token Type</Label>
          <div className="text-sm font-medium mt-1">
            {integration.token.type === "oauth" ? "OAuth Access Token" : "API Key"}
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Token Value</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200 font-mono text-xs">
              {showToken ? integration.token.valueMasked : "****_****_****"}
            </div>
            <button
              onClick={() => setShowToken(!showToken)}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label={showToken ? "Hide token" : "Show token"}
            >
              {showToken ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
            <Button onClick={handleCopyToken} size="sm" variant="outline" aria-label="Copy token">
              <DocumentDuplicateIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Expires At</Label>
          <div className="text-sm mt-1">
            {dayjs(integration.token.expiresAt).format("MMM D, YYYY HH:mm")}
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Last Rotated</Label>
          <div className="text-sm mt-1">
            {dayjs(integration.token.lastRotated).format("MMM D, YYYY")}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Automatic Rotation</Label>
              <p className="text-xs text-gray-500">Automatically rotate token on schedule</p>
            </div>
            <Switch
              checked={integration.settings.autoRotate}
              onCheckedChange={(checked) =>
                onUpdateSettings({ autoRotate: checked })
              }
            />
          </div>

          {integration.settings.autoRotate && (
            <div>
              <Label className="text-xs">Rotation Frequency</Label>
              <Select
                value={String(integration.settings.rotateEveryDays)}
                onValueChange={(value) =>
                  onUpdateSettings({ rotateEveryDays: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Every 30 days</SelectItem>
                  <SelectItem value="60">Every 60 days</SelectItem>
                  <SelectItem value="90">Every 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <Button onClick={onRotate} size="sm" variant="outline" className="flex-1">
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Rotate Token
          </Button>
          <Button onClick={onRevoke} size="sm" variant="outline" className="flex-1 text-red-600">
            <XCircleIcon className="w-4 h-4 mr-2" />
            Revoke
          </Button>
        </div>
      </div>
    </div>
  );
};

