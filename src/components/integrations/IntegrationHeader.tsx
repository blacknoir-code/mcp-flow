import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowPathIcon,
  XCircleIcon,
  BookOpenIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Integration } from "@/data/mockIntegrations";
import { ExecutionBadge } from "@/components/execution/ExecutionBadge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface IntegrationHeaderProps {
  integration: Integration;
  onReconnect: () => void;
  onRevoke: () => void;
}

const appIcons: Record<string, string> = {
  gmail: "📧",
  jira: "✅",
  slack: "💬",
  notion: "📝",
};

export const IntegrationHeader = ({
  integration,
  onReconnect,
  onRevoke,
}: IntegrationHeaderProps) => {
  const navigate = useNavigate();
  const appIcon = appIcons[integration.provider] || "📦";

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          onClick={() => navigate("/integrations")}
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label="Back to integrations"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Integrations
        </Button>
        <span className="text-sm text-gray-400">/</span>
        <span className="text-sm font-medium text-gray-900">{integration.name}</span>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{appIcon}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{integration.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ExecutionBadge
                  status={
                    integration.status === "connected"
                      ? "success"
                      : integration.status === "needs_auth"
                      ? "pending"
                      : "error"
                  }
                  size="sm"
                />
                <span className="text-gray-600">Connected as: {integration.connectedAs}</span>
              </div>
              <div className="text-gray-500">
                Last sync: {dayjs(integration.lastSyncAt).fromNow()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onReconnect} size="sm" variant="outline">
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Reconnect
          </Button>
          <Button onClick={onRevoke} size="sm" variant="outline" className="text-red-600">
            <XCircleIcon className="w-4 h-4 mr-2" />
            Revoke
          </Button>
          <Button size="sm" variant="outline">
            <BookOpenIcon className="w-4 h-4 mr-2" />
            Open Docs
          </Button>
        </div>
      </div>
    </div>
  );
};

