import { RunRecord } from "@/data/sampleRuns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { clsx } from "clsx";

dayjs.extend(relativeTime);

const statusColors = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  running: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const triggerLabels = {
  manual: "Manual",
  schedule: "Schedule",
  webhook: "Webhook",
  api: "API",
};

interface RunRowProps {
  run: RunRecord;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onReplay: () => void;
  onReplayFromStep: () => void;
  onExport: () => void;
  onCompare: () => void;
}

export const RunRow = ({
  run,
  isSelected,
  onSelect,
  onView,
  onReplay,
  onReplayFromStep,
  onExport,
  onCompare,
}: RunRowProps) => {
  const duration = run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : "-";

  return (
    <tr
      className={clsx(
        "border-b hover:bg-gray-50 transition-colors cursor-pointer",
        isSelected && "bg-blue-50"
      )}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View run ${run.runId}`}
    >
      <td className="p-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select run ${run.runId}`}
        />
      </td>
      <td className="p-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(run.runId);
          }}
          className="text-xs font-mono text-blue-600 hover:underline"
          title="Copy run ID"
        >
          {run.runId.slice(0, 8)}...
        </button>
      </td>
      <td className="p-3">
        <span className="text-sm font-medium">{run.workflowName}</span>
      </td>
      <td className="p-3">
        <Badge
          variant="outline"
          className={clsx("text-xs", statusColors[run.status])}
        >
          {run.status}
        </Badge>
      </td>
      <td className="p-3">
        <span className="text-xs text-gray-600">{triggerLabels[run.trigger]}</span>
      </td>
      <td className="p-3">
        <span className="text-xs text-gray-600" title={run.startedAt}>
          {dayjs(run.startedAt).fromNow()}
        </span>
      </td>
      <td className="p-3">
        <span className="text-xs text-gray-600">{duration}</span>
      </td>
      <td className="p-3">
        <span className="text-xs text-gray-600">{run.steps.length}</span>
      </td>
      <td className="p-3">
        <span className="text-xs text-gray-600">{run.triggeredBy || "-"}</span>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            onClick={onView}
            title="View details"
            aria-label="View run details"
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onReplay}
            title="Replay run"
            aria-label="Replay run"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onExport}
            title="Export run"
            aria-label="Export run"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCompare}
            title="Compare run"
            aria-label="Compare run"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

