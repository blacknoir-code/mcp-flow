import { useState, useEffect } from "react";
import { useFlowStore } from "@/stores/flowStore";
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { TaskGraphView } from "./TaskGraphView";
import { SuggestionsList } from "./SuggestionsList";
import { ConflictDetector } from "./ConflictDetector";
import { NLCommandEditor } from "./NLCommandEditor";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export const AIAssistantSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNLEditor, setShowNLEditor] = useState(false);
  const { taskSpec: storeTaskSpec, nodes, edges } = useFlowStore();
  
  // Force render - always show
  console.log('AIAssistantSidebar rendering', { isExpanded, nodesCount: nodes.length, width: '384px' });
  
  // Debug: Log to ensure component is rendering
  useEffect(() => {
    console.log('AIAssistantSidebar rendered', { isExpanded, nodesCount: nodes.length });
  }, [isExpanded, nodes.length]);
  const {
    taskSpec: parsedSpec,
    suggestions,
    conflicts,
    parseIntentText,
    generateSuggestions,
    detectConflicts,
  } = useAiAssistant();

  // Parse task spec from store if available
  const currentTaskSpec = parsedSpec || (storeTaskSpec ? parseIntentText(storeTaskSpec) : null);

  useEffect(() => {
    if (currentTaskSpec && nodes.length > 0) {
      generateSuggestions(currentTaskSpec, nodes, edges);
      detectConflicts(nodes, edges);
    }
  }, [currentTaskSpec, nodes, edges, generateSuggestions, detectConflicts]);

  if (!isExpanded) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4 flex-shrink-0 z-10">
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-gray-100 rounded"
          aria-label="Expand AI Assistant"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div className="mt-4">
          <SparklesIcon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white border-l-4 border-blue-600 shadow-2xl flex flex-col flex-shrink-0"
      style={{ 
        height: '100%',
        width: '384px',
        minWidth: '384px',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 100,
        boxShadow: '-4px 0 12px rgba(0,0,0,0.15)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">Mock AI v0.1</span>
          {currentTaskSpec && (
            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
              {currentTaskSpec.confidence}%
            </span>
          )}
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Collapse sidebar"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Interpretation Summary */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-gray-900">Interpretation</h3>
            <button
              onClick={() => setShowNLEditor(!showNLEditor)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {showNLEditor ? "Hide" : "Edit Intent"}
            </button>
          </div>

          {showNLEditor ? (
            <NLCommandEditor onClose={() => setShowNLEditor(false)} />
          ) : (
            currentTaskSpec && (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Detected Apps</p>
                  <div className="flex flex-wrap gap-1">
                    {currentTaskSpec.detectedApps.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Operations</p>
                  <div className="flex flex-wrap gap-1">
                    {currentTaskSpec.operations.map((op) => (
                      <span
                        key={op}
                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs"
                      >
                        {op}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {currentTaskSpec.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {currentTaskSpec.constraints.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Constraints</p>
                    <div className="flex flex-wrap gap-1">
                      {currentTaskSpec.constraints.map((constraint) => (
                        <span
                          key={constraint}
                          className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs"
                        >
                          {constraint}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {!currentTaskSpec && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4" />
              <span>Generate a workflow to see interpretation</span>
            </div>
          )}
        </div>

        {/* Task Graph View */}
        <div className="border-b border-gray-200">
          <TaskGraphView />
        </div>

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <div className="border-b border-gray-200">
            <ConflictDetector conflicts={conflicts} />
          </div>
        )}

        {/* Suggestions */}
        <div>
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>

      {/* ARIA live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {suggestions.length > 0 && `${suggestions.length} suggestions available`}
        {conflicts.length > 0 && `${conflicts.length} conflicts detected`}
      </div>
    </div>
  );
};

