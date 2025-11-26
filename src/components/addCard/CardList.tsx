import { useMemo } from "react";
import { Card } from "@/data/mockCards";
import { CardItem } from "./CardItem";
import { useAddCardStore } from "@/stores/addCardStore";
import { mockCards } from "@/data/mockCards";

export const CardList = () => {
  const search = useAddCardStore((state) => state.search);
  const filters = useAddCardStore((state) => state.filters);

  const filteredCards = useMemo(() => {
    let cards: Card[] = [...mockCards];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      cards = cards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchLower) ||
          card.description.toLowerCase().includes(searchLower) ||
          card.app.toLowerCase().includes(searchLower) ||
          card.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply app filter
    if (filters.app !== "all") {
      cards = cards.filter((card) => card.app === filters.app);
    }

    // Apply category filter
    if (filters.category !== "all") {
      cards = cards.filter((card) => card.category === filters.category);
    }

    // Apply type filter
    if (filters.type !== "all") {
      cards = cards.filter((card) => card.type === filters.type);
    }

    // Sort: Group by App, then by Category, then alphabetical
    cards.sort((a, b) => {
      if (a.app !== b.app) {
        return a.app.localeCompare(b.app);
      }
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });

    return cards;
  }, [search, filters]);

  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-sm mb-2">No cards found</p>
        <p className="text-gray-400 text-xs">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredCards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};

