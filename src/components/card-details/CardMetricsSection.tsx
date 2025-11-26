import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { useCardDetails } from "@/hooks/useCardDetails";
import dayjs from "dayjs";

interface CardMetricsSectionProps {
  node: Node<NodeData>;
}

const Sparkline = ({ data }: { data: number[] }) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 200;
  const height = 40;
  const padding = 4;

  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1 || 1)) * (width - padding * 2) + padding;
    const y = height - ((value - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#2B6DF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CardMetricsSection = ({ node }: CardMetricsSectionProps) => {
  const { executionData, getExecutionMetrics } = useCardDetails(node.id);
  const metrics = getExecutionMetrics();

  if (!metrics && !executionData) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No execution metrics available</p>
        <p className="text-xs mt-1">Run the node to see metrics</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold text-sm">Execution Metrics</h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Total Runs</div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics?.totalRuns || 0}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics?.successRate || 0}%
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Avg Duration</div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics?.avgDuration || 0}ms
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Last Run</div>
          <div className="text-sm font-medium text-gray-900">
            {executionData?.endTime
              ? dayjs(executionData.endTime).fromNow()
              : "Never"}
          </div>
        </div>
      </div>

      {metrics && metrics.durations.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Duration Trend (last 10 runs)</div>
          <Sparkline data={metrics.durations} />
        </div>
      )}

      {metrics?.lastError && (
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Last Error</div>
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {metrics.lastError}
          </div>
        </div>
      )}
    </div>
  );
};

