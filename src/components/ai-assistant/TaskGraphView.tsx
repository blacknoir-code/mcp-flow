import { useFlowStore } from "@/stores/flowStore";
import { NodeData } from "@/data/sampleNodes";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

const appIcons: Record<string, any> = {
  Gmail: EnvelopeIcon,
  Jira: CheckCircleIcon,
  Slack: ChatBubbleLeftRightIcon,
  Internal: DocumentTextIcon,
  AI: SparklesIcon,
};

export const TaskGraphView = () => {
  const { nodes, edges, focusNode } = useFlowStore();

  if (nodes.length === 0) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Task Graph</h3>
        <p className="text-xs text-gray-500">No nodes in workflow</p>
      </div>
    );
  }

  const handleNodeClick = (nodeId: string) => {
    focusNode(nodeId);
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm text-gray-900 mb-3">Task Graph</h3>
      <div className="space-y-2">
        {nodes.map((node, index) => {
          const Icon = appIcons[node.data.app] || DocumentTextIcon;
          const incomingEdges = edges.filter((e) => e.target === node.id);
          const outgoingEdges = edges.filter((e) => e.source === node.id);

          return (
            <div
              key={node.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleNodeClick(node.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNodeClick(node.id);
                }
              }}
              aria-label={`Node ${index + 1}: ${node.data.title}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {node.data.title}
                    </h4>
                    <span className="text-xs text-gray-400 ml-2">#{index + 1}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{node.data.app}</p>
                  {node.data.functionName && (
                    <p className="text-xs text-gray-400 mb-2">{node.data.functionName}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {incomingEdges.length > 0 && (
                      <span>← {incomingEdges.length} input{incomingEdges.length > 1 ? "s" : ""}</span>
                    )}
                    {outgoingEdges.length > 0 && (
                      <span>→ {outgoingEdges.length} output{outgoingEdges.length > 1 ? "s" : ""}</span>
                    )}
                  </div>
                  {Object.keys(node.data.params || {}).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Params: {Object.keys(node.data.params || {}).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini graph visualization */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-2">Flow</p>
        <div className="flex items-center gap-2 flex-wrap">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-700">{index + 1}</span>
              </div>
              {index < nodes.length - 1 && (
                <span className="text-gray-300">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

