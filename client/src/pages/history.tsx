import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { TweetPreview } from "@/components/TweetPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Brain } from "lucide-react";

export default function HistoryPage() {
  const isMobile = useIsMobile();

  const { data: historyData, isLoading } = useQuery<{success: boolean; tweets: any[]}>({
    queryKey: ["/api/tweets/history"],
    staleTime: 30000,
  });

  const { data: stats } = useQuery<{success: boolean; stats: {generated: number; copied: number}}>({
    queryKey: ["/api/tweets/stats"],
  });

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-xl bg-card/80">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Brain className="text-primary-foreground text-sm" />
              </div>
              <h1 className="text-lg font-bold" data-testid="text-mobile-title">Tweet History</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 pb-20">
          <div className="space-y-4">
            {/* Stats Card */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-stats-generated">
                      {stats?.stats?.generated || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success" data-testid="text-stats-copied">
                      {stats?.stats?.copied || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Copied</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-secondary rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : historyData?.tweets && historyData.tweets.length > 0 ? (
              historyData.tweets.map((tweet: any, index: number) => (
                <TweetPreview
                  key={tweet.id || index}
                  content={tweet.content}
                  characterCount={tweet.characterCount}
                  createdAt={tweet.createdAt}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tweets yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate some tweets to see them here
                  </p>
                  <Button data-testid="button-start-generating">
                    Start Generating
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold mb-2" data-testid="text-page-title">Tweet History</h2>
              <p className="text-muted-foreground">View and manage your generated tweets</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <History className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-2xl font-bold" data-testid="text-stats-generated">
                            {stats?.stats?.generated || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Generated</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Download className="h-8 w-8 text-success" />
                        <div>
                          <div className="text-2xl font-bold text-success" data-testid="text-stats-copied">
                            {stats?.stats?.copied || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Copied</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center">
                        <Button variant="outline" size="sm" data-testid="button-clear-history">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tweet List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tweets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-32 bg-secondary rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : historyData?.tweets && historyData.tweets.length > 0 ? (
                      historyData.tweets.map((tweet: any, index: number) => (
                        <TweetPreview
                          key={tweet.id || index}
                          content={tweet.content}
                          characterCount={tweet.characterCount}
                          createdAt={tweet.createdAt}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No tweets yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Generate some tweets to see them appear here
                        </p>
                        <Button data-testid="button-start-generating">
                          Start Generating
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}