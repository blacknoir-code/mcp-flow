import { useState, useMemo } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon, DocumentDuplicateIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useCardDetails } from "@/hooks/useCardDetails";
// Using simple pre tag for JSON display
import dayjs from "dayjs";

interface CardLogsSectionProps {
  node: Node<NodeData>;
}

export const CardLogsSection = ({ node }: CardLogsSectionProps) => {
  const { executionData } = useCardDetails(node.id);
  const [activeTab, setActiveTab] = useState<"response" | "logs" | "errors">("response");
  const [searchQuery, setSearchQuery] = useState("");

  const logs = useMemo(() => {
    if (!executionData?.events) return [];
    return executionData.events
      .filter((e) => e.type === "node_log" || e.type === "node_error")
      .filter((e) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          e.log?.toLowerCase().includes(query) ||
          e.error?.toLowerCase().includes(query)
        );
      });
  }, [executionData, searchQuery]);

  const errors = useMemo(() => {
    if (!executionData?.events) return [];
    return executionData.events.filter((e) => e.type === "node_error");
  }, [executionData]);

  const handleCopyError = () => {
    const errorText = errors.map((e) => e.error || "").join("\n");
    navigator.clipboard.writeText(errorText);
  };

  const handleReport = () => {
    alert("Error reporting (mock): Error details would be sent to support team.");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("response")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "response"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Response
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "logs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveTab("errors")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "errors"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Errors {errors.length > 0 && `(${errors.length})`}
          </button>
        </div>
      </div>

      {activeTab === "response" && (
        <div>
          {executionData?.mockResponse ? (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="text-green-400 p-4 text-xs overflow-auto m-0">
                {JSON.stringify(executionData.mockResponse, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No response data available</p>
              <p className="text-xs mt-1">Run the node to see response</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No logs available</p>
            ) : (
              logs.map((event, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-xs">
                      {event.timestamp ? dayjs(event.timestamp).format("HH:mm:ss") : ""}
                    </span>
                    <span
                      className={
                        event.type === "node_error" ? "text-red-600" : "text-gray-700"
                      }
                    >
                      {event.log || event.error}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "errors" && (
        <div className="space-y-4">
          {errors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No errors</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button onClick={handleCopyError} size="sm" variant="outline">
                  <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                  Copy Error
                </Button>
                <Button onClick={handleReport} size="sm" variant="outline">
                  Report
                </Button>
              </div>
              {errors.map((event, idx) => (
                <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-red-900 mb-1">
                        Error {idx + 1}
                      </div>
                      <div className="text-sm text-red-700">{event.error}</div>
                      {event.timestamp && (
                        <div className="text-xs text-red-600 mt-1">
                          {dayjs(event.timestamp).format("MMM D, YYYY HH:mm:ss")}
                        </div>
                      )}
                    </div>
                  </div>
                  {event.data?.stacktrace && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer">
                        View Stacktrace
                      </summary>
                      <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                        {event.data.stacktrace}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

