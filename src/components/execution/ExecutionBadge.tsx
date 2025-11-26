import { ExecutionStatus } from "@/stores/executionStore";
import { clsx } from "clsx";

interface ExecutionBadgeProps {
  status: ExecutionStatus;
  size?: "sm" | "md";
}

export const ExecutionBadge = ({ status, size = "md" }: ExecutionBadgeProps) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  const statusClasses: Record<ExecutionStatus, string> = {
    pending: "bg-gray-100 text-gray-700 border border-gray-300",
    running: "bg-blue-100 text-blue-700 border border-blue-300 animate-pulse",
    success: "bg-green-100 text-green-700 border border-green-300",
    error: "bg-red-100 text-red-700 border border-red-300",
    cancelled: "bg-gray-100 text-gray-500 border border-gray-300",
  };

  return (
    <span
      className={clsx(baseClasses, sizeClasses[size], statusClasses[status])}
      aria-label={`Status: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

