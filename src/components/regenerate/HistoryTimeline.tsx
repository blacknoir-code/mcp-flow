import { Button } from "@/components/ui/button";
import { EyeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useRegenerateStore } from "@/stores/regenerateStore";
import { useFlowStore } from "@/stores/flowStore";
import { useWorkflowStore } from "@/stores/workflowStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

dayjs.extend(relativeTime);

export const HistoryTimeline = () => {
  const { history } = useRegenerateStore();
  const { setNodes, setEdges } = useFlowStore();
  const [viewingDiff, setViewingDiff] = useState<string | null>(null);

  const handleViewDiff = (entryId: string) => {
    setViewingDiff(viewingDiff === entryId ? null : entryId);
  };

  const handleRestore = (entry: any) => {
    if (confirm("Restore this version? This will replace the current workflow.")) {
      setNodes(entry.nodes);
      setEdges(entry.edges);
      
      // Update workflowStore if workflow is open
      const { currentWorkflowId, addVersion } = useWorkflowStore.getState();
      if (currentWorkflowId) {
        addVersion(currentWorkflowId, "version_restore", `Restored from regenerate history: ${entry.summary}`);
      }
    }
  };

  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No regenerate history</p>
        <p className="text-xs mt-1">History will appear here after you regenerate workflows</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="font-semibold text-sm mb-4">Regenerate History</h3>
      <div className="space-y-3">
        {history.map((entry, idx) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">
                    {dayjs(entry.timestamp).format("MMM D, YYYY HH:mm")}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({dayjs(entry.timestamp).fromNow()})
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">{entry.summary}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{entry.intent}</p>
              </div>
            </div>

            {viewingDiff === entry.id && entry.diff && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-green-600">
                    +{entry.diff.summary?.nodesAdded || 0} added
                  </div>
                  <div className="text-red-600">
                    -{entry.diff.summary?.nodesRemoved || 0} removed
                  </div>
                  <div className="text-yellow-600">
                    ~{entry.diff.summary?.nodesModified || 0} modified
                  </div>
                  <div className="text-gray-600">
                    {entry.nodes.length} total nodes
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <Button
                onClick={() => handleViewDiff(entry.id)}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                {viewingDiff === entry.id ? "Hide" : "View"} Diff
              </Button>
              <Button
                onClick={() => handleRestore(entry)}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
                Restore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

