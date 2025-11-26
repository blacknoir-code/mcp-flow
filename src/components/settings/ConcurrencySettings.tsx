import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/stores/settingsStore";

export const ConcurrencySettings = () => {
  const { concurrency, updateConcurrency } = useSettingsStore();

  const estimatedThroughput = Math.min(
    concurrency.maxConcurrentWorkflows * 10,
    concurrency.maxConcurrentCardExecutions * 5
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Global Concurrency Limits</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Max Concurrent Workflows (Global)</Label>
              <Input
                type="number"
                value={concurrency.maxConcurrentWorkflows}
                onChange={(e) =>
                  updateConcurrency({
                    maxConcurrentWorkflows: parseInt(e.target.value) || 1,
                  })
                }
                className="w-24"
                min={1}
                max={200}
              />
            </div>
            <Slider
              value={[concurrency.maxConcurrentWorkflows]}
              onValueChange={([value]) =>
                updateConcurrency({ maxConcurrentWorkflows: value })
              }
              min={1}
              max={200}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum number of workflows that can run simultaneously across all users
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Max Concurrent Card Executions (Per Workflow)</Label>
              <Input
                type="number"
                value={concurrency.maxConcurrentCardExecutions}
                onChange={(e) =>
                  updateConcurrency({
                    maxConcurrentCardExecutions: parseInt(e.target.value) || 1,
                  })
                }
                className="w-24"
                min={1}
                max={50}
              />
            </div>
            <Slider
              value={[concurrency.maxConcurrentCardExecutions]}
              onValueChange={([value]) =>
                updateConcurrency({ maxConcurrentCardExecutions: value })
              }
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum number of cards that can execute concurrently within a single workflow
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Default Retry Policy</h3>
        <div className="space-y-4">
          <div>
            <Label>Retry Attempts</Label>
            <Input
              type="number"
              value={concurrency.defaultRetryPolicy.attempts}
              onChange={(e) =>
                updateConcurrency({
                  defaultRetryPolicy: {
                    ...concurrency.defaultRetryPolicy,
                    attempts: parseInt(e.target.value) || 1,
                  },
                })
              }
              className="w-32 mt-2"
              min={1}
              max={10}
            />
          </div>
          <div>
            <Label>Backoff Strategy</Label>
            <Select
              value={concurrency.defaultRetryPolicy.backoff}
              onValueChange={(value) =>
                updateConcurrency({
                  defaultRetryPolicy: {
                    ...concurrency.defaultRetryPolicy,
                    backoff: value as "linear" | "exponential",
                  },
                })
              }
            >
              <SelectTrigger className="w-48 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="exponential">Exponential</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Timeout (ms)</Label>
            <Input
              type="number"
              value={concurrency.defaultRetryPolicy.timeout}
              onChange={(e) =>
                updateConcurrency({
                  defaultRetryPolicy: {
                    ...concurrency.defaultRetryPolicy,
                    timeout: parseInt(e.target.value) || 30000,
                  },
                })
              }
              className="w-32 mt-2"
              min={1000}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Per-Workflow Settings</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label>Allow Override Per Workflow</Label>
            <p className="text-sm text-gray-500">
              Allow individual workflows to override global concurrency settings
            </p>
          </div>
          <Switch
            checked={concurrency.allowOverridePerWorkflow}
            onCheckedChange={(checked) =>
              updateConcurrency({ allowOverridePerWorkflow: checked })
            }
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Safe Guards</h3>
        <div className="space-y-4">
          <div>
            <Label>Pause New Runs if Queue Length &gt;</Label>
            <Input
              type="number"
              value={concurrency.safeGuards.pauseOnQueueLength}
              onChange={(e) =>
                updateConcurrency({
                  safeGuards: {
                    ...concurrency.safeGuards,
                    pauseOnQueueLength: parseInt(e.target.value) || 100,
                  },
                })
              }
              className="w-32 mt-2"
              min={1}
            />
          </div>
          <div>
            <Label>Auto-throttle when Error Rate &gt; (%)</Label>
            <Input
              type="number"
              value={concurrency.safeGuards.autoThrottleErrorRate * 100}
              onChange={(e) =>
                updateConcurrency({
                  safeGuards: {
                    ...concurrency.safeGuards,
                    autoThrottleErrorRate: (parseFloat(e.target.value) || 0) / 100,
                  },
                })
              }
              className="w-32 mt-2"
              min={0}
              max={100}
              step={0.1}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Throughput Estimate</h3>
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated Throughput</span>
              <span className="font-semibold">{estimatedThroughput} workflows/min</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(100, (estimatedThroughput / 200) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Based on current concurrency settings and average workflow duration
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

