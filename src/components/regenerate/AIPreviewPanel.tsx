import { useRegenerateStore } from "@/stores/regenerateStore";
import { Badge } from "@/components/ui/badge";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const appIcons: Record<string, any> = {
  Gmail: EnvelopeIcon,
  Jira: CheckCircleIcon,
  Slack: ChatBubbleLeftRightIcon,
  Notion: DocumentTextIcon,
};

export const AIPreviewPanel = () => {
  const { parsedSpec } = useRegenerateStore();

  if (!parsedSpec) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">Parse intent to see AI interpretation</p>
      </div>
    );
  }

  const stepExamples = [
    parsedSpec.apps.includes("Gmail") && "Step 1: Fetch unread Gmail",
    parsedSpec.entities.includes("ticket_ids") && "Step 2: Extract Jira ticket IDs",
    parsedSpec.apps.includes("Jira") && parsedSpec.operations.includes("update") && "Step 3: Update Jira tickets",
    parsedSpec.entities.includes("summary") && "Step 4: Summarize updates",
    parsedSpec.apps.includes("Slack") && "Step 5: Post to Slack",
  ].filter(Boolean);

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm mb-4">AI Interpretation</h3>

      <div>
        <h4 className="text-xs font-medium text-gray-500 mb-2">Detected Apps</h4>
        <div className="flex flex-wrap gap-2">
          {parsedSpec.apps.length > 0 ? (
            parsedSpec.apps.map((app) => {
              const Icon = appIcons[app] || DocumentTextIcon;
              return (
                <Badge key={app} variant="outline" className="flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  {app}
                </Badge>
              );
            })
          ) : (
            <span className="text-xs text-gray-400">No apps detected</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-gray-500 mb-2">Operations</h4>
        <div className="flex flex-wrap gap-2">
          {parsedSpec.operations.length > 0 ? (
            parsedSpec.operations.map((op) => (
              <Badge key={op} variant="secondary">
                {op}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400">No operations detected</span>
          )}
        </div>
      </div>

      {parsedSpec.conditions.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Conditions</h4>
          <div className="flex flex-wrap gap-2">
            {parsedSpec.conditions.map((condition) => (
              <Badge key={condition} variant="outline" className="bg-yellow-50">
                {condition.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {parsedSpec.entities.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Entities</h4>
          <div className="flex flex-wrap gap-2">
            {parsedSpec.entities.map((entity) => (
              <Badge key={entity} variant="outline">
                {entity.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Proposed Steps</h4>
        <div className="space-y-2">
          {stepExamples.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                {idx + 1}
              </div>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

