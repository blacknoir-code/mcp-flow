import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PlayIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useExecutionSimulator } from "@/hooks/useExecutionSimulator";
import { useNavigate } from "react-router-dom";

interface WorkflowHeaderProps {
  workflowId: string;
}

const appIcons: Record<string, any> = {
  Gmail: EnvelopeIcon,
  Jira: CheckCircleIcon,
  Slack: ChatBubbleLeftRightIcon,
};

export const WorkflowHeader = ({ workflowId }: WorkflowHeaderProps) => {
  const navigate = useNavigate();
  const workflow = useWorkflowStore((state) => state.getWorkflow(workflowId));
  const { setWorkflowName, setWorkflowDescription, duplicateWorkflow } = useWorkflowStore();
  const { runWorkflow } = useExecutionSimulator();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");

  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description);
    }
  }, [workflow]);

  if (!workflow) return null;

  const handleNameSave = () => {
    if (name.trim() && name !== workflow.name) {
      setWorkflowName(workflowId, name);
    }
    setIsEditingName(false);
  };

  const handleDescSave = () => {
    if (description !== workflow.description) {
      setWorkflowDescription(workflowId, description);
    }
    setIsEditingDesc(false);
  };

  const handleRun = () => {
    runWorkflow(workflow.name);
  };

  const handleDuplicate = () => {
    const newId = duplicateWorkflow(workflowId);
    navigate(`/workflow/${newId}`);
  };

  const handleExport = () => {
    const data = {
      name: workflow.name,
      description: workflow.description,
      canvas: workflow.canvas,
      schedule: workflow.schedule,
      triggers: workflow.triggers,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    alert("Share functionality (mock): Workflow link copied to clipboard!");
    navigator.clipboard.writeText(`${window.location.origin}/workflow/${workflowId}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditingName ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave();
                if (e.key === "Escape") {
                  setName(workflow.name);
                  setIsEditingName(false);
                }
              }}
              className="text-2xl font-bold mb-2"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditingName(true)}
            >
              {workflow.name}
            </h1>
          )}

          {isEditingDesc ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescSave}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setDescription(workflow.description);
                  setIsEditingDesc(false);
                }
              }}
              className="text-gray-600 mb-2"
              placeholder="Add a description..."
              autoFocus
            />
          ) : (
            <p
              className="text-gray-600 mb-2 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditingDesc(true)}
            >
              {workflow.description || "Click to add description"}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {workflow.metadata.connectedApps.map((app) => {
              const Icon = appIcons[app] || CheckCircleIcon;
              return (
                <div key={app} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                  <Icon className="w-3 h-3" />
                  <span>{app}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button onClick={handleRun} size="sm" className="bg-gradient-to-r from-primary to-electric-glow">
            <PlayIcon className="w-4 h-4 mr-2" />
            Run Workflow
          </Button>
          <Button onClick={handleDuplicate} size="sm" variant="outline">
            <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button onClick={handleExport} size="sm" variant="outline">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleShare} size="sm" variant="outline">
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

