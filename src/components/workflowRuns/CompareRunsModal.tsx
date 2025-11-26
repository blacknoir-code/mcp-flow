import { RunRecord } from "@/data/sampleRuns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useRunsStore } from "@/stores/runsStore";
import { useToastSystem } from "@/components/settings/ToastSystem";
import dayjs from "dayjs";
import { clsx } from "clsx";

const statusColors = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  running: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

interface CompareRunsModalProps {
  runA: RunRecord | null;
  runB: RunRecord | null;
  open: boolean;
  onClose: () => void;
}

export const CompareRunsModal = ({
  runA,
  runB,
  open,
  onClose,
}: CompareRunsModalProps) => {
  const exportRuns = useRunsStore((state) => state.exportRuns);
  const toast = useToastSystem();

  if (!runA || !runB) return null;

  const durationDelta = (runA.durationMs || 0) - (runB.durationMs || 0);
  const stepsDelta = runA.steps.length - runB.steps.length;
  const statusDiff = runA.status !== runB.status;

  const handleExport = () => {
    try {
      const comparison = {
        runA: runA.runId,
        runB: runB.runId,
        differences: {
          durationDelta,
          stepsDelta,
          statusDiff,
        },
        runs: [runA, runB],
      };
      const data = JSON.stringify(comparison, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `comparison-${runA.runId.slice(0, 8)}-${runB.runId.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.showSuccess("Comparison exported successfully");
    } catch (error) {
      toast.showError("Failed to export comparison");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Compare Runs</DialogTitle>
              <DialogDescription>
                Side-by-side comparison of two workflow runs
              </DialogDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export Comparison
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">Differences Summary</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Steps:</span>{" "}
                <span className={clsx("font-medium", stepsDelta !== 0 && "text-yellow-600")}>
                  {stepsDelta > 0 ? `+${stepsDelta}` : stepsDelta} ({runA.steps.length} vs {runB.steps.length})
                </span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>{" "}
                <span className={clsx("font-medium", Math.abs(durationDelta) > 1000 && "text-yellow-600")}>
                  {durationDelta > 0 ? `+${(durationDelta / 1000).toFixed(1)}s` : `${(durationDelta / 1000).toFixed(1)}s`}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>{" "}
                <span className={clsx("font-medium", statusDiff && "text-red-600")}>
                  {statusDiff ? "Different" : "Same"}
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Run A */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold">{runA.workflowName}</div>
                  <div className="text-xs text-gray-500">{runA.runId.slice(0, 8)}</div>
                </div>
                <Badge className={clsx(statusColors[runA.status])}>{runA.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>{" "}
                  <span className="font-medium">
                    {runA.durationMs ? `${(runA.durationMs / 1000).toFixed(1)}s` : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Steps:</span>{" "}
                  <span className="font-medium">{runA.steps.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Started:</span>{" "}
                  <span className="font-medium">
                    {dayjs(runA.startedAt).format("MMM D, HH:mm:ss")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Trigger:</span>{" "}
                  <span className="font-medium">{runA.trigger}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold mb-2">Steps Timeline</div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {runA.steps.map((step, i) => (
                    <div
                      key={step.id}
                      className={clsx(
                        "p-2 rounded text-xs",
                        runB.steps[i]?.status !== step.status && "bg-yellow-50 border border-yellow-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.title}</span>
                        <Badge
                          variant="outline"
                          className={clsx("text-xs", statusColors[step.status])}
                        >
                          {step.status}
                        </Badge>
                        {step.durationMs && (
                          <span className="text-gray-500">
                            {(step.durationMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Run B */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold">{runB.workflowName}</div>
                  <div className="text-xs text-gray-500">{runB.runId.slice(0, 8)}</div>
                </div>
                <Badge className={clsx(statusColors[runB.status])}>{runB.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>{" "}
                  <span className="font-medium">
                    {runB.durationMs ? `${(runB.durationMs / 1000).toFixed(1)}s` : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Steps:</span>{" "}
                  <span className="font-medium">{runB.steps.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Started:</span>{" "}
                  <span className="font-medium">
                    {dayjs(runB.startedAt).format("MMM D, HH:mm:ss")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Trigger:</span>{" "}
                  <span className="font-medium">{runB.trigger}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold mb-2">Steps Timeline</div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {runB.steps.map((step, i) => (
                    <div
                      key={step.id}
                      className={clsx(
                        "p-2 rounded text-xs",
                        runA.steps[i]?.status !== step.status && "bg-yellow-50 border border-yellow-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.title}</span>
                        <Badge
                          variant="outline"
                          className={clsx("text-xs", statusColors[step.status])}
                        >
                          {step.status}
                        </Badge>
                        {step.durationMs && (
                          <span className="text-gray-500">
                            {(step.durationMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

