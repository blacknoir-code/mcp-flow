import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, CheckCircle2, Loader2, AlertCircle, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "pending" | "running" | "success" | "error";

interface WorkflowCardProps {
  title: string;
  app: string;
  status: Status;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  icon?: React.ComponentType<{ className?: string }>;
}

const statusConfig = {
  pending: {
    icon: AlertCircle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    animate: "",
  },
  running: {
    icon: Loader2,
    color: "text-status-running",
    bg: "bg-status-running/10",
    border: "border-status-running/20",
    animate: "animate-spin",
  },
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    animate: "",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    animate: "",
  },
};

export const WorkflowCard = ({ 
  title, 
  app, 
  status, 
  inputs, 
  outputs,
  icon: Icon = Mail 
}: WorkflowCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-lg border-2",
      config.border,
      "animate-scale-in"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn("p-2 rounded-lg", config.bg)}>
            <Icon className={cn("h-5 w-5", config.color)} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{title}</h3>
              <Badge variant="outline" className="text-xs">{app}</Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <StatusIcon className={cn("h-4 w-4", config.color, config.animate)} />
              <span className={cn("text-xs font-medium capitalize", config.color)}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
          {inputs && Object.keys(inputs).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">INPUTS</div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono">
                {JSON.stringify(inputs, null, 2)}
              </div>
            </div>
          )}
          
          {outputs && Object.keys(outputs).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">OUTPUTS</div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono">
                {JSON.stringify(outputs, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
