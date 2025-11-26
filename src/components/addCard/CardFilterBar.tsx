import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAddCardStore } from "@/stores/addCardStore";
import { mockCards } from "@/data/mockCards";

export const CardFilterBar = () => {
  const filters = useAddCardStore((state) => state.filters);
  const setFilter = useAddCardStore((state) => state.setFilter);

  const apps = Array.from(new Set(mockCards.map((c) => c.app))).sort();
  const categories = Array.from(new Set(mockCards.map((c) => c.category))).sort();

  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs mb-1 block">App</Label>
          <Select
            value={filters.app}
            onValueChange={(value) => setFilter("app", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              {apps.map((app) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs mb-1 block">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilter("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs mb-1 block">Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilter("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="query">Query</SelectItem>
              <SelectItem value="transform">Transform</SelectItem>
              <SelectItem value="logic">Logic Node</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

