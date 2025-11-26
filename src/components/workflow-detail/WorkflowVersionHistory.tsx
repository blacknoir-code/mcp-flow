import { useState } from "react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DocumentTextIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface WorkflowVersionHistoryProps {
  workflowId: string;
}

const changeTypeLabels: Record<string, string> = {
  ai_regenerate: "AI Regenerate",
  manual_edit: "Manual Edit",
  template_import: "Template Import",
  version_restore: "Version Restore",
};

export const WorkflowVersionHistory = ({ workflowId }: WorkflowVersionHistoryProps) => {
  const workflow = useWorkflowStore((state) => state.getWorkflow(workflowId));
  const { getVersionDiff, updateCanvas } = useWorkflowStore();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [diffVersion1, setDiffVersion1] = useState<string | null>(null);
  const [diffVersion2, setDiffVersion2] = useState<string | null>(null);

  if (!workflow) return null;

  const handleViewDiff = (versionId: string) => {
    if (workflow.versions.length > 0) {
      const currentVersion = workflow.versions[0];
      setDiffVersion1(versionId);
      setDiffVersion2(currentVersion.id);
      setShowDiff(true);
    }
  };

  const handleRestore = (versionId: string) => {
    const version = workflow.versions.find((v) => v.id === versionId);
    if (version && confirm("Restore this version? This will replace the current workflow.")) {
      updateCanvas(workflowId, version.nodes, version.edges);
      useWorkflowStore.getState().addVersion(workflowId, "version_restore", "Restored from version");
      alert("Version restored successfully!");
    }
  };

  const diff = diffVersion1 && diffVersion2
    ? getVersionDiff(workflowId, diffVersion1, diffVersion2)
    : null;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Version History</h2>

      <div className="space-y-3">
        {workflow.versions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No version history</p>
            <p className="text-sm mt-2">Versions are created when you edit the workflow</p>
          </div>
        ) : (
          workflow.versions.map((version) => (
            <div
              key={version.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">v{version.version}</Badge>
                    <span className="font-medium text-sm">
                      {changeTypeLabels[version.changeType] || version.changeType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {dayjs(version.createdAt).format("MMM D, YYYY HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{version.summary}</p>
                  {version.diff && (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>+{version.diff.nodesAdded} nodes</span>
                      <span>-{version.diff.nodesRemoved} nodes</span>
                      <span>~{version.diff.nodesModified} modified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => handleViewDiff(version.id)}
                    size="sm"
                    variant="outline"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View Diff
                  </Button>
                  {version.version > 1 && (
                    <Button
                      onClick={() => handleRestore(version.id)}
                      size="sm"
                      variant="outline"
                    >
                      <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showDiff && diff && diffVersion1 && diffVersion2 && (
        <Dialog open={showDiff} onOpenChange={setShowDiff}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Version Diff</DialogTitle>
              <DialogDescription>
                Comparing version {workflow.versions.find((v) => v.id === diffVersion1)?.version} with current
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Summary</h4>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <div>Nodes Added: <span className="text-green-600">{diff.nodesAdded.length}</span></div>
                  <div>Nodes Removed: <span className="text-red-600">{diff.nodesRemoved.length}</span></div>
                  <div>Nodes Modified: <span className="text-orange-600">{diff.nodesModified.length}</span></div>
                  <div>Edges Added: <span className="text-green-600">{diff.edgesAdded.length}</span></div>
                  <div>Edges Removed: <span className="text-red-600">{diff.edgesRemoved.length}</span></div>
                </div>
              </div>

              {diff.nodesAdded.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-green-600">Nodes Added</h4>
                  <div className="space-y-1">
                    {diff.nodesAdded.map((node: any) => (
                      <div key={node.id} className="text-sm bg-green-50 p-2 rounded">
                        + {node.data.title} ({node.data.app})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diff.nodesRemoved.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-red-600">Nodes Removed</h4>
                  <div className="space-y-1">
                    {diff.nodesRemoved.map((node: any) => (
                      <div key={node.id} className="text-sm bg-red-50 p-2 rounded">
                        - {node.data.title} ({node.data.app})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diff.nodesModified.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-orange-600">Nodes Modified</h4>
                  <div className="space-y-1">
                    {diff.nodesModified.map((node: any) => (
                      <div key={node.id} className="text-sm bg-orange-50 p-2 rounded">
                        ~ {node.data.title} ({node.data.app})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">View JSON Diff</summary>
                <pre className="mt-2 text-xs bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-64">
                  {JSON.stringify(diff, null, 2)}
                </pre>
              </details>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

