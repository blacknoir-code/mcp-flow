import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Integration, IntegrationLog } from "@/data/mockIntegrations";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { clsx } from "clsx";

interface IntegrationLogsProps {
  integration: Integration;
}

const logTypeColors: Record<string, string> = {
  sync: "bg-blue-100 text-blue-700",
  token_rotated: "bg-green-100 text-green-700",
  trigger_fired: "bg-purple-100 text-purple-700",
  test_call: "bg-yellow-100 text-yellow-700",
  scope_reconsent: "bg-indigo-100 text-indigo-700",
  rate_limit_exceeded: "bg-red-100 text-red-700",
  error: "bg-red-100 text-red-700",
};

export const IntegrationLogs = ({ integration }: IntegrationLogsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const filteredLogs = useMemo(() => {
    let logs = integration.logs;

    if (filterType !== "all") {
      logs = logs.filter((log) => log.type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          JSON.stringify(log.metadata || {}).toLowerCase().includes(query)
      );
    }

    return logs;
  }, [integration.logs, filterType, searchQuery]);

  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Integration Logs</h3>
        <Badge variant="outline" className="text-xs">
          {filteredLogs.length} entries
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sync">Sync</SelectItem>
            <SelectItem value="test_call">Test Calls</SelectItem>
            <SelectItem value="trigger_fired">Triggers</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No logs found</p>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-gray-50 rounded border border-gray-200 text-sm"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={clsx("text-xs", logTypeColors[log.type] || "bg-gray-100")}
                  >
                    {log.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {dayjs(log.timestamp).format("MMM D, HH:mm:ss")}
                  </span>
                  {log.status && (
                    <Badge
                      variant={log.status === "success" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {log.status}
                    </Badge>
                  )}
                </div>
                {log.metadata && (
                  <button
                    onClick={() => toggleExpand(log.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="Toggle metadata"
                  >
                    {expandedLogs.has(log.id) ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-gray-900">{log.message}</p>
              {expandedLogs.has(log.id) && log.metadata && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded overflow-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

