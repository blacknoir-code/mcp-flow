import { useEffect, useState } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { CardHeader } from "./CardHeader";
import { CardInputsSection } from "./CardInputsSection";
import { CardOutputsSection } from "./CardOutputsSection";
import { CardSchemaSection } from "./CardSchemaSection";
import { CardLogsSection } from "./CardLogsSection";
import { CardRetriesSection } from "./CardRetriesSection";
import { CardMetricsSection } from "./CardMetricsSection";
import { CardActionsBar } from "./CardActionsBar";
import { useFlowStore } from "@/stores/flowStore";
import { useExecutionStore } from "@/stores/executionStore";
import { clsx } from "clsx";

interface CardDetailsDrawerProps {
  nodeId: string | null;
  onClose: () => void;
}

export const CardDetailsDrawer = ({ nodeId, onClose }: CardDetailsDrawerProps) => {
  const node = useFlowStore((state) => (nodeId ? state.getNodeById(nodeId) : undefined));
  const { isRunning, currentRun } = useExecutionStore();
  const { deleteNode, duplicateNode, updateNode } = useFlowStore();
  const [activeTab, setActiveTab] = useState<"inputs" | "outputs" | "schema" | "logs" | "retries" | "metrics">("inputs");

  const nodeIsRunning = currentRun?.nodes.some((n) => n.nodeId === nodeId && n.status === "running") || false;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (nodeId) {
      // Focus trap - focus first focusable element
      const drawer = document.querySelector('[data-drawer]');
      if (drawer) {
        const firstFocusable = drawer.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        firstFocusable?.focus();
      }
    }
  }, [nodeId]);

  if (!node || !nodeId) return null;

  const handleDuplicate = () => {
    duplicateNode(nodeId);
  };

  const handleDelete = () => {
    if (confirm(`Delete node "${node.data.title}"?`)) {
      deleteNode(nodeId);
      onClose();
    }
  };

  const handleExport = () => {
    const data = {
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${node.data.title.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyOutput = () => {
    const { useCardDetails } = require("@/hooks/useCardDetails");
    // This will be called from CardActionsBar which has access to the hook
    // For now, use node data directly
    const output = node.data.mockResponse || { success: true, data: "No output available" };
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
  };

  const tabs = [
    { id: "inputs" as const, label: "Inputs" },
    { id: "outputs" as const, label: "Outputs" },
    { id: "schema" as const, label: "Schema" },
    { id: "logs" as const, label: "Logs" },
    { id: "retries" as const, label: "Retries" },
    { id: "metrics" as const, label: "Metrics" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        data-drawer
        className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl z-[100] flex flex-col"
        style={{ maxHeight: '100vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <CardHeader
          node={node}
          onClose={onClose}
          onRunStep={() => {
            // This will be handled by CardActionsBar
          }}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onExport={handleExport}
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "inputs" && <CardInputsSection node={node} />}
          {activeTab === "outputs" && <CardOutputsSection node={node} />}
          {activeTab === "schema" && <CardSchemaSection node={node} />}
          {activeTab === "logs" && <CardLogsSection node={node} />}
          {activeTab === "retries" && <CardRetriesSection node={node} />}
          {activeTab === "metrics" && <CardMetricsSection node={node} />}
        </div>

        {/* Actions Bar */}
        <CardActionsBar
          node={node}
          isRunning={nodeIsRunning}
          onCopyOutput={handleCopyOutput}
        />
      </div>
    </>
  );
};

