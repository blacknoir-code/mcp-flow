import { useWorkflowStore } from "@/stores/workflowStore";
import {
  SparklesIcon,
  PencilIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
  TrashIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface WorkflowActivityFeedProps {
  workflowId: string;
}

const activityIcons: Record<string, any> = {
  node_updated: PencilIcon,
  workflow_regenerated: SparklesIcon,
  node_moved: ArrowsPointingOutIcon,
  node_added: PlusIcon,
  node_deleted: TrashIcon,
  settings_changed: Cog6ToothIcon,
};

export const WorkflowActivityFeed = ({ workflowId }: WorkflowActivityFeedProps) => {
  const workflow = useWorkflowStore((state) => state.getWorkflow(workflowId));

  if (!workflow) return null;

  const activities = workflow.activity.slice(0, 10); // Show last 10

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-sm text-gray-900 mb-4">Activity Feed</h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet</p>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type] || PencilIcon;
            return (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dayjs(activity.timestamp).fromNow()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

