interface MetricsSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const MetricsSparkline = ({
  data,
  width = 100,
  height = 30,
  color = "#2B6DF6",
}: MetricsSparklineProps) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
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
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

