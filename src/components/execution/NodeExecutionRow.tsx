import { useState } from "react";
import { NodeExecution } from "@/stores/executionStore";
import { ExecutionBadge } from "./ExecutionBadge";
import { LogViewer } from "./LogViewer";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  PlayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface NodeExecutionRowProps {
  execution: NodeExecution;
  isSelected: boolean;
  onSelect: () => void;
  onRunStep: () => void;
  onRetry: () => void;
  onFocus: () => void;
}

export const NodeExecutionRow = ({
  execution,
  isSelected,
  onSelect,
  onRunStep,
  onRetry,
  onFocus,
}: NodeExecutionRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onSelect();
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const logEvents = execution.events.filter(
    (e) => e.type === "node_log" || e.type === "node_error"
  );

  return (
    <div
      className={clsx(
        "border rounded-lg transition-all",
        isSelected ? "border-blue-500 bg-blue-50/50" : "border-gray-200 bg-white",
        execution.status === "running" && "ring-2 ring-blue-400 ring-opacity-50 animate-pulse"
      )}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${execution.nodeTitle} execution details`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="mt-0.5"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm text-gray-900">{execution.nodeTitle}</h4>
                <ExecutionBadge status={execution.status} size="sm" />
                <span className="text-xs text-gray-500">{execution.app}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                {execution.startTime && (
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{dayjs(execution.startTime).format("HH:mm:ss")}</span>
                    {execution.duration && (
                      <span className="ml-1">({formatDuration(execution.duration)})</span>
                    )}
                  </div>
                )}
                {execution.retryCount > 0 && (
                  <span className="text-orange-600">
                    {execution.retryCount} retry{execution.retryCount > 1 ? "ies" : ""}
                  </span>
                )}
              </div>

              {execution.error && (
                <div className="mt-2 flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{execution.error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onFocus();
              }}
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
            >
              Focus
            </Button>
            {execution.status === "error" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry();
                }}
                size="sm"
                variant="outline"
                className="h-7 text-xs"
              >
                Retry
              </Button>
            )}
            {execution.status !== "running" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRunStep();
                }}
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
              >
                <PlayIcon className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <LogViewer
            events={logEvents}
            mockResponse={execution.mockResponse}
            onCopy={() => {
              // Toast notification could go here
            }}
          />
        </div>
      )}
    </div>
  );
};

