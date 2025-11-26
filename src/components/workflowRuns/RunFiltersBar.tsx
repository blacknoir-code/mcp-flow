import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRunsStore } from "@/stores/runsStore";
import { RunStatus, TriggerType } from "@/data/sampleRuns";
import { XMarkIcon } from "@heroicons/react/24/outline";

const statusOptions: RunStatus[] = ["success", "failed", "running", "cancelled", "pending"];
const triggerOptions: TriggerType[] = ["manual", "schedule", "webhook", "api"];

export const RunFiltersBar = () => {
  const filters = useRunsStore((state) => state.filters);
  const setFilters = useRunsStore((state) => state.setFilters);
  const queryRuns = useRunsStore((state) => state.queryRuns);
  const runs = queryRuns();

  // Get unique workflows and users from runs
  const workflows = Array.from(new Set(runs.map((r) => r.workflowName))).sort();
  const users = Array.from(new Set(runs.map((r) => r.triggeredBy).filter(Boolean))).sort();

  const toggleStatus = (status: RunStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatus });
  };

  const toggleTrigger = (trigger: TriggerType) => {
    const newTriggers = filters.trigger.includes(trigger)
      ? filters.trigger.filter((t) => t !== trigger)
      : [...filters.trigger, trigger];
    setFilters({ trigger: newTriggers });
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      trigger: [],
      timeRange: "24h",
      workflowId: undefined,
      user: undefined,
      showFailedOnly: false,
      showSlowRuns: false,
    });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.trigger.length > 0 ||
    filters.timeRange !== "24h" ||
    filters.workflowId ||
    filters.user ||
    filters.showFailedOnly ||
    filters.showSlowRuns;

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            <XMarkIcon className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs mb-2 block">Status</Label>
          <div className="flex flex-wrap gap-1">
            {statusOptions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filters.status.includes(status) ? "default" : "outline"}
                onClick={() => toggleStatus(status)}
                className="text-xs"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Trigger</Label>
          <div className="flex flex-wrap gap-1">
            {triggerOptions.map((trigger) => (
              <Button
                key={trigger}
                size="sm"
                variant={filters.trigger.includes(trigger) ? "default" : "outline"}
                onClick={() => toggleTrigger(trigger)}
                className="text-xs"
              >
                {trigger}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Time Range</Label>
          <Select
            value={filters.timeRange}
            onValueChange={(value) => setFilters({ timeRange: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Workflow</Label>
          <Select
            value={filters.workflowId || "all"}
            onValueChange={(value) => setFilters({ workflowId: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All workflows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workflows</SelectItem>
              {workflows.map((wf) => (
                <SelectItem key={wf} value={wf}>
                  {wf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs mb-2 block">User</Label>
          <Select
            value={filters.user || "all"}
            onValueChange={(value) => setFilters({ user: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="failed-only"
            checked={filters.showFailedOnly || false}
            onCheckedChange={(checked) => setFilters({ showFailedOnly: checked })}
          />
          <Label htmlFor="failed-only" className="text-xs cursor-pointer">
            Show failed only
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="slow-runs"
            checked={filters.showSlowRuns || false}
            onCheckedChange={(checked) => setFilters({ showSlowRuns: checked })}
          />
          <Label htmlFor="slow-runs" className="text-xs cursor-pointer">
            Show slow runs (&gt; {((filters.slowRunThreshold || 10000) / 1000).toFixed(0)}s)
          </Label>
        </div>
      </div>
    </div>
  );
};

