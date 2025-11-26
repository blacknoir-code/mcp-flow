import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Integration } from "@/data/mockIntegrations";
import { clsx } from "clsx";

interface RateLimitPanelProps {
  integration: Integration;
  onToggleThrottle: (enabled: boolean) => void;
}

export const RateLimitPanel = ({ integration, onToggleThrottle }: RateLimitPanelProps) => {
  const { rateLimits, settings } = integration;

  const perMinuteUsage = (rateLimits.usedLastHour / 60 / rateLimits.perMinute) * 100;
  const perDayUsage = (rateLimits.usedToday / rateLimits.perDay) * 100;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-sm">Rate Limits</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-gray-500">Per Minute</Label>
            <span className="text-xs font-medium">
              {rateLimits.usedLastHour} / {rateLimits.perMinute}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all", getUsageColor(perMinuteUsage))}
              style={{ width: `${Math.min(100, perMinuteUsage)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(perMinuteUsage)}% used (last hour)
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-gray-500">Per Day</Label>
            <span className="text-xs font-medium">
              {rateLimits.usedToday} / {rateLimits.perDay}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all", getUsageColor(perDayUsage))}
              style={{ width: `${Math.min(100, perDayUsage)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(perDayUsage)}% used today
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Client-Side Throttling</Label>
              <p className="text-xs text-gray-500">Block requests when approaching limits</p>
            </div>
            <Switch
              checked={settings.throttleEnabled}
              onCheckedChange={onToggleThrottle}
            />
          </div>
          {settings.throttleEnabled && settings.requestsBlocked !== undefined && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {settings.requestsBlocked} requests blocked
              </Badge>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Spikes</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">2 hours ago</span>
              <span className="font-medium">45 requests</span>
              <Badge variant="outline" className="text-xs">Normal</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">5 hours ago</span>
              <span className="font-medium">120 requests</span>
              <Badge variant="outline" className="text-xs bg-yellow-50">Spike</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

