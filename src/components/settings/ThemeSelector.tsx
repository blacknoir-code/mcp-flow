import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/stores/settingsStore";
import { clsx } from "clsx";

const accentColors = [
  { value: "#2B6DF6", name: "Blue" },
  { value: "#10B981", name: "Green" },
  { value: "#F59E0B", name: "Amber" },
  { value: "#EF4444", name: "Red" },
  { value: "#8B5CF6", name: "Purple" },
  { value: "#EC4899", name: "Pink" },
];

export const ThemeSelector = () => {
  const { theme, updateTheme } = useSettingsStore();
  const [typographyScale, setTypographyScale] = useState(
    theme.typography === "small" ? 0 : theme.typography === "large" ? 2 : 1
  );

  const handleTypographyChange = (value: number[]) => {
    const scale = value[0];
    setTypographyScale(scale);
    const typographyMap: ("small" | "normal" | "large")[] = ["small", "normal", "large"];
    updateTheme({ typography: typographyMap[scale] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
        <RadioGroup
          value={theme.mode}
          onValueChange={(value) => updateTheme({ mode: value as "light" | "dark" | "system" })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="cursor-pointer">
              Light
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark" className="cursor-pointer">
              Dark
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="cursor-pointer">
              System (follows OS)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
        <div className="grid grid-cols-6 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateTheme({ accent: color.value })}
              className={clsx(
                "w-12 h-12 rounded-lg border-2 transition-all",
                theme.accent === color.value
                  ? "border-gray-900 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.name} accent color`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Typography Scale</h3>
        <div className="space-y-2">
          <Slider
            value={[typographyScale]}
            onValueChange={handleTypographyChange}
            min={0}
            max={2}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Small</span>
            <span>Normal</span>
            <span>Large</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <Card className="p-4 border-2" style={{ borderColor: theme.accent }}>
          <div
            className={clsx(
              "space-y-2",
              typographyScale === 0 && "text-sm",
              typographyScale === 1 && "text-base",
              typographyScale === 2 && "text-lg"
            )}
          >
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-primary to-electric-glow" />
              <div>
                <div className="font-semibold">Sample Workflow</div>
                <div className="text-sm text-gray-600">Last run 2 hours ago</div>
              </div>
            </div>
            <div className="p-3 bg-white border rounded">
              <div className="font-medium mb-1">Card Title</div>
              <div className="text-sm text-gray-600">
                This is a preview of how your theme will look
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

