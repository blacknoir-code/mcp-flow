import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlayIcon } from "@heroicons/react/24/outline";
import { Integration, IntegrationTrigger } from "@/data/mockIntegrations";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TriggerTogglesProps {
  integration: Integration;
  onToggleTrigger: (triggerId: string, enabled: boolean) => void;
  onUpdateConfig: (triggerId: string, config: Record<string, any>) => void;
  onTestTrigger: (triggerId: string) => void;
}

export const TriggerToggles = ({
  integration,
  onToggleTrigger,
  onUpdateConfig,
  onTestTrigger,
}: TriggerTogglesProps) => {
  const [editingTrigger, setEditingTrigger] = useState<IntegrationTrigger | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  const handleEdit = (trigger: IntegrationTrigger) => {
    setEditingTrigger(trigger);
    setConfigValues(trigger.config);
  };

  const handleSaveConfig = () => {
    if (editingTrigger) {
      onUpdateConfig(editingTrigger.id, configValues);
      setEditingTrigger(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-sm">Triggers</h3>

      <div className="space-y-3">
        {integration.triggers.map((trigger) => (
          <div
            key={trigger.id}
            className="p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{trigger.name}</h4>
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={(checked) => onToggleTrigger(trigger.id, checked)}
                  />
                </div>
                {trigger.requiredParams && (
                  <div className="text-xs text-gray-500 mb-2">
                    Required: {trigger.requiredParams.join(", ")}
                  </div>
                )}
                {trigger.lastFiredAt && (
                  <div className="text-xs text-gray-500">
                    Last fired: {dayjs(trigger.lastFiredAt).fromNow()}
                  </div>
                )}
              </div>
            </div>

            {trigger.enabled && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                {trigger.requiredParams?.map((param) => (
                  <div key={param}>
                    <Label className="text-xs">{param}</Label>
                    <Input
                      value={trigger.config[param] || ""}
                      onChange={(e) =>
                        setConfigValues({ ...configValues, [param]: e.target.value })
                      }
                      onBlur={() => onUpdateConfig(trigger.id, { ...trigger.config, ...configValues })}
                      placeholder={`Enter ${param}`}
                      className="mt-1 text-xs"
                    />
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleEdit(trigger)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Configure
                  </Button>
                  <Button
                    onClick={() => onTestTrigger(trigger.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <PlayIcon className="w-4 h-4 mr-1" />
                    Test Trigger
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingTrigger && (
        <Dialog open={!!editingTrigger} onOpenChange={() => setEditingTrigger(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure {editingTrigger.name}</DialogTitle>
              <DialogDescription>Set trigger parameters</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              {editingTrigger.requiredParams?.map((param) => (
                <div key={param}>
                  <Label>{param}</Label>
                  <Input
                    value={configValues[param] || ""}
                    onChange={(e) =>
                      setConfigValues({ ...configValues, [param]: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-3">
                <Button onClick={handleSaveConfig} className="flex-1">
                  Save
                </Button>
                <Button
                  onClick={() => setEditingTrigger(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

