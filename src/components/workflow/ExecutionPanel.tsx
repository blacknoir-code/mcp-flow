import { useState, useEffect } from "react";
import { useFlowStore } from "@/stores/flowStore";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface ExecutionLog {
  nodeId: string;
  nodeTitle: string;
  status: "running" | "success" | "error";
  startTime?: Date;
  endTime?: Date;
  mockResponse?: any;
  error?: string;
}

export const ExecutionPanel = () => {
  const { nodes } = useFlowStore();
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  useEffect(() => {
    const executionLogs: ExecutionLog[] = nodes
      .filter((node) => node.data.status !== "idle" && node.data.status !== "pending")
      .map((node) => ({
        nodeId: node.id,
        nodeTitle: node.data.title,
        status: node.data.status === "success" ? "success" : node.data.status === "error" ? "error" : "running",
        mockResponse: node.data.mockResponse,
        error: node.data.error,
      }));

    setLogs(executionLogs);
  }, [nodes]);

  if (logs.length === 0) {
    return (
      <div className="h-64 bg-white border-t border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Execution Logs</h3>
        <p className="text-sm text-gray-500">No execution logs yet. Run a workflow to see logs.</p>
      </div>
    );
  }

  return (
    <div className="h-64 bg-white border-t border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Execution Logs</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.map((log, idx) => (
          <ExecutionLogItem key={log.nodeId} log={log} index={idx} />
        ))}
      </div>
    </div>
  );
};

const ExecutionLogItem = ({ log, index }: { log: ExecutionLog; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  const statusIcon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    running: ClockIcon,
  }[log.status];

  const statusColor = {
    success: "text-green-600",
    error: "text-red-600",
    running: "text-blue-600 animate-pulse",
  }[log.status];

  const Icon = statusIcon;

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <Icon className={clsx("w-5 h-5 mt-0.5", statusColor)} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{log.nodeTitle}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                {log.startTime && ` • ${log.startTime.toLocaleTimeString()}`}
              </p>
            </div>
            {log.mockResponse && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {expanded ? "Hide" : "Show"} Response
              </button>
            )}
          </div>

          {log.error && (
            <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 border border-red-200">
              {log.error}
            </div>
          )}

          {expanded && log.mockResponse && (
            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(log.mockResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

