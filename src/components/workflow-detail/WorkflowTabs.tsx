import { useState, ReactNode } from "react";
import { clsx } from "clsx";

interface WorkflowTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export const WorkflowTabs = ({ activeTab, onTabChange, children }: WorkflowTabsProps) => {
  const tabs = [
    { id: "canvas", label: "Canvas" },
    { id: "runs", label: "Run History" },
    { id: "settings", label: "Settings" },
    { id: "versions", label: "Versions" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

