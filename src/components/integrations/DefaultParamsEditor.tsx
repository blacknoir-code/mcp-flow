import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Integration } from "@/data/mockIntegrations";

interface DefaultParamsEditorProps {
  integration: Integration;
  onUpdateParam: (key: string, value: any) => void;
}

const paramDefinitions: Record<string, { label: string; type: "text" | "select"; options?: string[] }> = {
  defaultEmailLabel: { label: "Default Email Label", type: "text" },
  defaultUnreadOnly: { label: "Unread Only", type: "select", options: ["true", "false"] },
  defaultJiraProject: { label: "Default Jira Project", type: "text" },
  defaultAssignee: { label: "Default Assignee", type: "text" },
  defaultSlackChannel: { label: "Default Slack Channel", type: "text" },
};

export const DefaultParamsEditor = ({
  integration,
  onUpdateParam,
}: DefaultParamsEditorProps) => {
  const [localParams, setLocalParams] = useState(integration.defaultParams);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: any) => {
    setLocalParams((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    Object.entries(localParams).forEach(([key, value]) => {
      if (value !== integration.defaultParams[key]) {
        onUpdateParam(key, value);
      }
    });
    setHasChanges(false);
  };

  const getRelevantParams = () => {
    if (integration.provider === "gmail") {
      return ["defaultEmailLabel", "defaultUnreadOnly"];
    } else if (integration.provider === "jira") {
      return ["defaultJiraProject", "defaultAssignee"];
    } else if (integration.provider === "slack") {
      return ["defaultSlackChannel"];
    }
    return [];
  };

  const relevantParams = getRelevantParams();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-sm">Default Parameters</h3>
      <p className="text-xs text-gray-500">
        These defaults are used when generating workflows or creating nodes
      </p>

      <div className="space-y-3">
        {relevantParams.map((key) => {
          const def = paramDefinitions[key];
          if (!def) return null;

          return (
            <div key={key}>
              <Label className="text-xs">{def.label}</Label>
              {def.type === "select" ? (
                <Select
                  value={String(localParams[key] || "")}
                  onValueChange={(value) => handleChange(key, value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {def.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={localParams[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="mt-1"
                  placeholder={`Enter ${def.label.toLowerCase()}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {hasChanges && (
        <Button onClick={handleSave} size="sm" className="w-full">
          <CheckIcon className="w-4 h-4 mr-2" />
          Save Defaults
        </Button>
      )}
    </div>
  );
};

