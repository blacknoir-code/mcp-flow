import { useRunsStore } from "@/stores/runsStore";
import { Card } from "@/components/ui/card";
import { MetricsSparkline } from "@/components/mcp/MetricsSparkline";
import dayjs from "dayjs";

export const RunMetricsSummary = () => {
  const getMetrics = useRunsStore((state) => state.getMetrics);
  const metrics = getMetrics();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-sm text-gray-500 mb-1">Average Duration</div>
        <div className="text-2xl font-bold">{Math.round(metrics.avgDuration)}ms</div>
        <div className="text-xs text-gray-400 mt-1">
          Median: {Math.round(metrics.medianDuration)}ms
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500 mb-1">Success Rate</div>
        <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
        <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500 mb-1">Total Runs</div>
        <div className="text-2xl font-bold">{metrics.runsLast24h}</div>
        <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500 mb-1">Runs per Hour</div>
        <MetricsSparkline
          data={metrics.runsPerHour}
          width={200}
          height={40}
          color="#2B6DF6"
        />
        <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
      </Card>
    </div>
  );
};

