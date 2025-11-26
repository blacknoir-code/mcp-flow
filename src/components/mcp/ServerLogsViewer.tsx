import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { MCPServerLog } from "@/data/mockMcpServers";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { clsx } from "clsx";

interface ServerLogsViewerProps {
  logs: MCPServerLog[];
  onDownload: () => void;
  onClear: () => void;
}

const levelColors = {
  INFO: "bg-blue-100 text-blue-700",
  WARN: "bg-yellow-100 text-yellow-700",
  ERROR: "bg-red-100 text-red-700",
  DEBUG: "bg-gray-100 text-gray-700",
};

export const ServerLogsViewer = ({
  logs,
  onDownload,
  onClear,
}: ServerLogsViewerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const filteredLogs = useMemo(() => {
    let filtered = logs;

    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter);
    }

    if (timeRange !== "all") {
      const now = Date.now();
      const ranges: Record<string, number> = {
        "5m": 5 * 60 * 1000,
        "1h": 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
      };
      const cutoff = now - (ranges[timeRange] || 0);
      filtered = filtered.filter((log) => new Date(log.ts).getTime() >= cutoff);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          JSON.stringify(log.meta || {}).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [logs, searchQuery, levelFilter, timeRange]);

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
        <h3 className="font-semibold text-sm">Server Logs ({filteredLogs.length})</h3>
        <div className="flex items-center gap-2">
          <Button onClick={onDownload} size="sm" variant="outline">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={onClear} size="sm" variant="outline" className="text-red-600">
            <TrashIcon className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
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
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="INFO">INFO</SelectItem>
            <SelectItem value="WARN">WARN</SelectItem>
            <SelectItem value="ERROR">ERROR</SelectItem>
            <SelectItem value="DEBUG">DEBUG</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="5m">Last 5m</SelectItem>
            <SelectItem value="1h">Last 1h</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="auto-scroll"
          checked={autoScroll}
          onCheckedChange={setAutoScroll}
        />
        <Label htmlFor="auto-scroll" className="text-xs cursor-pointer">
          Auto-scroll
        </Label>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No logs found</p>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={clsx("text-xs", levelColors[log.level])}
                    >
                      {log.level}
                    </Badge>
                    <span className="text-gray-500">
                      {dayjs(log.ts).format("MMM D, HH:mm:ss")}
                    </span>
                  </div>
                  <p className="text-gray-900 break-words">{log.message}</p>
                </div>
                {log.meta && (
                  <button
                    onClick={() => toggleExpand(log.id)}
                    className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
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
              {expandedLogs.has(log.id) && log.meta && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded overflow-auto">
                    {JSON.stringify(log.meta, null, 2)}
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

