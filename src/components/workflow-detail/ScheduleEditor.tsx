import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkflowSchedule } from "@/stores/workflowStore";
import dayjs from "dayjs";

interface ScheduleEditorProps {
  schedule: WorkflowSchedule;
  onUpdate: (schedule: Partial<WorkflowSchedule>) => void;
}

export const ScheduleEditor = ({ schedule, onUpdate }: ScheduleEditorProps) => {
  const [localSchedule, setLocalSchedule] = useState(schedule);

  useEffect(() => {
    setLocalSchedule(schedule);
  }, [schedule]);

  const handleChange = (updates: Partial<WorkflowSchedule>) => {
    const updated = { ...localSchedule, ...updates };
    setLocalSchedule(updated);
    onUpdate(updated);
  };

  const nextRunPreview = localSchedule.nextRun
    ? dayjs(localSchedule.nextRun).format("MMM D, YYYY [at] h:mm A")
    : "Not scheduled";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Enable Schedule</Label>
          <p className="text-sm text-gray-500 mt-1">
            Automatically run this workflow on a schedule
          </p>
        </div>
        <Switch
          checked={localSchedule.enabled}
          onCheckedChange={(checked) => handleChange({ enabled: checked })}
        />
      </div>

      {localSchedule.enabled && (
        <>
          <div>
            <Label>Frequency</Label>
            <Select
              value={localSchedule.frequency}
              onValueChange={(value: any) => handleChange({ frequency: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hourly">Every 1 hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="cron">Custom (CRON)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localSchedule.frequency === "daily" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hour</Label>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={localSchedule.hour || 9}
                  onChange={(e) => handleChange({ hour: parseInt(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Minute</Label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={localSchedule.minute || 0}
                  onChange={(e) => handleChange({ minute: parseInt(e.target.value) })}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {localSchedule.frequency === "weekly" && (
            <div className="space-y-4">
              <div>
                <Label>Day of Week</Label>
                <Select
                  value={String(localSchedule.dayOfWeek || 1)}
                  onValueChange={(value) => handleChange({ dayOfWeek: parseInt(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                    <SelectItem value="0">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hour</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={localSchedule.hour || 9}
                    onChange={(e) => handleChange({ hour: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Minute</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={localSchedule.minute || 0}
                    onChange={(e) => handleChange({ minute: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {localSchedule.frequency === "cron" && (
            <div>
              <Label>CRON Expression</Label>
              <Input
                value={localSchedule.cronExpression || ""}
                onChange={(e) => handleChange({ cronExpression: e.target.value })}
                placeholder="0 9 * * *"
                className="mt-2 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: minute hour day month day-of-week
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">Next Run</p>
            <p className="text-sm text-blue-700 mt-1">{nextRunPreview}</p>
          </div>
        </>
      )}
    </div>
  );
};

