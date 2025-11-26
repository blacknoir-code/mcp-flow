import { useEffect, useState } from "react";
import { Canvas } from "@/components/workflow/Canvas";
import { TopBar } from "@/components/workflow/TopBar";
import { Toolbar } from "@/components/workflow/Toolbar";
import { NodeEditorPanel } from "@/components/workflow/NodeEditorPanel";
import { ExecutionPanel } from "@/components/execution/ExecutionPanel";
import { TemplatesStrip } from "@/components/workflow/TemplatesStrip";
import { AIAssistantSidebar } from "@/components/ai-assistant/AIAssistantSidebar";
import { AddCardPanel } from "@/components/addCard/AddCardPanel";
import { useFlowStore } from "@/stores/flowStore";

const WorkflowCanvas = () => {
  const { nodes, deleteNode, duplicateNode, selectedNodeId, setSelectedNodeId, undo, redo } = useFlowStore();
  const [showTemplates, setShowTemplates] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for command palette (simplified - just show templates)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowTemplates(!showTemplates);
      }

      // Delete key
      if (e.key === "Delete" && selectedNodeId) {
        deleteNode(selectedNodeId);
        setSelectedNodeId(null);
      }

      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, deleteNode, setSelectedNodeId, undo, redo, showTemplates]);

  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;

    switch (action) {
      case "edit":
        setSelectedNodeId(contextMenu.nodeId);
        break;
      case "duplicate":
        duplicateNode(contextMenu.nodeId);
        break;
      case "delete":
        deleteNode(contextMenu.nodeId);
        break;
    }
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col bg-gray-100" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar />
      {showTemplates && <TemplatesStrip />}
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0, display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div className="flex-1 relative" style={{ minWidth: 0, overflow: 'hidden' }}>
          <Canvas />
        </div>
        
        {selectedNodeId && (
          <NodeEditorPanel />
        )}
        
        <AIAssistantSidebar />
      </div>
      
      <ExecutionPanel />
      
      <AddCardPanel />

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => handleContextMenuAction("edit")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => handleContextMenuAction("duplicate")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Duplicate
          </button>
          <button
            onClick={() => handleContextMenuAction("delete")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;
