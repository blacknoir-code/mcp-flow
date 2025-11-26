import { useEffect, useRef } from "react";
import { NodeExecutionRow } from "./NodeExecutionRow";
import { useExecutionStore } from "@/stores/executionStore";
import { useFlowStore } from "@/stores/flowStore";
import { useExecutionSimulator } from "@/hooks/useExecutionSimulator";

export const TimelineView = () => {
  const { currentRun, selectedNodeId, selectNode, getFilteredRuns } = useExecutionStore();
  const { focusNode } = useFlowStore();
  const { runStepOnly, retryFailedStep } = useExecutionSimulator();
  const timelineRef = useRef<HTMLDivElement>(null);

  const runs = getFilteredRuns();
  const activeRun = currentRun || runs[0];

  useEffect(() => {
    if (selectedNodeId && timelineRef.current) {
      const element = document.querySelector(`[data-node-id="${selectedNodeId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedNodeId]);

  if (!activeRun) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No execution history</p>
        <p className="text-sm mt-2">Run a workflow to see the timeline</p>
      </div>
    );
  }

  const filteredNodes = activeRun.nodes.filter((node) => {
    const { filter } = useExecutionStore.getState();
    if (filter === "all") return true;
    if (filter === "errors") return node.status === "error";
    if (filter === "success") return node.status === "success";
    return true;
  });

  return (
    <div ref={timelineRef} className="space-y-3 p-4">
      {filteredNodes.map((execution, index) => (
        <div
          key={execution.nodeId}
          data-node-id={execution.nodeId}
          className="relative"
        >
          {/* Timeline connector */}
          {index < filteredNodes.length - 1 && (
            <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
          )}

          <NodeExecutionRow
            execution={execution}
            isSelected={selectedNodeId === execution.nodeId}
            onSelect={() => selectNode(execution.nodeId)}
            onRunStep={() => runStepOnly(execution.nodeId)}
            onRetry={() => activeRun.runId && retryFailedStep(activeRun.runId, execution.nodeId)}
            onFocus={() => focusNode(execution.nodeId)}
          />
        </div>
      ))}
    </div>
  );
};

