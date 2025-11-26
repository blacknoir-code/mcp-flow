import { Integration } from "@/data/mockIntegrations";
import {
  ArrowPathIcon,
  BoltIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface IntegrationActivityFeedProps {
  integration: Integration;
}

const activityIcons: Record<string, any> = {
  token_rotated: ArrowPathIcon,
  trigger_fired: BoltIcon,
  sync: CheckCircleIcon,
  default_updated: Cog6ToothIcon,
  reconnected: CheckCircleIcon,
};

export const IntegrationActivityFeed = ({ integration }: IntegrationActivityFeedProps) => {
  // Generate activity feed from logs
  const activities = integration.logs
    .slice(0, 10)
    .map((log) => ({
      id: log.id,
      type: log.type,
      message: log.message,
      timestamp: log.timestamp,
      icon: activityIcons[log.type] || CheckCircleIcon,
    }));

  if (activities.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-4">Activity Feed</h3>
        <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-sm mb-4">Activity Feed</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {dayjs(activity.timestamp).fromNow()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

