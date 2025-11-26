import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RunRecord, StepEvent } from "@/data/sampleRuns";
import { useRunReplay } from "@/hooks/useRunReplay";
import { useToastSystem } from "@/components/settings/ToastSystem";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReplayControlsProps {
  run: RunRecord | null;
  open: boolean;
  onClose: () => void;
  onReplayComplete: (newRunId: string) => void;
}

export const ReplayControls = ({
  run,
  open,
  onClose,
  onReplayComplete,
}: ReplayControlsProps) => {
  const { replayRun } = useRunReplay();
  const toast = useToastSystem();
  const [startStepId, setStartStepId] = useState<string>("");
  const [skipFailures, setSkipFailures] = useState(false);
  const [forceFail, setForceFail] = useState(false);
  const [paramOverrides, setParamOverrides] = useState<Record<string, string>>({});
  const [isReplaying, setIsReplaying] = useState(false);

  if (!run) return null;

  const handleReplay = async () => {
    setIsReplaying(true);
    try {
      const newRunId = await replayRun(
        run,
        {
          startStepId: startStepId || undefined,
          paramOverrides: Object.keys(paramOverrides).length > 0 ? paramOverrides : undefined,
          skipFailures,
          forceFail,
          onStart: (id) => {
            toast.showInfo(`Starting replay as run ${id.slice(0, 8)}...`);
          },
          onProgress: () => {
            // Progress updates handled by store
          },
          onComplete: (id) => {
            toast.showSuccess(`Replay completed: ${id.slice(0, 8)}`);
            setIsReplaying(false);
            onReplayComplete(id);
            onClose();
          },
          onError: (error) => {
            toast.showError(`Replay failed: ${error.message}`);
            setIsReplaying(false);
          },
        }
      );
    } catch (error) {
      console.error("Replay error:", error);
      setIsReplaying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Replay Run</DialogTitle>
          <DialogDescription>
            Replay this workflow run with optional modifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Start From Step (optional)</Label>
            <Select value={startStepId} onValueChange={setStartStepId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Start from beginning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Start from beginning</SelectItem>
                {run.steps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.title} ({step.app})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Parameter Overrides (JSON)</Label>
            <Input
              placeholder='{"limit": 20, "status": "done"}'
              value={JSON.stringify(paramOverrides, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setParamOverrides(parsed);
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="mt-2 font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="skip-failures"
                checked={skipFailures}
                onCheckedChange={setSkipFailures}
              />
              <Label htmlFor="skip-failures" className="cursor-pointer">
                Skip failures (treat failed steps as success)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="force-fail"
                checked={forceFail}
                onCheckedChange={setForceFail}
              />
              <Label htmlFor="force-fail" className="cursor-pointer">
                Force fail on last step
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isReplaying}>
              Cancel
            </Button>
            <Button
              onClick={handleReplay}
              disabled={isReplaying}
              className="bg-gradient-to-r from-primary to-electric-glow"
            >
              {isReplaying ? "Replaying..." : "Start Replay"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

