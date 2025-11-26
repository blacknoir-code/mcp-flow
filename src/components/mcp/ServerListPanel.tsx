import { MCPServer } from "@/data/mockMcpServers";
import { Badge } from "@/components/ui/badge";
import {
  ArrowPathIcon,
  DocumentTextIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { useMcpStore } from "@/stores/mcpStore";
import { MetricsSparkline } from "./MetricsSparkline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { clsx } from "clsx";

dayjs.extend(relativeTime);

interface ServerListPanelProps {
  healthFilter: string;
  onServerSelect: (serverId: string) => void;
}

const healthColors = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  maintenance: "bg-purple-500",
  restarting: "bg-blue-500",
};

const healthLabels = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
  maintenance: "Maintenance",
  restarting: "Restarting",
};

export const ServerListPanel = ({
  healthFilter,
  onServerSelect,
}: ServerListPanelProps) => {
  const { servers, selectedServerId, runHealthCheck, restartServer } = useMcpStore();

  const serverList = Object.values(servers).filter((server) => {
    if (healthFilter === "all") return true;
    return server.health === healthFilter;
  });

  const handleQuickAction = (e: React.MouseEvent, action: string, serverId: string) => {
    e.stopPropagation();
    if (action === "health") {
      runHealthCheck(serverId);
    } else if (action === "restart") {
      if (confirm("Restart this server?")) {
        restartServer(serverId);
      }
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-sm text-gray-900">Servers ({serverList.length})</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {serverList.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No servers found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {serverList.map((server) => (
              <div
                key={server.id}
                onClick={() => onServerSelect(server.id)}
                className={clsx(
                  "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedServerId === server.id && "bg-blue-50 border-l-4 border-blue-500"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {server.settings.alias || server.name}
                      </h3>
                      <div
                        className={clsx(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          healthColors[server.health]
                        )}
                        aria-label={healthLabels[server.health]}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {server.region}
                      </Badge>
                      {server.tags.slice(0, 1).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{server.uptimePct.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Functions:</span>
                    <span className="font-medium">{server.functions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last heartbeat:</span>
                    <span className="font-medium">{dayjs(server.lastHeartbeat).fromNow()}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>RPS:</span>
                      <span className="font-medium">
                        {server.metrics.rpsHistory[server.metrics.rpsHistory.length - 1]}
                      </span>
                    </div>
                    <MetricsSparkline
                      data={server.metrics.rpsHistory}
                      width={120}
                      height={20}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => handleQuickAction(e, "health", server.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Health Check"
                    aria-label="Health Check"
                  >
                    <ArrowPathIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => handleQuickAction(e, "restart", server.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Restart"
                    aria-label="Restart"
                  >
                    <PowerIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onServerSelect(server.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded ml-auto"
                    title="View Logs"
                    aria-label="View Logs"
                  >
                    <DocumentTextIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

