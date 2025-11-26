import { Handle, Position } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  SparklesIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface NodeCardProps {
  data: NodeData;
  selected?: boolean;
  id?: string;
}

const appIcons: Record<string, any> = {
  Gmail: EnvelopeIcon,
  Jira: CheckCircleIcon,
  Slack: ChatBubbleLeftRightIcon,
  Internal: DocumentTextIcon,
  AI: SparklesIcon,
};

const statusColors: Record<string, string> = {
  idle: "bg-gray-100 text-gray-600 border-gray-300",
  pending: "bg-gray-100 text-gray-600 border-gray-300",
  running: "bg-blue-100 text-blue-600 border-blue-300",
  success: "bg-green-100 text-green-600 border-green-300",
  error: "bg-red-100 text-red-600 border-red-300",
};

export const NodeCard = ({ data, selected }: NodeCardProps) => {
  const Icon = appIcons[data.app] || DocumentTextIcon;
  const statusColor = statusColors[data.status] || statusColors.idle;

  return (
    <div
      className={clsx(
        "bg-white rounded-lg border-2 shadow-md min-w-[200px] transition-all",
        selected ? "border-blue-500 shadow-lg" : "border-gray-200",
        data.status === "running" && "ring-2 ring-blue-400 ring-opacity-50"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">{data.title}</h3>
              <p className="text-xs text-gray-500">{data.app}</p>
            </div>
          </div>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Node menu"
            onClick={(e) => {
              e.stopPropagation();
              // Menu handled by parent
            }}
          >
            <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {data.functionName && (
          <p className="text-xs text-gray-400 mb-2">{data.functionName}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span
            className={clsx(
              "px-2 py-1 rounded text-xs font-medium border",
              statusColor
            )}
          >
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

