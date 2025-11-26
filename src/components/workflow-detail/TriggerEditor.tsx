import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { WorkflowTrigger } from "@/stores/workflowStore";
import { v4 as uuidv4 } from "uuid";

interface TriggerEditorProps {
  triggers: WorkflowTrigger[];
  onUpdate: (triggers: WorkflowTrigger[]) => void;
}

const triggerTypes = [
  { value: "email", label: "When new email arrives", icon: "📧" },
  { value: "jira", label: "When Jira ticket is updated", icon: "✅" },
  { value: "slack", label: "When Slack message contains keyword", icon: "💬" },
  { value: "notion", label: "When Notion database row changes", icon: "📝" },
  { value: "webhook", label: "When API webhook received", icon: "🔗" },
];

export const TriggerEditor = ({ triggers, onUpdate }: TriggerEditorProps) => {
  const handleToggle = (triggerId: string) => {
    const updated = triggers.map((t) =>
      t.id === triggerId ? { ...t, enabled: !t.enabled } : t
    );
    onUpdate(updated);
  };

  const handleAdd = (type: string) => {
    const newTrigger: WorkflowTrigger = {
      id: uuidv4(),
      type: type as any,
      enabled: true,
      config: {},
    };
    onUpdate([...triggers, newTrigger]);
  };

  const handleRemove = (triggerId: string) => {
    onUpdate(triggers.filter((t) => t.id !== triggerId));
  };

  const handleConfigChange = (triggerId: string, key: string, value: any) => {
    const updated = triggers.map((t) =>
      t.id === triggerId
        ? { ...t, config: { ...t.config, [key]: value } }
        : t
    );
    onUpdate(updated);
  };

  const getTriggerConfigFields = (type: string) => {
    switch (type) {
      case "email":
        return [
          { key: "label", label: "Gmail Label", placeholder: "inbox" },
          { key: "unread", label: "Unread Only", type: "checkbox" },
        ];
      case "jira":
        return [
          { key: "project", label: "Jira Project", placeholder: "PROJ" },
          { key: "status", label: "Status Change", placeholder: "To Do → In Progress" },
        ];
      case "slack":
        return [
          { key: "channel", label: "Channel", placeholder: "#general" },
          { key: "keyword", label: "Keyword", placeholder: "urgent" },
        ];
      case "notion":
        return [
          { key: "database", label: "Database ID", placeholder: "abc123" },
          { key: "property", label: "Property", placeholder: "Status" },
        ];
      case "webhook":
        return [
          { key: "url", label: "Webhook URL", placeholder: "https://..." },
          { key: "secret", label: "Secret", placeholder: "webhook-secret", type: "password" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Triggers</Label>
        <p className="text-sm text-gray-500 mt-1">
          Configure when this workflow should automatically run
        </p>
      </div>

      <div className="space-y-3">
        {triggers.map((trigger) => {
          const triggerType = triggerTypes.find((t) => t.value === trigger.type);
          const configFields = getTriggerConfigFields(trigger.type);

          return (
            <div key={trigger.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{triggerType?.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{triggerType?.label}</div>
                    <div className="text-xs text-gray-500">{trigger.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={() => handleToggle(trigger.id)}
                  />
                  <Button
                    onClick={() => handleRemove(trigger.id)}
                    size="sm"
                    variant="ghost"
                    aria-label="Remove trigger"
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {trigger.enabled && configFields.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  {configFields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-xs">{field.label}</Label>
                      {field.type === "checkbox" ? (
                        <Switch
                          checked={trigger.config[field.key] || false}
                          onCheckedChange={(checked) =>
                            handleConfigChange(trigger.id, field.key, checked)
                          }
                          className="mt-1"
                        />
                      ) : (
                        <Input
                          type={field.type || "text"}
                          value={trigger.config[field.key] || ""}
                          onChange={(e) =>
                            handleConfigChange(trigger.id, field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Add Trigger</Label>
        <div className="flex flex-wrap gap-2">
          {triggerTypes
            .filter((t) => !triggers.some((tr) => tr.type === t.value))
            .map((type) => (
              <Button
                key={type.value}
                onClick={() => handleAdd(type.value)}
                size="sm"
                variant="outline"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                {type.label}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

