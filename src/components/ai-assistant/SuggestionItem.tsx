import { useState } from "react";
import { Suggestion } from "@/data/mockTaskSpecs";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/stores/flowStore";
import { CheckCircleIcon, EyeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface SuggestionItemProps {
  suggestion: Suggestion;
}

export const SuggestionItem = ({ suggestion }: SuggestionItemProps) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const { nodes, edges, applyMutation, saveHistory } = useFlowStore();

  const handlePreview = () => {
    setIsPreviewing(!isPreviewing);
    // Highlight affected nodes on canvas
    if (!isPreviewing) {
      // Pulse animation for affected nodes
      suggestion.affectedNodeIds.forEach((nodeId) => {
        const node = document.querySelector(`[data-id="${nodeId}"]`);
        if (node) {
          node.classList.add("animate-pulse");
          setTimeout(() => {
            node.classList.remove("animate-pulse");
          }, 2000);
        }
      });
    }
  };

  const handleApply = () => {
    if (suggestion.preview) {
      applyMutation(suggestion.preview.nodes, suggestion.preview.edges);
      saveHistory();
      // Show success toast (simplified)
      alert("Suggestion applied successfully!");
    } else {
      // Generate preview on the fly for suggestions without preview
      alert("This suggestion requires manual implementation. Preview not available.");
    }
  };

  return (
    <div
      className={clsx(
        "border border-gray-200 rounded-lg p-3 transition-all",
        isPreviewing && "ring-2 ring-blue-400",
        "hover:shadow-md"
      )}
      onMouseEnter={() => {
        // Highlight affected nodes on hover
        suggestion.affectedNodeIds.forEach((nodeId) => {
          const node = document.querySelector(`[data-id="${nodeId}"]`);
          if (node) {
            (node as HTMLElement).style.opacity = "0.7";
          }
        });
      }}
      onMouseLeave={() => {
        suggestion.affectedNodeIds.forEach((nodeId) => {
          const node = document.querySelector(`[data-id="${nodeId}"]`);
          if (node) {
            (node as HTMLElement).style.opacity = "1";
          }
        });
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-900 mb-1">{suggestion.title}</h4>
          <p className="text-xs text-gray-600 mb-2">{suggestion.explanation}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
              {suggestion.impact}
            </span>
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <InformationCircleIcon className="w-3 h-3" />
              Why?
            </button>
          </div>
          {showWhy && suggestion.rule && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700 border border-blue-200">
              <strong>Rule:</strong> {suggestion.rule}
            </div>
          )}
        </div>
      </div>

      {isPreviewing && suggestion.preview && (
        <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-1">Preview Changes:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Nodes: {suggestion.preview.nodes.length} (current: {nodes.length})</div>
            <div>Edges: {suggestion.preview.edges.length} (current: {edges.length})</div>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">View diff</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-32">
                {JSON.stringify(suggestion.preview, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <Button
          onClick={handlePreview}
          size="sm"
          variant="outline"
          className="flex-1"
          aria-label={`Preview suggestion: ${suggestion.title}`}
        >
          <EyeIcon className="w-3 h-3 mr-1" />
          Preview
        </Button>
        <Button
          onClick={handleApply}
          size="sm"
          className="flex-1"
          aria-label={`Apply suggestion: ${suggestion.title}`}
        >
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Apply
        </Button>
      </div>
    </div>
  );
};

