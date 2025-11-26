import { useState, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAddCardStore } from "@/stores/addCardStore";

export const CardSearch = forwardRef<HTMLInputElement>((props, ref) => {
  const search = useAddCardStore((state) => state.search);
  const setSearch = useAddCardStore((state) => state.setSearch);
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  return (
    <div className="relative mb-4">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        ref={ref}
        placeholder="Search cards by name, description, or tags..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setLocalSearch("");
            setSearch("");
          }
        }}
        className="pl-10 pr-10"
        aria-label="Search cards"
      />
      {localSearch && (
        <button
          onClick={() => {
            setLocalSearch("");
            setSearch("");
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
          aria-label="Clear search"
        >
          <XMarkIcon className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
});

CardSearch.displayName = "CardSearch";

