import { Suggestion } from "@/data/mockTaskSpecs";
import { SuggestionItem } from "./SuggestionItem";

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

export const SuggestionsList = ({ suggestions }: SuggestionsListProps) => {
  if (suggestions.length === 0) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Suggestions</h3>
        <p className="text-xs text-gray-500">No suggestions available. Generate a workflow to see AI suggestions.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm text-gray-900 mb-3">Suggestions & Actions</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <SuggestionItem key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
};

