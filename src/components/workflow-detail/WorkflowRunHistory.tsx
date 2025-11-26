import { useState, useMemo } from "react";
import { useExecutionStore } from "@/stores/executionStore";
import { WorkflowRunCard } from "./WorkflowRunCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";

interface WorkflowRunHistoryProps {
  workflowName: string;
}

export const WorkflowRunHistory = ({ workflowName }: WorkflowRunHistoryProps) => {
  const { runs, filter, setFilter } = useExecutionStore();
  const [sortBy, setSortBy] = useState<"recent" | "duration">("recent");

  const filteredRuns = useMemo(() => {
    let filtered = runs.filter((run) => run.workflowName === workflowName);

    if (filter === "errors") {
      filtered = filtered.filter((r) => r.status === "error");
    } else if (filter === "success") {
      filtered = filtered.filter((r) => r.status === "success");
    } else if (filter === "warnings") {
      // No warnings in current implementation, but keeping for consistency
      filtered = filtered;
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } else if (sortBy === "duration") {
      filtered.sort((a, b) => {
        const aDur = a.endTime ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime() : 0;
        const bDur = b.endTime ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime() : 0;
        return bDur - aDur;
      });
    }

    return filtered;
  }, [runs, workflowName, filter, sortBy]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Run History</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Runs</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="errors">Failed</SelectItem>
                <SelectItem value="warnings">Running</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="w-4 h-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent First</SelectItem>
                <SelectItem value="duration">Longest Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRuns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No runs found</p>
            <p className="text-sm mt-2">Run the workflow to see execution history</p>
          </div>
        ) : (
          filteredRuns.map((run) => <WorkflowRunCard key={run.runId} run={run} />)
        )}
      </div>
    </div>
  );
};

