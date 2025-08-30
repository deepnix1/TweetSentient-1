import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, HelpCircle, Lightbulb, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AdvancedOptionsProps {
  onTemplateSelect: (template: string) => void;
}

export function AdvancedOptions({ onTemplateSelect }: AdvancedOptionsProps) {
  const { data: stats } = useQuery<{success: boolean; stats: {generated: number; copied: number}}>({
    queryKey: ["/api/tweets/stats"],
  });

  const { data: historyData } = useQuery<{success: boolean; tweets: any[]}>({
    queryKey: ["/api/tweets/history"],
    staleTime: 30000,
  });

  const templates = [
    {
      id: "announcement",
      icon: Megaphone,
      title: "📢 Announcement",
      description: "Share news or updates",
      template: "Exciting news! [Your announcement here] 📢",
    },
    {
      id: "question",
      icon: HelpCircle,
      title: "❓ Question",
      description: "Engage your audience",
      template: "Quick question for my followers: [Your question here] 🤔",
    },
    {
      id: "insight",
      icon: Lightbulb,
      title: "💡 Insight",
      description: "Share valuable thoughts",
      template: "Here's something I learned today: [Your insight here] 💡",
    },
    {
      id: "thread",
      icon: MessageSquare,
      title: "🧵 Thread Starter",
      description: "Begin a conversation",
      template: "🧵 Thread: Let me share my thoughts on [topic] 1/",
    },
  ];

  return (
    <aside className="hidden xl:block w-80 bg-card border-l border-border p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
      
      {/* Quick Templates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Quick Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Button
                key={template.id}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => onTemplateSelect(template.template)}
                data-testid={`button-template-${template.id}`}
              >
                <div className="text-left">
                  <div className="font-medium">{template.title}</div>
                  <div className="text-sm text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Generation Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Session Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-2xl font-bold text-primary" data-testid="text-stats-generated">
                {stats?.stats?.generated || 0}
              </div>
              <div className="text-xs text-muted-foreground">Generated</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-2xl font-bold text-success" data-testid="text-stats-copied">
                {stats?.stats?.copied || 0}
              </div>
              <div className="text-xs text-muted-foreground">Copied</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Recent History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {historyData?.tweets?.slice(0, 3).map((tweet: any, index: number) => (
            <div
              key={tweet.id || index}
              className="p-3 bg-secondary/30 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => onTemplateSelect(tweet.content)}
              data-testid={`card-history-${index}`}
            >
              <p className="text-sm line-clamp-2">{tweet.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(tweet.createdAt).toLocaleDateString()}
                </span>
                <button className="text-xs text-primary hover:underline">Use Again</button>
              </div>
            </div>
          ))}
          {(!historyData?.tweets || historyData.tweets.length === 0) && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No history yet</p>
              <p className="text-xs">Generate some tweets to see them here</p>
            </div>
          )}
          <Button variant="ghost" className="w-full" data-testid="button-view-all-history">
            View All History
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
