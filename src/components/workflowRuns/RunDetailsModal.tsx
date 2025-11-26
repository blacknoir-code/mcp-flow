import { useState } from "react";
import { RunRecord, StepEvent } from "@/data/sampleRuns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowPathIcon, ArrowDownTrayIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ReplayControls } from "./ReplayControls";
import { useRunsStore } from "@/stores/runsStore";
import { useToastSystem } from "@/components/settings/ToastSystem";
import dayjs from "dayjs";
import { clsx } from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const statusColors = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  running: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

interface RunDetailsModalProps {
  run: RunRecord | null;
  open: boolean;
  onClose: () => void;
  onReplay: (run: RunRecord) => void;
  onCompare: (run: RunRecord) => void;
}

const StepRow = ({ step, index, total }: { step: StepEvent; index: number; total: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {index < total - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
      )}
      <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{step.title}</span>
            <Badge variant="outline" className={clsx("text-xs", statusColors[step.status])}>
              {step.status}
            </Badge>
            <span className="text-xs text-gray-500">{step.app}</span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              {dayjs(step.startTime).format("HH:mm:ss")} -{" "}
              {step.endTime ? dayjs(step.endTime).format("HH:mm:ss") : "running"}
            </div>
            {step.durationMs && (
              <div>Duration: {(step.durationMs / 1000).toFixed(1)}s</div>
            )}
            {step.error && (
              <div className="text-red-600">Error: {step.error}</div>
            )}
          </div>
          {expanded && (
            <div className="mt-2 space-y-2">
              {step.logs && step.logs.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-1">Logs:</div>
                  <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    {step.logs.map((log, i) => (
                      <div key={i}>
                        [{log.level}] {log.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {step.mockResponse && (
                <div>
                  <div className="text-xs font-semibold mb-1">Response:</div>
                  <pre className="bg-gray-900 text-blue-400 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(step.mockResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-200 rounded"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export const RunDetailsModal = ({
  run,
  open,
  onClose,
  onReplay,
  onCompare,
}: RunDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const exportRuns = useRunsStore((state) => state.exportRuns);
  const toast = useToastSystem();

  if (!run) return null;

  const allLogs = run.steps.flatMap((s) =>
    s.logs.map((l) => ({ ...l, stepTitle: s.title, stepApp: s.app }))
  );

  const filteredLogs = logSearch
    ? allLogs.filter((l) => l.message.toLowerCase().includes(logSearch.toLowerCase()))
    : allLogs;

  const handleExport = () => {
    try {
      const data = exportRuns([run.runId], "json");
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `run-${run.runId.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.showSuccess("Run exported successfully");
    } catch (error) {
      toast.showError("Failed to export run");
    }
  };

  const handleReplayComplete = (newRunId: string) => {
    toast.showSuccess(`Replay completed: ${newRunId.slice(0, 8)}`);
    setShowReplayModal(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Run Details</DialogTitle>
                <DialogDescription>
                  {run.workflowName} • {run.runId.slice(0, 8)}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowReplayModal(true)}>
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Replay
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={() => onCompare(run)}>
                  <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="outputs">Outputs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <Badge className={clsx("mt-1", statusColors[run.status])}>
                    {run.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Trigger</div>
                  <div className="text-sm font-medium mt-1">{run.trigger}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Started At</div>
                  <div className="text-sm font-medium mt-1">
                    {dayjs(run.startedAt).format("MMM D, YYYY HH:mm:ss")}
                  </div>
                </div>
                {run.endedAt && (
                  <div>
                    <div className="text-sm text-gray-500">Ended At</div>
                    <div className="text-sm font-medium mt-1">
                      {dayjs(run.endedAt).format("MMM D, YYYY HH:mm:ss")}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-sm font-medium mt-1">
                    {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Triggered By</div>
                  <div className="text-sm font-medium mt-1">{run.triggeredBy || "-"}</div>
                </div>
              </div>
              {run.inputs && (
                <div>
                  <div className="text-sm font-semibold mb-2">Inputs</div>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(run.inputs, null, 2)}
                  </pre>
                </div>
              )}
              {run.summary && (
                <div>
                  <div className="text-sm font-semibold mb-2">Summary</div>
                  <p className="text-sm text-gray-700">{run.summary}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <div className="space-y-2">
                {run.steps.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No steps executed</p>
                ) : (
                  run.steps.map((step, index) => (
                    <StepRow key={step.id} step={step} index={index} total={run.steps.length} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <div className="mb-4">
                <Input
                  placeholder="Search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
                {filteredLogs.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No logs found</p>
                ) : (
                  filteredLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-500">
                        [{dayjs(log.timestamp).format("HH:mm:ss")}] [{log.level}]
                      </span>{" "}
                      <span className="text-gray-700">{log.message}</span>
                      <span className="text-gray-400 ml-2">
                        ({log.stepTitle} - {log.stepApp})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="outputs" className="mt-4">
              {run.outputs ? (
                <div>
                  <div className="mb-4">
                    <Button size="sm" variant="outline" onClick={handleExport}>
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto">
                    {JSON.stringify(run.outputs, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No outputs available</p>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ReplayControls
        run={run}
        open={showReplayModal}
        onClose={() => setShowReplayModal(false)}
        onReplayComplete={handleReplayComplete}
      />
    </>
  );
};

