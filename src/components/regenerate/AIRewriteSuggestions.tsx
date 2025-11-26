import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useRegenerateStore } from "@/stores/regenerateStore";
import { useRegenerateAI } from "@/hooks/useRegenerateAI";
import { useFlowStore } from "@/stores/flowStore";
import { RewriteSuggestion } from "@/data/mockRewriteRules";
import { clsx } from "clsx";

export const AIRewriteSuggestions = () => {
  const { suggestions, rewrittenFlow, setRewrittenFlow, intentDraft } = useRegenerateStore();
  const { nodes, edges } = useFlowStore();
  const { generateAIRewrite } = useRegenerateAI();
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handlePreview = (suggestion: RewriteSuggestion) => {
    setPreviewingId(suggestion.id);
    // Generate rewrite with this suggestion applied
    const result = generateAIRewrite(intentDraft, nodes, edges);
    setRewrittenFlow(result);
  };

  const handleApplySuggestion = (suggestion: RewriteSuggestion) => {
    // Regenerate with this suggestion
    const result = generateAIRewrite(intentDraft, nodes, edges);
    setRewrittenFlow(result);
    setPreviewingId(null);
  };

  const handleRegenerateAll = () => {
    const result = generateAIRewrite(intentDraft, nodes, edges);
    setRewrittenFlow(result);
    useRegenerateStore.getState().setSuggestions(result.suggestions);
  };

  if (suggestions.length === 0 && !rewrittenFlow) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">AI Suggestions</h3>
          <Button onClick={handleRegenerateAll} size="sm" variant="outline">
            Generate Suggestions
          </Button>
        </div>
        <p className="text-sm text-gray-500 text-center py-8">
          Click "Generate Suggestions" to see AI-powered improvements
        </p>
      </div>
    );
  }

  const displaySuggestions = suggestions.length > 0 ? suggestions : [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">AI Suggestions</h3>
        <Button onClick={handleRegenerateAll} size="sm" variant="outline">
          Regenerate
        </Button>
      </div>

      <div className="space-y-3">
        {displaySuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={clsx(
              "border rounded-lg p-4 transition-colors",
              previewingId === suggestion.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <Badge
                    variant={
                      suggestion.type === "add"
                        ? "default"
                        : suggestion.type === "remove"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {suggestion.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{suggestion.explanation}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button
                onClick={() => handlePreview(suggestion)}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                onClick={() => handleApplySuggestion(suggestion)}
                size="sm"
                variant="default"
                className="flex-1"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        ))}
      </div>

      {displaySuggestions.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No suggestions available. Try modifying your intent.
        </p>
      )}
    </div>
  );
};

