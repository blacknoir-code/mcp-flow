import { clsx } from "clsx";
import {
  PaintBrushIcon,
  BellIcon,
  BoltIcon,
  ClockIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  KeyIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export type SettingsSection =
  | "theme"
  | "notifications"
  | "concurrency"
  | "retention"
  | "privacy"
  | "workspace"
  | "audit"
  | "tokens"
  | "billing";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections: Array<{ id: SettingsSection; label: string; icon: any }> = [
  { id: "theme", label: "Theme", icon: PaintBrushIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "concurrency", label: "Concurrency", icon: BoltIcon },
  { id: "retention", label: "Data Retention", icon: ClockIcon },
  { id: "privacy", label: "Privacy & Permissions", icon: ShieldCheckIcon },
  { id: "workspace", label: "Workspace", icon: BuildingOfficeIcon },
  { id: "audit", label: "Audit Logs", icon: DocumentTextIcon },
  { id: "tokens", label: "Auth Tokens", icon: KeyIcon },
  { id: "billing", label: "Billing", icon: CreditCardIcon },
];

export const SettingsSidebar = ({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-sm text-gray-900">Settings</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1",
                activeSection === section.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

