import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/stores/flowStore";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";

export const RightSidebarAI = () => {
  const { taskSpec, nodes, edges, applyAiSuggestion, taskSpec: spec } = useFlowStore();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);

  const mockAiRegenerate = (intent: string, currentNodes: Node<NodeData>[], currentEdges: Edge[]) => {
    const lowerIntent = intent.toLowerCase();
    const newNodes = [...currentNodes];
    let newEdges = [...currentEdges];
    const detectedApps: string[] = [];
    const operations: string[] = [];
    const changes: string[] = [];

    // Detect apps
    if (lowerIntent.includes("gmail")) detectedApps.push("Gmail");
    if (lowerIntent.includes("jira")) detectedApps.push("Jira");
    if (lowerIntent.includes("slack")) detectedApps.push("Slack");

    // Detect operations
    if (lowerIntent.includes("get") || lowerIntent.includes("fetch")) operations.push("Fetch data");
    if (lowerIntent.includes("update") || lowerIntent.includes("modify")) operations.push("Update records");
    if (lowerIntent.includes("post") || lowerIntent.includes("send")) operations.push("Send notification");
    if (lowerIntent.includes("extract")) operations.push("Extract information");

    // Generate suggestions
    if (lowerIntent.includes("assigned to me")) {
      // Insert filter node
      const filterNode: Node<NodeData> = {
        id: `filter-${Date.now()}`,
        type: "cardNode",
        position: { x: 300, y: 100 },
        data: {
          title: "Filter by Assignee",
          app: "Internal",
          functionName: "filter",
          params: { field: "assignee", value: "me" },
          status: "idle",
        },
      };
      newNodes.splice(2, 0, filterNode);
      changes.push("Added filter node for 'assigned to me'");
    }

    if (lowerIntent.includes("summary") && !newNodes.some((n) => n.data.title.includes("Summarize"))) {
      const summaryNode: Node<NodeData> = {
        id: `summary-${Date.now()}`,
        type: "cardNode",
        position: { x: 900, y: 0 },
        data: {
          title: "Generate Summary",
          app: "Internal",
          functionName: "summarize",
          params: { mode: "concise" },
          status: "idle",
        },
      };
      newNodes.push(summaryNode);
      changes.push("Added summarization step");
    }

    // Merge duplicate transforms
    const transformNodes = newNodes.filter((n) => n.data.app === "Internal" && n.data.functionName === "extractPattern");
    if (transformNodes.length > 1) {
      // Keep first, remove others
      const toRemove = transformNodes.slice(1);
      toRemove.forEach((node) => {
        const index = newNodes.findIndex((n) => n.id === node.id);
        if (index > -1) {
          newNodes.splice(index, 1);
          newEdges = newEdges.filter((e) => e.source !== node.id && e.target !== node.id);
        }
      });
      changes.push("Merged duplicate transform nodes");
    }

    // Reconnect edges
    const updatedEdges: Edge[] = [];
    for (let i = 0; i < newNodes.length - 1; i++) {
      updatedEdges.push({
        id: `e${newNodes[i].id}-${newNodes[i + 1].id}`,
        source: newNodes[i].id,
        target: newNodes[i + 1].id,
        type: "smoothstep",
      });
    }

    return {
      nodes: newNodes,
      edges: updatedEdges,
      detectedApps,
      operations,
      changes,
      confidence: 85 + Math.floor(Math.random() * 10),
    };
  };

  const handleRegenerate = () => {
    if (!spec) return;
    const result = mockAiRegenerate(spec, nodes, edges);
    setSuggestions(result.changes);
    setConfidence(result.confidence);
    // Store suggestion for apply
    (window as any).pendingSuggestion = result;
  };

  const handleApplySuggestion = () => {
    const suggestion = (window as any).pendingSuggestion;
    if (suggestion) {
      applyAiSuggestion(suggestion.nodes, suggestion.edges);
      setSuggestions([]);
      setConfidence(null);
      (window as any).pendingSuggestion = null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>

        {taskSpec && (
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-2">Understanding:</p>
              <p className="text-gray-900">{taskSpec}</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-700 mb-1">Detected Apps:</p>
              <div className="flex flex-wrap gap-1">
                {["Gmail", "Jira", "Slack"].map((app) => (
                  <span key={app} className="px-2 py-1 bg-white rounded text-xs text-blue-700">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {confidence !== null && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-green-700">Confidence</span>
              <span className="text-sm font-bold text-green-700">{confidence}%</span>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">SUGGESTIONS</p>
            <div className="space-y-2">
              {suggestions.map((change, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200"
                >
                  {change}
                </div>
              ))}
            </div>
          </div>
        )}

        {!suggestions.length && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 mb-2">SUGGESTIONS</p>
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
              No suggestions yet. Click "Regenerate Workflow" to get AI suggestions.
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button onClick={handleRegenerate} className="w-full" variant="outline">
          Regenerate Workflow (Mock AI)
        </Button>
        {suggestions.length > 0 && (
          <Button onClick={handleApplySuggestion} className="w-full">
            Apply Suggestion
          </Button>
        )}
      </div>
    </div>
  );
};

