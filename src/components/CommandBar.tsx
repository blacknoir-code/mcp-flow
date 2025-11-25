import { useState } from "react";
import { Search, Sparkles, Mail, CheckSquare, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const CommandBar = () => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const detectedApps = input.length > 10 ? [
    { name: "Gmail", icon: Mail },
    { name: "Jira", icon: CheckSquare },
    { name: "Slack", icon: MessageSquare },
  ] : [];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(e.target.value.length > 3);
            }}
            placeholder="What do you want to automate?"
            className="pl-12 pr-4 py-6 text-lg bg-card border-border shadow-lg focus-visible:ring-primary focus-visible:ring-2 rounded-xl"
          />
          {input && (
            <Button 
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-electric-glow animate-glow-pulse"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Workflow
            </Button>
          )}
        </div>

        {detectedApps.length > 0 && (
          <div className="flex gap-2 mt-3 animate-fade-in">
            {detectedApps.map((app) => (
              <Badge 
                key={app.name} 
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5"
              >
                <app.icon className="h-3.5 w-3.5" />
                {app.name}
              </Badge>
            ))}
          </div>
        )}

        {showSuggestions && (
          <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-xl p-2 animate-scale-in z-50">
            <div className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
              <div className="font-medium text-sm">Update Jira tickets from Gmail</div>
              <div className="text-xs text-muted-foreground mt-1">
                Get unread emails → Extract ticket IDs → Update in Jira
              </div>
            </div>
            <div className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
              <div className="font-medium text-sm">Summarize and post to Slack</div>
              <div className="text-xs text-muted-foreground mt-1">
                Collect updates → Generate summary → Post to channel
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
