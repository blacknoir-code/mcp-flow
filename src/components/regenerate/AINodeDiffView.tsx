import { useRegenerateStore } from "@/stores/regenerateStore";
import { useFlowStore } from "@/stores/flowStore";
import { useRegenerateAI } from "@/hooks/useRegenerateAI";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, MinusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { clsx } from "clsx";

export const AINodeDiffView = () => {
  const { rewrittenFlow, diff, setDiff } = useRegenerateStore();
  const { nodes, edges } = useFlowStore();
  const { computeDiff } = useRegenerateAI();
  const [showJson, setShowJson] = useState(false);

  // Compute diff if not already computed
  if (!diff && rewrittenFlow) {
    const computedDiff = computeDiff({ nodes, edges }, rewrittenFlow);
    setDiff(computedDiff);
  }

  const currentDiff = diff || {};

  if (!rewrittenFlow) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">Generate suggestions to see diff</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Changes Preview</h3>
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {showJson ? "View Summary" : "View JSON Diff"}
        </button>
      </div>

      {showJson ? (
        <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-green-400 text-xs">
            {JSON.stringify(currentDiff, null, 2)}
          </pre>
        </div>
      ) : (
        <>
          {/* Summary */}
          {currentDiff.summary && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="text-xs text-green-600">Added</div>
                <div className="text-lg font-bold text-green-700">
                  {currentDiff.summary.nodesAdded || 0} nodes
                </div>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <div className="text-xs text-red-600">Removed</div>
                <div className="text-lg font-bold text-red-700">
                  {currentDiff.summary.nodesRemoved || 0} nodes
                </div>
              </div>
              <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="text-xs text-yellow-600">Modified</div>
                <div className="text-lg font-bold text-yellow-700">
                  {currentDiff.summary.nodesModified || 0} nodes
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="text-xs text-blue-600">Edges</div>
                <div className="text-lg font-bold text-blue-700">
                  +{currentDiff.summary.edgesAdded || 0} / -{currentDiff.summary.edgesRemoved || 0}
                </div>
              </div>
            </div>
          )}

          {/* Added Nodes */}
          {currentDiff.addedNodes && currentDiff.addedNodes.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                <PlusIcon className="w-4 h-4" />
                Added Nodes ({currentDiff.addedNodes.length})
              </h4>
              <div className="space-y-2">
                {currentDiff.addedNodes.map((node: any) => (
                  <div
                    key={node.id}
                    className="p-2 bg-green-50 border border-green-200 rounded text-sm"
                  >
                    <div className="font-medium">{node.data.title}</div>
                    <div className="text-xs text-gray-600">{node.data.app}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed Nodes */}
          {currentDiff.removedNodes && currentDiff.removedNodes.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                <MinusIcon className="w-4 h-4" />
                Removed Nodes ({currentDiff.removedNodes.length})
              </h4>
              <div className="space-y-2">
                {currentDiff.removedNodes.map((node: any) => (
                  <div
                    key={node.id}
                    className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                  >
                    <div className="font-medium">{node.data.title}</div>
                    <div className="text-xs text-gray-600">{node.data.app}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modified Nodes */}
          {currentDiff.changedNodes && currentDiff.changedNodes.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-yellow-700 mb-2 flex items-center gap-1">
                <PencilIcon className="w-4 h-4" />
                Modified Nodes ({currentDiff.changedNodes.length})
              </h4>
              <div className="space-y-2">
                {currentDiff.changedNodes.map((change: any) => (
                  <div
                    key={change.nodeId}
                    className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
                  >
                    <div className="font-medium">{change.new.title}</div>
                    {change.paramDiffs && change.paramDiffs.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        Changed params: {change.paramDiffs.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edges */}
          {(currentDiff.addedEdges?.length > 0 || currentDiff.removedEdges?.length > 0) && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Connections</h4>
              {currentDiff.addedEdges && currentDiff.addedEdges.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-green-600 mb-1">
                    +{currentDiff.addedEdges.length} connections added
                  </div>
                </div>
              )}
              {currentDiff.removedEdges && currentDiff.removedEdges.length > 0 && (
                <div>
                  <div className="text-xs text-red-600">
                    -{currentDiff.removedEdges.length} connections removed
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

