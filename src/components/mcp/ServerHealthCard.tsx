import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { MCPServer } from "@/data/mockMcpServers";
import { MetricsSparkline } from "./MetricsSparkline";
import { clsx } from "clsx";
import dayjs from "dayjs";

interface ServerHealthCardProps {
  server: MCPServer;
  onForceHealthCheck: () => void;
  isChecking: boolean;
}

const healthConfig = {
  healthy: {
    color: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Healthy",
  },
  degraded: {
    color: "bg-yellow-500",
    text: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    label: "Degraded",
  },
  down: {
    color: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Down",
  },
  maintenance: {
    color: "bg-purple-500",
    text: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "Maintenance",
  },
  restarting: {
    color: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Restarting",
  },
};

export const ServerHealthCard = ({
  server,
  onForceHealthCheck,
  isChecking,
}: ServerHealthCardProps) => {
  const config = healthConfig[server.health];
  const successRate = 100 - (server.metrics.errorRateHistory[server.metrics.errorRateHistory.length - 1] || 0) * 100;

  return (
    <div className={clsx("bg-white border rounded-lg p-4", config.border)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx("w-3 h-3 rounded-full", config.color)} />
          <h3 className="font-semibold text-sm">Server Health</h3>
          <Badge className={clsx("text-xs", config.bg, config.text)}>
            {config.label}
          </Badge>
        </div>
        <Button
          onClick={onForceHealthCheck}
          disabled={isChecking}
          size="sm"
          variant="outline"
          aria-label="Force health check"
        >
          <ArrowPathIcon className={clsx("w-4 h-4 mr-2", isChecking && "animate-spin")} />
          {isChecking ? "Checking..." : "Force Health Check"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Uptime</div>
          <div className="text-2xl font-bold text-gray-900">{server.uptimePct.toFixed(1)}%</div>
          <MetricsSparkline
            data={Array(10).fill(server.uptimePct)}
            width={100}
            height={20}
            color="#2ECC71"
          />
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-gray-900">{successRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Last 1h</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Avg Latency</div>
          <div className="text-2xl font-bold text-gray-900">{server.metrics.avgLatencyMs}ms</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">CPU Usage</div>
          <div className="text-2xl font-bold text-gray-900">{server.metrics.cpuPct.toFixed(1)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={clsx(
                "h-2 rounded-full transition-all",
                server.metrics.cpuPct > 80 ? "bg-red-500" : server.metrics.cpuPct > 60 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${Math.min(100, server.metrics.cpuPct)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Memory Usage</div>
          <div className="text-2xl font-bold text-gray-900">{server.metrics.memPct.toFixed(1)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={clsx(
                "h-2 rounded-full transition-all",
                server.metrics.memPct > 80 ? "bg-red-500" : server.metrics.memPct > 60 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${Math.min(100, server.metrics.memPct)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Last Deploy</div>
          <div className="text-sm font-medium text-gray-900">
            {dayjs(server.lastDeployTime).format("MMM D, YYYY")}
          </div>
          <div className="text-xs text-gray-500">v{server.deployVersion}</div>
        </div>
      </div>
    </div>
  );
};

