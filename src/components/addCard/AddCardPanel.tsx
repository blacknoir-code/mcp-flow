import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAddCardStore } from "@/stores/addCardStore";
import { CardSearch } from "./CardSearch";
import { CardFilterBar } from "./CardFilterBar";
import { CardList } from "./CardList";
import { CardPreview } from "./CardPreview";
import { clsx } from "clsx";

export const AddCardPanel = () => {
  const isOpen = useAddCardStore((state) => state.isOpen);
  const close = useAddCardStore((state) => state.close);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === "Escape") {
        close();
        return;
      }

      // Focus search on "/"
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={clsx(
          "fixed right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-2xl z-50",
          "flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Add Card Panel"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Card</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse and insert workflow cards
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex-shrink-0 border-b px-6 py-4 space-y-4 bg-gray-50">
          <CardSearch ref={searchInputRef} />
          <CardFilterBar />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Card List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 border-r">
            <CardList />
          </div>

          {/* Preview Panel */}
          <div className="w-80 flex-shrink-0 border-l bg-gray-50">
            <CardPreview />
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t px-6 py-3 bg-gray-50">
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">/</kbd>{" "}
              to search
            </p>
            <p>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Enter</kbd>{" "}
              to preview,{" "}
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Shift+Enter</kbd>{" "}
              to insert
            </p>
            <p>
              Drag a card to the canvas or click{" "}
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">+</kbd>{" "}
              to insert
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

