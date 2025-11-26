import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { useCardDetails } from "@/hooks/useCardDetails";
import { useExecutionSimulator } from "@/hooks/useExecutionSimulator";
import { useFlowStore } from "@/stores/flowStore";
import { clsx } from "clsx";
import { useState } from "react";

interface CardActionsBarProps {
  node: Node<NodeData>;
  isRunning: boolean;
  onCopyOutput: () => void;
}

export const CardActionsBar = ({
  node,
  isRunning,
  onCopyOutput,
}: CardActionsBarProps) => {
  const { executionData, getMockResponse } = useCardDetails(node.id);
  const { runStepOnly } = useExecutionSimulator();
  const { saveTemplate, nodes } = useFlowStore();
  const [localIsRunning, setLocalIsRunning] = useState(false);

  const handleRunStep = async () => {
    setLocalIsRunning(true);
    try {
      await runStepOnly(node.id);
    } finally {
      setLocalIsRunning(false);
    }
  };

  const handleRetry = async () => {
    // Retry logic handled by CardRetriesSection
    await runStepOnly(node.id);
  };

  const handleSaveAsTemplate = () => {
    const templateName = prompt("Enter template name:");
    if (!templateName) return;

    saveTemplate({
      name: templateName,
      description: `Template from ${node.data.title}`,
      category: "Custom",
      nodes: [node],
      edges: [],
      timeSaved: "Custom",
    });
    alert("Template saved!");
  };

  const handleApplyToAll = () => {
    const sameFunctionNodes = nodes.filter(
      (n) => n.data.functionName === node.data.functionName && n.id !== node.id
    );
    
    if (sameFunctionNodes.length === 0) {
      alert("No other nodes with the same function found.");
      return;
    }

    if (
      confirm(
        `Apply parameters to ${sameFunctionNodes.length} other node(s) with the same function?`
      )
    ) {
      sameFunctionNodes.forEach((n) => {
        useFlowStore.getState().updateNode(n.id, {
          params: node.data.params,
        });
      });
      alert("Parameters applied to all matching nodes!");
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-2 flex-wrap">
      <Button
        onClick={handleRunStep}
        size="sm"
        disabled={isRunning || localIsRunning}
        className="bg-gradient-to-r from-primary to-electric-glow"
        aria-label="Run step"
      >
        <PlayIcon className={clsx("w-4 h-4 mr-1", (isRunning || localIsRunning) && "animate-spin")} />
        {(isRunning || localIsRunning) ? "Running..." : "Run Step"}
      </Button>

      {executionData?.status === "error" && (
        <Button
          onClick={handleRetry}
          size="sm"
          variant="outline"
          disabled={isRunning}
          aria-label="Retry failed step"
        >
          <ArrowPathIcon className="w-4 h-4 mr-1" />
          Retry Failed
        </Button>
      )}

      {(executionData?.mockResponse || node.data.mockResponse || getMockResponse(node)) && (
        <Button
          onClick={() => {
            const output = executionData?.mockResponse || node.data.mockResponse || getMockResponse(node);
            navigator.clipboard.writeText(JSON.stringify(output, null, 2));
            onCopyOutput();
          }}
          size="sm"
          variant="outline"
          aria-label="Copy output"
        >
          <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
          Copy Output
        </Button>
      )}

      <Button
        onClick={handleSaveAsTemplate}
        size="sm"
        variant="outline"
        aria-label="Save as template"
      >
        <DocumentTextIcon className="w-4 h-4 mr-1" />
        Save as Template
      </Button>

      <Button
        onClick={handleApplyToAll}
        size="sm"
        variant="outline"
        aria-label="Apply to all"
      >
        <ArrowUpTrayIcon className="w-4 h-4 mr-1" />
        Apply to All
      </Button>
    </div>
  );
};

