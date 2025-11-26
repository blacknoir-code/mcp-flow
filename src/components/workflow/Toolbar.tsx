import { useFlowStore } from "@/stores/flowStore";
import { useExecutionSimulator } from "@/hooks/useExecutionSimulator";
import { Button } from "@/components/ui/button";
import {
  Play,
  Save,
  Download,
  Upload,
  Undo2,
  Redo2,
  FileText,
  Plus,
} from "lucide-react";
import { useRef } from "react";
import { useAddCardStore } from "@/stores/addCardStore";

export const Toolbar = () => {
  const {
    saveTemplate,
    exportFlow,
    importFlow,
    undo,
    redo,
    nodes,
    edges,
    updateNode,
  } = useFlowStore();
  const { runWorkflow: executeWorkflow } = useExecutionSimulator();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openAddCard = useAddCardStore((state) => state.open);

  const handleSaveTemplate = () => {
    if (nodes.length === 0) {
      alert("Cannot save empty workflow");
      return;
    }
    const name = prompt("Enter template name:");
    if (!name) return;

    const description = prompt("Enter template description:") || "";
    saveTemplate({
      name,
      description,
      category: "Custom",
      nodes,
      edges,
      timeSaved: "Custom",
    });
    alert("Template saved!");
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      alert("Cannot export empty workflow");
      return;
    }
    const flow = exportFlow();
    const blob = new Blob([JSON.stringify(flow, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const flow = JSON.parse(event.target?.result as string);
        if (flow.nodes && flow.edges) {
          importFlow(flow.nodes, flow.edges);
          alert("Workflow imported successfully!");
        } else {
          alert("Invalid workflow file");
        }
      } catch (error) {
        alert("Error importing workflow");
      }
    };
    reader.readAsText(file);
  };

  const handleQuickFix = () => {
    // Auto-fill missing params
    nodes.forEach((node) => {
      const params = node.data.params || {};
      const updates: any = {};
      
      if (node.data.app === "Gmail" && !params.label) {
        updates.label = "inbox";
      }
      if (node.data.app === "Slack" && !params.channel) {
        updates.channel = "#general";
      }
      if (node.data.app === "Jira" && !params.project) {
        updates.project = "PROJ";
      }
      
      if (Object.keys(updates).length > 0) {
        updateNode(node.id, { params: { ...params, ...updates } });
      }
    });
    alert("Quick fix applied! Missing parameters have been filled with defaults.");
  };

  const handleRunWorkflow = () => {
    if (nodes.length === 0) {
      alert("Cannot run empty workflow");
      return;
    }

    // Validate nodes
    const invalidNodes = nodes.filter((node) => {
      const requiredParams = node.data.params || {};
      // Simple validation - check if critical params are missing
      if (node.data.app === "Gmail" && !requiredParams.label) {
        return true;
      }
      if (node.data.app === "Slack" && !requiredParams.channel) {
        return true;
      }
      return false;
    });

    if (invalidNodes.length > 0) {
      const nodeNames = invalidNodes.map((n) => n.data.title).join(", ");
      const shouldFix = confirm(
        `Some nodes are missing required parameters: ${nodeNames}.\n\nClick OK to apply quick fix, or Cancel to run anyway.`
      );
      if (shouldFix) {
        handleQuickFix();
      }
    }
    
    // Execute workflow
    executeWorkflow("Workflow");
  };

  return (
    <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center px-4 gap-2">
      <Button onClick={openAddCard} size="sm" variant="default">
        <Plus className="w-4 h-4 mr-2" />
        Add Card
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-2" />
      
      <Button onClick={handleRunWorkflow} size="sm" variant="default" disabled={nodes.length === 0}>
        <Play className="w-4 h-4 mr-2" />
        Run Workflow
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-2" />
      
      <Button onClick={handleSaveTemplate} size="sm" variant="outline">
        <Save className="w-4 h-4 mr-2" />
        Save as Template
      </Button>
      
      <Button onClick={handleExport} size="sm" variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      
      <Button onClick={handleImport} size="sm" variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="w-px h-6 bg-gray-300 mx-2" />
      
      <Button onClick={undo} size="sm" variant="ghost" title="Undo (Ctrl+Z)">
        <Undo2 className="w-4 h-4" />
      </Button>
      
      <Button onClick={redo} size="sm" variant="ghost" title="Redo (Ctrl+Shift+Z)">
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

