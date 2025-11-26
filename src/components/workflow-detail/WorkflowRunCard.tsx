import { useState } from "react";
import { Run } from "@/stores/executionStore";
import { ExecutionBadge } from "@/components/execution/ExecutionBadge";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExecutionPanel } from "@/components/execution/ExecutionPanel";

dayjs.extend(relativeTime);

interface WorkflowRunCardProps {
  run: Run;
}

export const WorkflowRunCard = ({ run }: WorkflowRunCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const duration = run.endTime
    ? dayjs(run.endTime).diff(dayjs(run.startTime), "second")
    : null;

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <ExecutionBadge status={run.status} size="sm" />
            <div>
              <div className="font-medium text-sm text-gray-900">
                Run #{run.runId.slice(0, 8)}
              </div>
              <div className="text-xs text-gray-500">
                {dayjs(run.startTime).format("MMM D, YYYY HH:mm:ss")}
              </div>
            </div>
          </div>
          <Button
            onClick={() => setShowDetails(true)}
            size="sm"
            variant="outline"
            aria-label="View run details"
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            View Logs
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-2 text-gray-900">{duration ? `${duration}s` : "Running..."}</span>
          </div>
          <div>
            <span className="text-gray-500">Steps:</span>
            <span className="ml-2 text-gray-900">
              {run.summary.success + run.summary.error}/{run.summary.total}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Errors:</span>
            <span className={`ml-2 ${run.summary.error > 0 ? "text-red-600" : "text-gray-900"}`}>
              {run.summary.error}
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Run Details - {dayjs(run.startTime).format("MMM D, YYYY HH:mm:ss")}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 overflow-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
              <ExecutionPanel />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

