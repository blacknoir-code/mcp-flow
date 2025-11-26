import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { ExecutionBadge } from "@/components/execution/ExecutionBadge";
import { Button } from "@/components/ui/button";
import {
  XMarkIcon,
  PlayIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clsx } from "clsx";

interface CardHeaderProps {
  node: Node<NodeData>;
  onClose: () => void;
  onRunStep: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExport: () => void;
}

const appIcons: Record<string, string> = {
  Gmail: "📧",
  Jira: "✅",
  Slack: "💬",
};

export const CardHeader = ({
  node,
  onClose,
  onRunStep,
  onDuplicate,
  onDelete,
  onExport,
}: CardHeaderProps) => {
  const status = node.data.status || "idle";
  const functionName = node.data.functionName || "Unknown Function";
  const appIcon = appIcons[node.data.app] || "📦";

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-2xl flex-shrink-0">{appIcon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{node.data.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 font-mono">{functionName}</span>
            <ExecutionBadge status={status as any} size="sm" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button
          onClick={onRunStep}
          size="sm"
          variant="outline"
          aria-label="Run step"
        >
          <PlayIcon className="w-4 h-4 mr-1" />
          Run
        </Button>

        <Button
          onClick={onDuplicate}
          size="sm"
          variant="ghost"
          aria-label="Duplicate node"
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" aria-label="More options">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>Export</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onClose}
          size="sm"
          variant="ghost"
          aria-label="Close drawer"
        >
          <XMarkIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

