import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRegenerateStore } from "@/stores/regenerateStore";
import { useRegenerateAI } from "@/hooks/useRegenerateAI";
import { useFlowStore } from "@/stores/flowStore";
import { IntentEditor } from "./IntentEditor";
import { AIPreviewPanel } from "./AIPreviewPanel";
import { AIRewriteSuggestions } from "./AIRewriteSuggestions";
import { AINodeDiffView } from "./AINodeDiffView";
import { ApplyChangesFooter } from "./ApplyChangesFooter";
import { HistoryTimeline } from "./HistoryTimeline";
import { clsx } from "clsx";

interface RegenerateWithAIDrawerProps {
  onClose: () => void;
}

export const RegenerateWithAIDrawer = ({ onClose }: RegenerateWithAIDrawerProps) => {
  const { intentDraft, setIntentDraft, setRewrittenFlow, setSuggestions, setDiff, reset } = useRegenerateStore();
  const { nodes, edges } = useFlowStore();
  const { generateAIRewrite, computeDiff } = useRegenerateAI();
  const [activeTab, setActiveTab] = useState<"intent" | "preview" | "suggestions" | "diff" | "history">("intent");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleParse = (spec: any) => {
    // Generate rewrite suggestions
    const result = generateAIRewrite(intentDraft, nodes, edges);
    setSuggestions(result.suggestions);
    setRewrittenFlow(result);
    
    // Compute diff
    const diff = computeDiff({ nodes, edges }, result);
    setDiff(diff);
  };

  const tabs = [
    { id: "intent" as const, label: "Intent" },
    { id: "preview" as const, label: "AI Preview" },
    { id: "suggestions" as const, label: "Suggestions" },
    { id: "diff" as const, label: "Diff" },
    { id: "history" as const, label: "History" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-[100] flex flex-col"
        style={{ maxHeight: '100vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 id="drawer-title" className="text-lg font-bold text-gray-900">
            Modify Workflow With AI
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
            aria-label="Close drawer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 px-4 overflow-x-auto bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative",
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "intent" && <IntentEditor onParse={handleParse} />}
          {activeTab === "preview" && <AIPreviewPanel />}
          {activeTab === "suggestions" && <AIRewriteSuggestions />}
          {activeTab === "diff" && <AINodeDiffView />}
          {activeTab === "history" && <HistoryTimeline />}
        </div>

        {/* Footer */}
        {activeTab !== "history" && <ApplyChangesFooter onClose={onClose} />}
      </div>
    </>
  );
};

