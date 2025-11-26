import { useState, useEffect } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon, PlayIcon } from "@heroicons/react/24/outline";
import { useCardDetails } from "@/hooks/useCardDetails";
import { useFlowStore } from "@/stores/flowStore";
import { useExecutionSimulator } from "@/hooks/useExecutionSimulator";
import { useExecutionStore } from "@/stores/executionStore";
import { ExecutionBadge } from "@/components/execution/ExecutionBadge";
import dayjs from "dayjs";

interface CardRetriesSectionProps {
  node: Node<NodeData>;
}

export const CardRetriesSection = ({ node }: CardRetriesSectionProps) => {
  const { executionData } = useCardDetails(node.id);
  const { updateNode } = useFlowStore();
  const { retryFailedStep } = useExecutionSimulator();
  const [retryPolicy, setRetryPolicy] = useState(
    node.data.params?.retryPolicy || { attempts: 3, strategy: "exponential", timeout: 5000 }
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setRetryPolicy(node.data.params?.retryPolicy || { attempts: 3, strategy: "exponential", timeout: 5000 });
    setHasChanges(false);
  }, [node.id, node.data.params]);

  const handleChange = (key: string, value: any) => {
    setRetryPolicy((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateNode(node.id, {
      params: { ...node.data.params, retryPolicy },
    });
    setHasChanges(false);
  };

  const { runs } = useExecutionStore();
  
  const handleRetryNow = async () => {
    // Find the latest run for this node
    const latestRun = runs[0];
    if (latestRun) {
      await retryFailedStep(latestRun.runId, node.id);
    }
  };

  const retryHistory = executionData?.retryHistory || [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Retry Logic</h4>
        {executionData?.status === "error" && (
          <Button onClick={handleRetryNow} size="sm" variant="default">
            <PlayIcon className="w-4 h-4 mr-1" />
            Retry Now
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Max Attempts</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={retryPolicy.attempts || 3}
            onChange={(e) => handleChange("attempts", parseInt(e.target.value) || 3)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Backoff Strategy</Label>
          <Select
            value={retryPolicy.strategy || "exponential"}
            onValueChange={(value) => handleChange("strategy", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exponential">Exponential</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {retryPolicy.strategy === "exponential" && "Delays: 500ms, 1000ms, 2000ms..."}
            {retryPolicy.strategy === "linear" && "Delays: 500ms, 1000ms, 1500ms..."}
            {retryPolicy.strategy === "fixed" && "Fixed delay: 1000ms"}
          </p>
        </div>

        <div>
          <Label>Timeout per Attempt (ms)</Label>
          <Input
            type="number"
            min="1000"
            value={retryPolicy.timeout || 5000}
            onChange={(e) => handleChange("timeout", parseInt(e.target.value) || 5000)}
            className="mt-1"
          />
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <CheckIcon className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        )}
      </div>

      {retryHistory.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h5 className="font-medium text-sm mb-3">Retry History</h5>
          <div className="space-y-2">
            {retryHistory.slice(-5).reverse().map((retry, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExecutionBadge status={retry.status} size="sm" />
                    <span className="text-xs text-gray-500">
                      Attempt {retry.attempt} • {dayjs(retry.timestamp).format("HH:mm:ss")}
                    </span>
                  </div>
                </div>
                {retry.error && (
                  <p className="text-xs text-red-600 mt-1">{retry.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

