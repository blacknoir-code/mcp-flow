import { RunRecord } from "@/data/sampleRuns";
import { RunRow } from "./RunRow";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useRunsStore } from "@/stores/runsStore";
import { useState } from "react";

interface RunsTableProps {
  runs: RunRecord[];
  selectedRunIds: string[];
  onSelectRun: (runId: string) => void;
  onSelectAll: (runIds: string[]) => void;
  onViewRun: (run: RunRecord) => void;
  onReplayRun: (run: RunRecord) => void;
  onReplayFromStep: (run: RunRecord) => void;
  onExportRun: (run: RunRecord) => void;
  onCompareRun: (run: RunRecord) => void;
}

export const RunsTable = ({
  runs,
  selectedRunIds,
  onSelectRun,
  onSelectAll,
  onViewRun,
  onReplayRun,
  onReplayFromStep,
  onExportRun,
  onCompareRun,
}: RunsTableProps) => {
  const sortBy = useRunsStore((state) => state.sortBy);
  const setSort = useRunsStore((state) => state.setSort);
  const [hoveredRunId, setHoveredRunId] = useState<string | null>(null);

  const allSelected = runs.length > 0 && runs.every((r) => selectedRunIds.includes(r.runId));

  const handleSort = (field: string) => {
    setSort(field);
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => {
    const isActive = sortBy?.field === field;
    const direction = isActive ? sortBy?.direction : undefined;

    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-gray-900"
      >
        {children}
        {isActive && (
          direction === "asc" ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )
        )}
      </button>
    );
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll(runs.map((r) => r.runId))}
                  aria-label="Select all runs"
                />
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">
                <SortButton field="startedAt">Run ID</SortButton>
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">
                <SortButton field="workflowName">Workflow</SortButton>
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">Trigger</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">
                <SortButton field="startedAt">Start Time</SortButton>
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">
                <SortButton field="durationMs">Duration</SortButton>
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">Steps</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">User</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  No runs found
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <RunRow
                  key={run.runId}
                  run={run}
                  isSelected={selectedRunIds.includes(run.runId)}
                  onSelect={() => onSelectRun(run.runId)}
                  onView={() => onViewRun(run)}
                  onReplay={() => onReplayRun(run)}
                  onReplayFromStep={() => onReplayFromStep(run)}
                  onExport={() => onExportRun(run)}
                  onCompare={() => onCompareRun(run)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

