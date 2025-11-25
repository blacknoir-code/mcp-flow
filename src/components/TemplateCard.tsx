import { Mail, CheckSquare, MessageSquare, Clock, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  title: string;
  description: string;
  category: string;
  integrations: string[];
  timeSaved: string;
}

const integrationIcons: Record<string, LucideIcon> = {
  Gmail: Mail,
  Jira: CheckSquare,
  Slack: MessageSquare,
};

export const TemplateCard = ({ 
  title, 
  description, 
  category, 
  integrations,
  timeSaved 
}: TemplateCardProps) => {
  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {title}
            </h3>
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {integrations.map((integration) => {
            const Icon = integrationIcons[integration] || Mail;
            return (
              <div
                key={integration}
                className="flex items-center gap-1.5 bg-muted px-2.5 py-1.5 rounded-lg"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{integration}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Saves {timeSaved}</span>
          </div>
          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Use Template
          </Button>
        </div>
      </div>
    </Card>
  );
};
