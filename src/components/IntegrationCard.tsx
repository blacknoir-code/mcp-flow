import { CheckCircle2, AlertCircle, Clock, Mail, CheckSquare, MessageSquare, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IntegrationStatus = "connected" | "needs-auth" | "error";

interface IntegrationCardProps {
  name: string;
  status: IntegrationStatus;
  lastSync?: string;
  icon?: LucideIcon;
}

const statusConfig = {
  connected: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    badge: "Connected",
    badgeVariant: "default" as const,
  },
  "needs-auth": {
    icon: AlertCircle,
    color: "text-warning",
    bg: "bg-warning/10",
    badge: "Needs Auth",
    badgeVariant: "outline" as const,
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    badge: "Error",
    badgeVariant: "destructive" as const,
  },
};

const defaultIcons: Record<string, LucideIcon> = {
  Gmail: Mail,
  Jira: CheckSquare,
  Slack: MessageSquare,
};

export const IntegrationCard = ({ 
  name, 
  status, 
  lastSync,
  icon 
}: IntegrationCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const AppIcon = icon || defaultIcons[name] || Mail;

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-xl", config.bg)}>
            <AppIcon className={cn("h-6 w-6", config.color)} />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            {lastSync && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last sync: {lastSync}</span>
              </div>
            )}
          </div>
        </div>
        <Badge variant={config.badgeVariant} className="flex items-center gap-1">
          <StatusIcon className="h-3 w-3" />
          {config.badge}
        </Badge>
      </div>

      <div className="flex gap-2">
        {status === "connected" && (
          <>
            <Button variant="outline" size="sm" className="flex-1">
              Configure
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              Disconnect
            </Button>
          </>
        )}
        {status === "needs-auth" && (
          <Button size="sm" className="w-full">
            Authenticate
          </Button>
        )}
        {status === "error" && (
          <Button variant="destructive" size="sm" className="w-full">
            Reconnect
          </Button>
        )}
      </div>
    </Card>
  );
};
