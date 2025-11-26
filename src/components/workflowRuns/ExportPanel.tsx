import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useRunsStore } from "@/stores/runsStore";
import { useToastSystem } from "@/components/settings/ToastSystem";
import dayjs from "dayjs";

interface ExportPanelProps {
  runIds: string[];
}

export const ExportPanel = ({ runIds }: ExportPanelProps) => {
  const exportRuns = useRunsStore((state) => state.exportRuns);
  const toast = useToastSystem();

  const handleExport = (format: "json" | "csv") => {
    if (runIds.length === 0) {
      toast.showError("No runs selected");
      return;
    }

    try {
      const data = exportRuns(runIds, format);
      const blob = new Blob([data], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workflow-runs-${dayjs().format("YYYY-MM-DD")}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.showSuccess(`Exported ${runIds.length} runs as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.showError("Failed to export runs");
    }
  };

  if (runIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium text-sm">{runIds.length} run(s) selected</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleExport("json")}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport("csv")}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

