import { useState, useEffect } from "react";
import { useFlowStore } from "@/stores/flowStore";
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApplyConfirmationModal } from "./ApplyConfirmationModal";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";

interface NLCommandEditorProps {
  onClose: () => void;
}

export const NLCommandEditor = ({ onClose }: NLCommandEditorProps) => {
  const { taskSpec: originalTaskSpec, setTaskSpec } = useFlowStore();
  const { parseIntentText, mockRegenerate } = useAiAssistant();
  const [intent, setIntent] = useState(originalTaskSpec || "");
  const [parsedSpec, setParsedSpec] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [regeneratedFlow, setRegeneratedFlow] = useState<any>(null);

  useEffect(() => {
    if (intent.trim()) {
      const spec = parseIntentText(intent);
      setParsedSpec(spec);
    }
  }, [intent, parseIntentText]);

  const handleRegenerate = () => {
    const storeState = useFlowStore.getState();
    const result = mockRegenerate(intent, storeState.nodes, storeState.edges);
    setRegeneratedFlow(result);
    setShowPreview(true);
  };

  const handleApply = () => {
    if (regeneratedFlow) {
      setShowApplyModal(true);
    } else {
      // Just update the task spec
      setTaskSpec(intent);
      onClose();
    }
  };

  const handleConfirmApply = () => {
    if (regeneratedFlow) {
      const storeState = useFlowStore.getState();
      storeState.applyMutation(regeneratedFlow.nodes, regeneratedFlow.edges);
      setTaskSpec(intent);
      storeState.saveHistory();
      setShowApplyModal(false);
      onClose();
      alert("Changes applied successfully!");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-gray-900">Edit Intent</h4>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="Close editor"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      <Textarea
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="Describe what you want to automate..."
        className="min-h-[100px] text-sm"
        aria-label="Natural language command input"
      />

      {parsedSpec && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-2">Parsed Intent:</p>
          <div className="space-y-1 text-xs text-blue-700">
            <div>Apps: {parsedSpec.detectedApps.join(", ") || "None"}</div>
            <div>Operations: {parsedSpec.operations.join(", ") || "None"}</div>
            <div>Confidence: {parsedSpec.confidence}%</div>
          </div>
        </div>
      )}

      {showPreview && regeneratedFlow && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-900 mb-2">Preview Changes:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Nodes: {regeneratedFlow.nodes.length}</div>
            <div>Edges: {regeneratedFlow.edges.length}</div>
            <div>Confidence: {regeneratedFlow.confidence}%</div>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">View full diff</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(regeneratedFlow, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          onClick={handleRegenerate}
          size="sm"
          variant="outline"
          className="flex-1"
          aria-label="Regenerate workflow"
        >
          <ArrowPathIcon className="w-3 h-3 mr-1" />
          Regenerate
        </Button>
        <Button
          onClick={handleApply}
          size="sm"
          className="flex-1"
          disabled={!intent.trim()}
          aria-label="Apply changes"
        >
          Apply Changes
        </Button>
        <Button
          onClick={onClose}
          size="sm"
          variant="ghost"
          aria-label="Cancel"
        >
          Cancel
        </Button>
      </div>

      {showApplyModal && regeneratedFlow && (
        <ApplyConfirmationModal
          open={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          onConfirm={handleConfirmApply}
          preview={regeneratedFlow}
        />
      )}
    </div>
  );
};

