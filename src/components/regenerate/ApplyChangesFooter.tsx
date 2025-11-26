import { Button } from "@/components/ui/button";
import { CheckIcon, XMarkIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useRegenerateStore } from "@/stores/regenerateStore";
import { useFlowStore } from "@/stores/flowStore";
import { useWorkflowStore } from "@/stores/workflowStore";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ApplyChangesFooterProps {
  onClose: () => void;
}

export const ApplyChangesFooter = ({ onClose }: ApplyChangesFooterProps) => {
  const { rewrittenFlow, diff, intentDraft, addToHistory, reset, closeDrawer } = useRegenerateStore();
  const { setNodes, setEdges, nodes, edges } = useFlowStore();
  const { addVersion, addActivity } = useWorkflowStore();
  const { currentWorkflowId } = useWorkflowStore();

  const hasRemovedNodes = (diff?.summary?.nodesRemoved || 0) > 0;
  const hasChanges = rewrittenFlow !== null;

  const handleApply = () => {
    if (!rewrittenFlow) return;

    // Save to history
    addToHistory({
      intent: intentDraft,
      summary: `AI regenerate: ${diff?.summary?.nodesAdded || 0} added, ${diff?.summary?.nodesRemoved || 0} removed, ${diff?.summary?.nodesModified || 0} modified`,
      nodes: rewrittenFlow.nodes,
      edges: rewrittenFlow.edges,
      diff,
    });

    // Update flowStore
    setNodes(rewrittenFlow.nodes);
    setEdges(rewrittenFlow.edges);

    // Create version in workflowStore if workflow is open
    if (currentWorkflowId) {
      addVersion(
        currentWorkflowId,
        "ai_regenerate",
        `AI regenerate: ${diff?.summary?.nodesAdded || 0} added, ${diff?.summary?.nodesRemoved || 0} removed`
      );
      addActivity(currentWorkflowId, {
        type: "workflow_regenerated",
        description: `Workflow regenerated via AI: ${intentDraft.slice(0, 50)}...`,
      });
    }

    // Reset and close
    reset();
    closeDrawer();
    onClose();
  };

  const handleSaveAsVersion = () => {
    if (!rewrittenFlow || !currentWorkflowId) return;

    addToHistory({
      intent: intentDraft,
      summary: `Saved as version: ${diff?.summary?.nodesAdded || 0} added, ${diff?.summary?.nodesRemoved || 0} removed`,
      nodes: rewrittenFlow.nodes,
      edges: rewrittenFlow.edges,
      diff,
    });

    addVersion(
      currentWorkflowId,
      "ai_regenerate",
      `AI regenerate (saved as version): ${intentDraft.slice(0, 50)}...`
    );

    reset();
    closeDrawer();
    onClose();
  };

  const handleCancel = () => {
    reset();
    closeDrawer();
    onClose();
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
      {hasRemovedNodes && (
        <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
          <ExclamationTriangleIcon className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-orange-700">
            <strong>Warning:</strong> This will remove {diff?.summary?.nodesRemoved} node(s). Make sure this is intended.
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          onClick={handleApply}
          disabled={!hasChanges}
          className="flex-1 bg-gradient-to-r from-primary to-electric-glow"
        >
          <CheckIcon className="w-4 h-4 mr-2" />
          Apply Changes
        </Button>

        {currentWorkflowId && (
          <Button
            onClick={handleSaveAsVersion}
            disabled={!hasChanges}
            variant="outline"
            className="flex-1"
          >
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Save as Version
          </Button>
        )}

        <Button onClick={handleCancel} variant="outline">
          <XMarkIcon className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

