import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useFlowStore } from "@/stores/flowStore";
import { WorkflowHeader } from "@/components/workflow-detail/WorkflowHeader";
import { WorkflowMetaBar } from "@/components/workflow-detail/WorkflowMetaBar";
import { WorkflowTabs } from "@/components/workflow-detail/WorkflowTabs";
import { WorkflowCanvasContainer } from "@/components/workflow-detail/WorkflowCanvasContainer";
import { WorkflowRunHistory } from "@/components/workflow-detail/WorkflowRunHistory";
import { WorkflowSettings } from "@/components/workflow-detail/WorkflowSettings";
import { WorkflowVersionHistory } from "@/components/workflow-detail/WorkflowVersionHistory";
import { WorkflowActivityFeed } from "@/components/workflow-detail/WorkflowActivityFeed";

const WorkflowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("canvas");
  
  const workflow = useWorkflowStore((state) => id ? state.getWorkflow(id) : undefined);
  const { setCurrentWorkflow } = useWorkflowStore();
  const { nodes, edges, updateCanvas } = useFlowStore();

  useEffect(() => {
    if (id) {
      setCurrentWorkflow(id);
    }
    return () => setCurrentWorkflow(null);
  }, [id, setCurrentWorkflow]);

  // Sync flowStore changes to workflowStore
  useEffect(() => {
    if (workflow && (nodes.length > 0 || edges.length > 0)) {
      const { updateCanvas: updateWorkflowCanvas } = useWorkflowStore.getState();
      updateWorkflowCanvas(id!, nodes, edges);
    }
  }, [id, workflow, nodes, edges]);

  if (!id) {
    navigate("/");
    return null;
  }

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow Not Found</h2>
          <p className="text-gray-600 mb-4">The workflow you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ height: '100vh', overflow: 'hidden' }}>
      <WorkflowHeader workflowId={id} />
      <WorkflowMetaBar workflowId={id} />

      <WorkflowTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "canvas" && (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1">
              <WorkflowCanvasContainer workflowId={id} />
            </div>
            <WorkflowActivityFeed workflowId={id} />
          </div>
        )}

        {activeTab === "runs" && (
          <WorkflowRunHistory workflowName={workflow.name} />
        )}

        {activeTab === "settings" && (
          <WorkflowSettings workflowId={id} />
        )}

        {activeTab === "versions" && (
          <WorkflowVersionHistory workflowId={id} />
        )}
      </WorkflowTabs>
    </div>
  );
};

export default WorkflowDetailPage;

