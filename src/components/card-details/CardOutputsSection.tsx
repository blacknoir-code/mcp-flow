import { useState } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DocumentDuplicateIcon, ArrowDownTrayIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useCardDetails } from "@/hooks/useCardDetails";
// Using simple pre tag for JSON display

interface CardOutputsSectionProps {
  node: Node<NodeData>;
}

const maskSensitiveData = (obj: any, mask: boolean): any => {
  if (!mask) return obj;
  if (typeof obj !== "object" || obj === null) return obj;
  
  const masked = { ...obj };
  for (const key in masked) {
    if (typeof key === "string" && (key.toLowerCase().includes("email") || key.toLowerCase().includes("token") || key.toLowerCase().includes("secret"))) {
      masked[key] = "***";
    } else if (typeof masked[key] === "object") {
      masked[key] = maskSensitiveData(masked[key], mask);
    }
  }
  return masked;
};

export const CardOutputsSection = ({ node }: CardOutputsSectionProps) => {
  const { executionData, getMockResponse } = useCardDetails(node.id);
  const [maskPII, setMaskPII] = useState(false);
  
  const output = executionData?.mockResponse || node.data.mockResponse || getMockResponse(node);
  const maskedOutput = maskSensitiveData(output, maskPII);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(maskedOutput, null, 2));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(maskedOutput, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${node.data.title.replace(/\s+/g, "_")}_output.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Outputs</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {maskPII ? <EyeSlashIcon className="w-4 h-4 text-gray-500" /> : <EyeIcon className="w-4 h-4 text-gray-500" />}
            <Label htmlFor="mask-pii" className="text-xs cursor-pointer">
              Mask PII
            </Label>
            <Switch
              id="mask-pii"
              checked={maskPII}
              onCheckedChange={setMaskPII}
            />
          </div>
          <Button onClick={handleCopy} size="sm" variant="outline" aria-label="Copy output">
            <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button onClick={handleDownload} size="sm" variant="outline" aria-label="Download output">
            <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <pre className="text-green-400 p-4 text-xs overflow-auto m-0">
          {JSON.stringify(maskedOutput, null, 2)}
        </pre>
      </div>
    </div>
  );
};

