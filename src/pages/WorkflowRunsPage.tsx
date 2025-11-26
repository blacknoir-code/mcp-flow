import { useState } from "react";
import { RunMetricsSummary } from "@/components/workflowRuns/RunMetricsSummary";
import { RunFiltersBar } from "@/components/workflowRuns/RunFiltersBar";
import { RunSearchInput } from "@/components/workflowRuns/RunSearchInput";
import { RunsTable } from "@/components/workflowRuns/RunsTable";
import { PaginationControls } from "@/components/workflowRuns/PaginationControls";
import { ExportPanel } from "@/components/workflowRuns/ExportPanel";
import { RunDetailsModal } from "@/components/workflowRuns/RunDetailsModal";
import { CompareRunsModal } from "@/components/workflowRuns/CompareRunsModal";
import { ReplayControls } from "@/components/workflowRuns/ReplayControls";
import { useRunsStore } from "@/stores/runsStore";
import { RunRecord } from "@/data/sampleRuns";
import { useRunReplay } from "@/hooks/useRunReplay";
import { useToastSystem } from "@/components/settings/ToastSystem";

export const WorkflowRunsPage = () => {
  const queryRuns = useRunsStore((state) => state.queryRuns);
  const pagination = useRunsStore((state) => state.pagination);
  const selectedRunIds = useRunsStore((state) => state.selectedRunIds);
  const selectRun = useRunsStore((state) => state.selectRun);
  const selectAll = useRunsStore((state) => state.selectAll);
  const exportRuns = useRunsStore((state) => state.exportRuns);
  const { replayRun } = useRunReplay();
  const toast = useToastSystem();

  const allRuns = queryRuns();
  const startIndex = (pagination.page - 1) * pagination.perPage;
  const endIndex = Math.min(startIndex + pagination.perPage, allRuns.length);
  const paginatedRuns = allRuns.slice(startIndex, endIndex);

  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [replayRunData, setReplayRunData] = useState<RunRecord | null>(null);
  const [compareRuns, setCompareRuns] = useState<{ runA: RunRecord | null; runB: RunRecord | null }>({
    runA: null,
    runB: null,
  });
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleViewRun = (run: RunRecord) => {
    setSelectedRun(run);
    setShowDetailsModal(true);
  };

  const handleReplayRun = (run: RunRecord) => {
    setReplayRunData(run);
    setShowReplayModal(true);
  };

  const handleReplayFromStep = (run: RunRecord) => {
    setReplayRunData(run);
    setShowReplayModal(true);
  };

  const handleExportRun = (run: RunRecord) => {
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

  const handleCompareRun = (run: RunRecord) => {
    if (!compareRuns.runA) {
      setCompareRuns({ runA: run, runB: null });
      toast.showInfo("Select another run to compare");
    } else {
      setCompareRuns({ ...compareRuns, runB: run });
      setShowCompareModal(true);
    }
  };

  const handleReplayComplete = (newRunId: string) => {
    toast.showSuccess(`Replay completed: ${newRunId.slice(0, 8)}`);
    setShowReplayModal(false);
    setReplayRunData(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflow Runs</h1>
        <p className="text-sm text-gray-500">
          View, search, and manage all workflow execution history
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <RunMetricsSummary />

        <RunSearchInput />

        <RunFiltersBar />

        <ExportPanel runIds={selectedRunIds} />

        <RunsTable
          runs={paginatedRuns}
          selectedRunIds={selectedRunIds}
          onSelectRun={selectRun}
          onSelectAll={selectAll}
          onViewRun={handleViewRun}
          onReplayRun={handleReplayRun}
          onReplayFromStep={handleReplayFromStep}
          onExportRun={handleExportRun}
          onCompareRun={handleCompareRun}
        />

        <PaginationControls />
      </div>

      <RunDetailsModal
        run={selectedRun}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRun(null);
        }}
        onReplay={handleReplayRun}
        onCompare={handleCompareRun}
      />

      <ReplayControls
        run={replayRunData}
        open={showReplayModal}
        onClose={() => {
          setShowReplayModal(false);
          setReplayRunData(null);
        }}
        onReplayComplete={handleReplayComplete}
      />

      <CompareRunsModal
        runA={compareRuns.runA}
        runB={compareRuns.runB}
        open={showCompareModal}
        onClose={() => {
          setShowCompareModal(false);
          setCompareRuns({ runA: null, runB: null });
        }}
      />
    </div>
  );
};

