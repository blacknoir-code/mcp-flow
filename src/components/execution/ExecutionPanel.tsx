import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useExecutionStore } from "@/stores/executionStore";
import { useFlowStore } from "@/stores/flowStore";
import { useExecutionSimulator } from "@/hooks/useExecutionSimulator";
import { TimelineView } from "./TimelineView";
import { RunControls } from "./RunControls";
import { ExecutionFilterBar } from "./ExecutionFilterBar";
import { ExecutionBadge } from "./ExecutionBadge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const ExecutionPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"timeline" | "logs">("timeline");
  
  const {
    currentRun,
    isRunning,
    runs,
    selectedNodeId,
    selectNode,
  } = useExecutionStore();
  
  const { nodes } = useFlowStore();
  const { runWorkflow, runStepOnly, retryFailedStep, cancelRun } = useExecutionSimulator();

  const activeRun = currentRun || runs[0];
  const workflowName = activeRun?.workflowName || "Workflow";

  const handleRun = () => {
    runWorkflow(workflowName);
  };

  const handleRerun = () => {
    if (activeRun) {
      runWorkflow(workflowName);
    }
  };

  const handleRunStep = (nodeId: string) => {
    runStepOnly(nodeId);
  };

  const handleRetry = (runId: string, nodeId: string) => {
    retryFailedStep(runId, nodeId);
  };

  const handleCancel = () => {
    if (activeRun) {
      cancelRun(activeRun.runId);
    }
  };

  if (!isExpanded) {
    return (
      <div className="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ExecutionBadge
            status={activeRun?.status || "pending"}
            size="sm"
          />
          <span className="text-sm text-gray-600">
            {activeRun
              ? `${activeRun.summary.success}/${activeRun.summary.total} completed`
              : "No runs"}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="Expand execution panel"
        >
          <ChevronUpIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200 flex flex-col" style={{ height: '400px', maxHeight: '50vh' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Execution Timeline</h3>
          {activeRun && (
            <>
              <ExecutionBadge status={activeRun.status} size="sm" />
              <span className="text-xs text-gray-500">
                Run #{runs.length} • {dayjs(activeRun.startTime).format("HH:mm:ss")}
              </span>
              {activeRun.endTime && (
                <span className="text-xs text-gray-500">
                  Duration: {dayjs(activeRun.endTime).diff(dayjs(activeRun.startTime), "second")}s
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <RunControls
            onRun={handleRun}
            onRerun={handleRerun}
            onRunStep={handleRunStep}
            onRetry={handleRetry}
            onCancel={handleCancel}
            selectedNodeId={selectedNodeId}
            currentRunId={activeRun?.runId || null}
          />
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Collapse execution panel"
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "timeline"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "logs"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Logs
        </button>
      </div>

      {/* Filter Bar */}
      <ExecutionFilterBar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "timeline" ? (
          <TimelineView />
        ) : (
          <div className="p-4">
            {activeRun ? (
              <div className="space-y-2 font-mono text-xs">
                {activeRun.events.map((event, idx) => (
                  <div key={idx} className="text-gray-700">
                    <span className="text-gray-500">
                      [{dayjs(event.timestamp).format("HH:mm:ss")}]
                    </span>{" "}
                    {event.log && <span>{event.log}</span>}
                    {event.error && <span className="text-red-600">{event.error}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No logs available</p>
            )}
          </div>
        )}
      </div>

      {/* ARIA live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isRunning && "Workflow execution in progress"}
        {activeRun?.status === "success" && "Workflow execution completed successfully"}
        {activeRun?.status === "error" && "Workflow execution completed with errors"}
      </div>
    </div>
  );
};

