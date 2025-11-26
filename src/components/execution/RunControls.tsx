import { Button } from "@/components/ui/button";
import {
  Play,
  RotateCw,
  Square,
  RefreshCw,
} from "lucide-react";
import { useExecutionStore } from "@/stores/executionStore";

interface RunControlsProps {
  onRun: () => void;
  onRerun: () => void;
  onRunStep: (nodeId: string) => void;
  onRetry: (runId: string, nodeId: string) => void;
  onCancel: () => void;
  selectedNodeId: string | null;
  currentRunId: string | null;
}

export const RunControls = ({
  onRun,
  onRerun,
  onRunStep,
  onRetry,
  onCancel,
  selectedNodeId,
  currentRunId,
}: RunControlsProps) => {
  const { isRunning, currentRun } = useExecutionStore();

  if (isRunning) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={onCancel}
          size="sm"
          variant="destructive"
          aria-label="Cancel execution"
        >
          <Square className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <span className="text-sm text-muted-foreground">Running...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        onClick={onRun}
        size="sm"
        className="bg-gradient-to-r from-primary to-electric-glow"
        aria-label="Run workflow"
        aria-pressed={isRunning}
      >
        <Play className="w-4 h-4 mr-2" />
        Run Workflow
      </Button>

      {currentRun && (
        <Button
          onClick={onRerun}
          size="sm"
          variant="outline"
          aria-label="Rerun workflow"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Rerun
        </Button>
      )}

      {selectedNodeId && (
        <Button
          onClick={() => onRunStep(selectedNodeId)}
          size="sm"
          variant="outline"
          aria-label="Run selected step only"
        >
          <Play className="w-4 h-4 mr-2" />
          Run Step Only
        </Button>
      )}

      {currentRun && selectedNodeId && (
        <Button
          onClick={() => currentRunId && onRetry(currentRunId, selectedNodeId)}
          size="sm"
          variant="outline"
          aria-label="Retry failed step"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Failed
        </Button>
      )}
    </div>
  );
};

