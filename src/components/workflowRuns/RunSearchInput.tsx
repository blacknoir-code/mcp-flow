import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRunsStore } from "@/stores/runsStore";

export const RunSearchInput = () => {
  const searchText = useRunsStore((state) => state.filters.searchText);
  const setFilters = useRunsStore((state) => state.setFilters);

  return (
    <div className="relative mb-4">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search runs by ID, workflow, logs, or user..."
        value={searchText}
        onChange={(e) => setFilters({ searchText: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Focus will naturally move to table
            e.currentTarget.blur();
          }
        }}
        className="pl-10"
        aria-label="Search workflow runs"
      />
    </div>
  );
};

