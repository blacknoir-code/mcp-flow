import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRunsStore } from "@/stores/runsStore";

export const PaginationControls = () => {
  const pagination = useRunsStore((state) => state.pagination);
  const setPagination = useRunsStore((state) => state.setPagination);
  const queryRuns = useRunsStore((state) => state.queryRuns);
  const runs = queryRuns();

  const totalPages = Math.ceil(runs.length / pagination.perPage);
  const startIndex = (pagination.page - 1) * pagination.perPage;
  const endIndex = Math.min(startIndex + pagination.perPage, runs.length);
  const currentPageRuns = runs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setPagination({ page: Math.max(1, Math.min(page, totalPages)) });
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Showing {startIndex + 1}-{endIndex} of {runs.length} runs
        </span>
        <Select
          value={pagination.perPage.toString()}
          onValueChange={(value) => setPagination({ perPage: parseInt(value), page: 1 })}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">per page</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => goToPage(pagination.page - 1)}
          disabled={pagination.page === 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages || 1}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => goToPage(pagination.page + 1)}
          disabled={pagination.page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

