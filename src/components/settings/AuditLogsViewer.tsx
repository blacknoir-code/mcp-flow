import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuditStore } from "@/stores/auditStore";
import { ChevronDownIcon, ChevronUpIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { clsx } from "clsx";

const levelColors = {
  workflow: "bg-blue-100 text-blue-700",
  integration: "bg-green-100 text-green-700",
  token: "bg-purple-100 text-purple-700",
  settings: "bg-gray-100 text-gray-700",
  billing: "bg-yellow-100 text-yellow-700",
  ai: "bg-pink-100 text-pink-700",
};

export const AuditLogsViewer = () => {
  const store = useAuditStore();
  const { filters, setFilters, queryLogs, exportLogs } = store;
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  
  // Safely get filtered logs
  let filteredLogs: typeof store.logs = [];
  try {
    filteredLogs = queryLogs();
  } catch (error) {
    console.error("Error querying logs:", error);
    filteredLogs = store.logs || [];
  }

  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const handleExport = (format: "json" | "csv") => {
    const data = exportLogs(format);
    const blob = new Blob([data], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${dayjs().format("YYYY-MM-DD")}.${format}`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Audit Logs ({filteredLogs.length})</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleExport("json")}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport("csv")}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Search logs..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.eventType || ""}
            onValueChange={(value) => setFilters({ eventType: value || "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="token">Token</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="ai">AI</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.user || ""}
            onValueChange={(value) => setFilters({ user: value || "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Users</SelectItem>
              <SelectItem value="alice">Alice</SelectItem>
              <SelectItem value="bob">Bob</SelectItem>
              <SelectItem value="charlie">Charlie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No logs found</p>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={clsx("text-xs", levelColors[log.eventType as keyof typeof levelColors] || "bg-gray-100")}
                    >
                      {log.eventType}
                    </Badge>
                    <span className="font-medium">{log.action}</span>
                    {log.resource && (
                      <span className="text-sm text-gray-500">
                        on {log.resource}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{log.user} ({log.userEmail})</span>
                    <span>{dayjs(log.timestamp).format("MMM D, YYYY HH:mm:ss")}</span>
                    {log.ipAddress && <span>{log.ipAddress}</span>}
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(log.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {expandedLogs.has(log.id) ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {expandedLogs.has(log.id) && (
                <div className="mt-2 pt-2 border-t">
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

