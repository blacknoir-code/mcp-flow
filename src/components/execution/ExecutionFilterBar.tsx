import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExecutionStore } from "@/stores/executionStore";
import { FilterIcon } from "lucide-react";

export const ExecutionFilterBar = () => {
  const { filter, timeRange, setFilter, setTimeRange } = useExecutionStore();

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
      <FilterIcon className="w-4 h-4 text-gray-500" />
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">Status:</span>
        <div className="flex gap-1">
          <Button
            onClick={() => setFilter("all")}
            size="sm"
            variant={filter === "all" ? "default" : "ghost"}
            className="h-7 text-xs"
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("errors")}
            size="sm"
            variant={filter === "errors" ? "default" : "ghost"}
            className="h-7 text-xs"
          >
            Errors
          </Button>
          <Button
            onClick={() => setFilter("success")}
            size="sm"
            variant={filter === "success" ? "default" : "ghost"}
            className="h-7 text-xs"
          >
            Success
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-gray-600">Time:</span>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_run">Last Run</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

