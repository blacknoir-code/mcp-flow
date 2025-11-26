import { useEffect } from "react";
import { Canvas } from "@/components/workflow/Canvas";
import { AIAssistantSidebar } from "@/components/ai-assistant/AIAssistantSidebar";
import { NodeEditorPanel } from "@/components/workflow/NodeEditorPanel";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useFlowStore } from "@/stores/flowStore";

interface WorkflowCanvasContainerProps {
  workflowId: string;
}

export const WorkflowCanvasContainer = ({ workflowId }: WorkflowCanvasContainerProps) => {
  const workflow = useWorkflowStore((state) => state.getWorkflow(workflowId));
  const { setNodes, setEdges, selectedNodeId, updateCanvas } = useFlowStore();
  const { updateCanvas: updateWorkflowCanvas } = useWorkflowStore();

  // Load workflow canvas into flowStore
  useEffect(() => {
    if (workflow) {
      setNodes(workflow.canvas.nodes);
      setEdges(workflow.canvas.edges);
    }
  }, [workflow, setNodes, setEdges]);

  // Sync flowStore changes back to workflowStore
  useEffect(() => {
    if (workflow) {
      const { nodes, edges } = useFlowStore.getState();
      if (nodes.length > 0 || edges.length > 0) {
        updateWorkflowCanvas(workflowId, nodes, edges);
      }
    }
  }, [workflowId, workflow, updateWorkflowCanvas]);

  if (!workflow) return null;

  return (
    <div className="flex-1 flex overflow-hidden relative" style={{ minHeight: 0 }}>
      <div className="flex-1 relative" style={{ minWidth: 0, overflow: "hidden" }}>
        <Canvas />
      </div>
      
      {selectedNodeId && <NodeEditorPanel />}
      
      <AIAssistantSidebar />
    </div>
  );
};

