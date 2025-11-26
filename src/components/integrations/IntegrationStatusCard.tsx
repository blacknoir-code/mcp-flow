import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Integration } from "@/data/mockIntegrations";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { clsx } from "clsx";

dayjs.extend(relativeTime);

interface IntegrationStatusCardProps {
  integration: Integration;
  onSync: () => void;
  isSyncing: boolean;
}

export const IntegrationStatusCard = ({
  integration,
  onSync,
  isSyncing,
}: IntegrationStatusCardProps) => {
  const tokenExpiresIn = dayjs(integration.token.expiresAt).diff(dayjs(), "day");
  const tokenExpiresInHours = dayjs(integration.token.expiresAt).diff(dayjs(), "hour");
  const tokenExpiresInMinutes = dayjs(integration.token.expiresAt).diff(dayjs(), "minute");

  const formatExpiry = () => {
    if (tokenExpiresIn > 0) {
      if (tokenExpiresIn >= 1) {
        return `${tokenExpiresIn}d ${Math.floor((tokenExpiresInHours % 24))}h`;
      }
      return `${tokenExpiresInHours}h ${tokenExpiresInMinutes % 60}m`;
    }
    return "Expired";
  };

  const healthColor = {
    healthy: "bg-green-100 text-green-700 border-green-300",
    degraded: "bg-yellow-100 text-yellow-700 border-yellow-300",
    error: "bg-red-100 text-red-700 border-red-300",
  }[integration.health];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Connection Status</h3>
        <Badge className={clsx("text-xs", healthColor)}>{integration.health}</Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Token Expiry</span>
            <span className={clsx("text-xs font-medium", tokenExpiresIn < 3 ? "text-red-600" : "text-gray-700")}>
              Expires in {formatExpiry()}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {dayjs(integration.token.expiresAt).format("MMM D, YYYY HH:mm")}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Last Sync</span>
            <div className="flex items-center gap-1">
              {integration.lastSyncResult === "success" ? (
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-xs text-gray-700">
                {dayjs(integration.lastSyncAt).fromNow()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <Button
            onClick={onSync}
            disabled={isSyncing}
            size="sm"
            variant="outline"
            className="w-full"
            aria-label="Sync now"
          >
            <ArrowPathIcon className={clsx("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

