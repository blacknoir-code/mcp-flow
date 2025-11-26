import { Card } from "@/data/mockCards";
import { PlusIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useAddCardStore } from "@/stores/addCardStore";
import { insertCardIntoCanvas } from "@/utils/canvasHelpers";

interface CardItemProps {
  card: Card;
  onInsert?: () => void;
}

export const CardItem = ({ card, onInsert }: CardItemProps) => {
  const setSelectedCard = useAddCardStore((state) => state.setSelectedCard);

  const handleClick = () => {
    setSelectedCard(card);
  };

  const handleInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    insertCardIntoCanvas(card);
    onInsert?.();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "action":
        return "bg-blue-100 text-blue-700";
      case "query":
        return "bg-green-100 text-green-700";
      case "transform":
        return "bg-purple-100 text-purple-700";
      case "logic":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplexityColor = (complexity: string) => {
    return complexity === "advanced"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div
      className={clsx(
        "group relative p-3 border rounded-lg cursor-pointer transition-all",
        "hover:border-blue-400 hover:shadow-md bg-white",
        "flex items-start gap-3"
      )}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          handleInsert(e as any);
        }
      }}
      aria-label={`${card.name} - ${card.description}`}
    >
      <div
        className="flex-shrink-0 mt-1 cursor-move text-gray-400 hover:text-gray-600"
        draggable={false}
        onClick={(e) => e.stopPropagation()}
      >
        <Bars3Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm text-gray-900 truncate">
            {card.name}
          </h4>
          <span
            className={clsx(
              "px-1.5 py-0.5 text-xs font-medium rounded",
              getTypeColor(card.type)
            )}
          >
            {card.type}
          </span>
          {card.complexity === "advanced" && (
            <span
              className={clsx(
                "px-1.5 py-0.5 text-xs font-medium rounded",
                getComplexityColor(card.complexity)
              )}
            >
              Advanced
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-gray-500">{card.app}</span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-500 capitalize">{card.category}</span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {card.description}
        </p>

        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-xs text-gray-400">
                +{card.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleInsert}
        className={clsx(
          "flex-shrink-0 p-1.5 rounded-md transition-colors",
          "opacity-0 group-hover:opacity-100",
          "bg-blue-50 hover:bg-blue-100 text-blue-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500"
        )}
        aria-label={`Insert ${card.name}`}
        title="Insert card (Shift+Enter)"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

