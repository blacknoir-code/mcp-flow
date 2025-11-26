import { useWorkflowStore } from "@/stores/workflowStore";
import { ScheduleEditor } from "./ScheduleEditor";
import { TriggerEditor } from "./TriggerEditor";
import { PermissionManager } from "./PermissionManager";

interface WorkflowSettingsProps {
  workflowId: string;
}

export const WorkflowSettings = ({ workflowId }: WorkflowSettingsProps) => {
  const workflow = useWorkflowStore((state) => state.getWorkflow(workflowId));
  const { updateSchedule, updateTriggers, updatePermissions } = useWorkflowStore();

  if (!workflow) return null;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Schedule</h2>
        <ScheduleEditor
          schedule={workflow.schedule}
          onUpdate={(schedule) => updateSchedule(workflowId, schedule)}
        />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Triggers</h2>
        <TriggerEditor
          triggers={workflow.triggers}
          onUpdate={(triggers) => updateTriggers(workflowId, triggers)}
        />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Permissions</h2>
        <PermissionManager
          permissions={workflow.permissions}
          onUpdate={(permissions) => updatePermissions(workflowId, permissions)}
        />
      </div>
    </div>
  );
};

