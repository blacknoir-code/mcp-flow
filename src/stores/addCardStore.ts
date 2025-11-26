import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Card } from "@/data/mockCards";

interface AddCardState {
  isOpen: boolean;
  search: string;
  selectedCard: Card | null;
  filters: {
    app: string;
    category: string;
    type: string;
  };

  open: () => void;
  close: () => void;
  setSearch: (search: string) => void;
  setSelectedCard: (card: Card | null) => void;
  setFilter: (key: string, value: string) => void;
  reset: () => void;
}

const defaultFilters = {
  app: "all",
  category: "all",
  type: "all",
};

export const useAddCardStore = create<AddCardState>()(
  persist(
    (set) => ({
      isOpen: false,
      search: "",
      selectedCard: null,
      filters: defaultFilters,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, selectedCard: null }),
      setSearch: (search) => set({ search }),
      setSelectedCard: (selectedCard) => set({ selectedCard }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      reset: () =>
        set({
          search: "",
          selectedCard: null,
          filters: defaultFilters,
        }),
    }),
    {
      name: "add-card-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

