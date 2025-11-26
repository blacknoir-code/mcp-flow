import { useWorkflowStore } from "@/stores/workflowStore";
import { useExecutionStore } from "@/stores/executionStore";
import { ExecutionBadge } from "@/components/execution/ExecutionBadge";
import { ClockIcon, UserIcon, CalendarIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface WorkflowMetaBarProps {
  workflowId: string;
}

export const WorkflowMetaBar = ({ workflowId }: WorkflowMetaBarProps) => {
  const workflow = useWorkflowStore((state) => state.getWorkflow(workflowId));
  const { runs } = useExecutionStore();
  
  if (!workflow) return null;

  const lastRun = runs.find((r) => r.workflowName === workflow.name) || runs[0];
  const lastRunStatus = lastRun?.status || "pending";

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Last run:</span>
          {lastRun ? (
            <div className="flex items-center gap-2">
              <ExecutionBadge status={lastRunStatus} size="sm" />
              {lastRun.endTime && (
                <span className="text-gray-600">
                  {dayjs(lastRun.endTime).diff(dayjs(lastRun.startTime), "second")}s
                </span>
              )}
              <span className="text-gray-500">
                {dayjs(lastRun.startTime).fromNow()}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Never</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Created:</span>
          <span className="text-gray-600">{dayjs(workflow.createdAt).format("MMM D, YYYY")}</span>
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Updated:</span>
          <span className="text-gray-600">{dayjs(workflow.updatedAt).fromNow()}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Owner:</span>
          <span className="text-gray-600">{workflow.owner}</span>
        </div>
      </div>
    </div>
  );
};

