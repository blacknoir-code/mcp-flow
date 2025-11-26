import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useRegenerateStore } from "@/stores/regenerateStore";
import { useRegenerateAI } from "@/hooks/useRegenerateAI";
import { clsx } from "clsx";

interface IntentEditorProps {
  onParse: (spec: any) => void;
}

const keywords = [
  { word: "unread", color: "bg-blue-100 text-blue-700" },
  { word: "Jira", color: "bg-green-100 text-green-700" },
  { word: "Slack", color: "bg-purple-100 text-purple-700" },
  { word: "Gmail", color: "bg-red-100 text-red-700" },
  { word: "summary", color: "bg-yellow-100 text-yellow-700" },
  { word: "assigned to me", color: "bg-indigo-100 text-indigo-700" },
  { word: "urgent", color: "bg-orange-100 text-orange-700" },
  { word: "mention", color: "bg-pink-100 text-pink-700" },
];

export const IntentEditor = ({ onParse }: IntentEditorProps) => {
  const { intentDraft, setIntentDraft } = useRegenerateStore();
  const { parseIntent } = useRegenerateAI();
  const [highlightedText, setHighlightedText] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (intentDraft) {
      // Auto-save
      const timer = setTimeout(() => {
        // Auto-save is handled by store
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [intentDraft]);

  const handleParse = () => {
    const spec = parseIntent(intentDraft);
    onParse(spec);
    useRegenerateStore.getState().setParsedSpec(spec);
  };

  const highlightKeywords = (text: string) => {
    if (!text) return [];
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    const lowerText = text.toLowerCase();

    // Find all keyword matches
    const matches: Array<{ start: number; end: number; keyword: typeof keywords[0] }> = [];
    keywords.forEach((keyword) => {
      const lowerKeyword = keyword.word.toLowerCase();
      let index = lowerText.indexOf(lowerKeyword, lastIndex);
      while (index !== -1) {
        matches.push({
          start: index,
          end: index + keyword.word.length,
          keyword,
        });
        index = lowerText.indexOf(lowerKeyword, index + 1);
      }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Build highlighted parts
    matches.forEach((match, idx) => {
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>{text.substring(lastIndex, match.start)}</span>
        );
      }
      parts.push(
        <span key={`keyword-${idx}`} className={clsx("px-1 rounded", match.keyword.color)}>
          {text.substring(match.start, match.end)}
        </span>
      );
      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : [<span key="text">{text}</span>];
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-2">Natural Language Intent</h3>
        <p className="text-xs text-gray-500 mb-3">
          Describe what you want the workflow to do. Keywords will be highlighted automatically.
        </p>
        <Textarea
          value={intentDraft}
          onChange={(e) => setIntentDraft(e.target.value)}
          placeholder="Update Jira tickets mentioned in my unread Gmail and send summary to Slack"
          className="font-mono text-sm min-h-[120px]"
          rows={5}
        />
        {intentDraft && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <div className="flex flex-wrap gap-1">
              {highlightKeywords(intentDraft)}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleParse}
          disabled={!intentDraft.trim()}
          className="bg-gradient-to-r from-primary to-electric-glow"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          Parse Intent
        </Button>
        <span className="text-xs text-gray-500">
          {intentDraft.length} characters
        </span>
      </div>
    </div>
  );
};

