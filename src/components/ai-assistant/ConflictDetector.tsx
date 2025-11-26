import { Conflict } from "@/data/mockTaskSpecs";
import { useFlowStore } from "@/stores/flowStore";
import { ExclamationTriangleIcon, XCircleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

interface ConflictDetectorProps {
  conflicts: Conflict[];
}

export const ConflictDetector = ({ conflicts }: ConflictDetectorProps) => {
  const { nodes, updateNode, deleteEdge, edges } = useFlowStore();

  const handleResolve = (conflict: Conflict) => {
    if (!conflict.resolveAction) return;

    switch (conflict.resolveAction.type) {
      case "auto_fill":
        conflict.affectedNodeIds.forEach((nodeId) => {
          const node = nodes.find((n) => n.id === nodeId);
          if (node && conflict.resolveAction?.value) {
            updateNode(nodeId, {
              params: { ...node.data.params, ...conflict.resolveAction.value },
            });
          }
        });
        alert("Conflict resolved: Parameters auto-filled");
        break;

      case "remove_edge":
        const edgeToRemove = edges.find(
          (e) =>
            conflict.affectedNodeIds.includes(e.source) ||
            conflict.affectedNodeIds.includes(e.target)
        );
        if (edgeToRemove) {
          deleteEdge(edgeToRemove.id);
          alert("Conflict resolved: Broken edge removed");
        }
        break;

      case "add_converter":
        alert("Converter node addition requires manual implementation");
        break;
    }
  };

  const errors = conflicts.filter((c) => c.severity === "error");
  const warnings = conflicts.filter((c) => c.severity === "warning");

  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
        <XCircleIcon className="w-4 h-4 text-red-600" />
        Conflicts & Validation
      </h3>
      <div className="space-y-2">
        {errors.map((conflict) => (
          <div
            key={conflict.id}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-2 mb-2">
              <XCircleIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">{conflict.message}</p>
                <p className="text-xs text-red-700 mt-1">
                  Affected: {conflict.affectedNodeIds.length} node(s)
                </p>
              </div>
            </div>
            {conflict.resolveAction && (
              <Button
                onClick={() => handleResolve(conflict)}
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                aria-label={`Resolve conflict: ${conflict.message}`}
              >
                <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
                Resolve
              </Button>
            )}
          </div>
        ))}

        {warnings.map((conflict) => (
          <div
            key={conflict.id}
            className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
          >
            <div className="flex items-start gap-2 mb-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">{conflict.message}</p>
                <p className="text-xs text-orange-700 mt-1">
                  Affected: {conflict.affectedNodeIds.length} node(s)
                </p>
              </div>
            </div>
            {conflict.resolveAction && (
              <Button
                onClick={() => handleResolve(conflict)}
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                aria-label={`Resolve warning: ${conflict.message}`}
              >
                <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
                Resolve
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

