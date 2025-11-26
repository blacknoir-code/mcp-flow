import { useState } from "react";
import { Copy, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExecutionEvent } from "@/stores/executionStore";

interface LogViewerProps {
  events: ExecutionEvent[];
  mockResponse?: any;
  onCopy?: () => void;
}

export const LogViewer = ({ events, mockResponse, onCopy }: LogViewerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maskPII, setMaskPII] = useState(false);

  const maskSensitiveData = (text: string): string => {
    if (!maskPII) return text;
    
    // Mask email addresses
    text = text.replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, "***@***.***");
    // Mask tokens/keys
    text = text.replace(/\b[A-Za-z0-9]{32,}\b/g, "***");
    // Mask SSN-like patterns
    text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "***-**-****");
    
    return text;
  };

  const formatJSON = (obj: any): string => {
    try {
      const jsonStr = JSON.stringify(obj, null, 2);
      return maskPII ? maskSensitiveData(jsonStr) : jsonStr;
    } catch {
      return String(obj);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.log?.toLowerCase().includes(query) ||
      event.error?.toLowerCase().includes(query) ||
      JSON.stringify(event.data || {}).toLowerCase().includes(query)
    );
  });

  const handleCopy = () => {
    const content = [
      ...events.map((e) => e.log || e.error || "").filter(Boolean),
      mockResponse ? formatJSON(mockResponse) : "",
    ].join("\n");

    navigator.clipboard.writeText(content);
    onCopy?.();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          onClick={() => setMaskPII(!maskPII)}
          size="sm"
          variant="outline"
          aria-label={maskPII ? "Show PII" : "Mask PII"}
        >
          {maskPII ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button onClick={handleCopy} size="sm" variant="outline" aria-label="Copy logs">
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {/* Logs */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-xs">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-500">No logs available</p>
        ) : (
          <div className="space-y-1">
            {filteredEvents.map((event, idx) => (
              <div key={idx} className="text-gray-700">
                {event.log && (
                  <div className={event.log.includes("[ERROR]") ? "text-red-600" : ""}>
                    {maskSensitiveData(event.log)}
                  </div>
                )}
                {event.error && (
                  <div className="text-red-600">{maskSensitiveData(event.error)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JSON Response */}
      {mockResponse && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Response JSON</h4>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap">
              {formatJSON(mockResponse)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

