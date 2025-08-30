import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TweetGenerator } from "@/components/TweetGenerator";
import { AdvancedOptions } from "@/components/AdvancedOptions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Brain, Menu, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const isMobile = useIsMobile();

  const handleTemplateSelect = (template: string) => {
    setPrompt(template);
  };

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
              <h1 className="text-lg font-bold" data-testid="text-mobile-title">Sentient Tweet Generator</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          <TweetGenerator onTemplateSelect={handleTemplateSelect} />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-xl bg-card/80 z-40">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center p-2 text-primary" data-testid="button-mobile-generate">
              <Sparkles className="text-lg h-5 w-5" />
              <span className="text-xs mt-1">Generate</span>
            </button>
            <button className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-mobile-history">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1">History</span>
            </button>
            <button className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-mobile-stats">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1">Stats</span>
            </button>
            <button className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-mobile-settings">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </nav>

        {/* Floating Action Button */}
        <Button
          size="icon"
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform z-30"
          data-testid="button-mobile-fab"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex overflow-hidden">
          <TweetGenerator onTemplateSelect={handleTemplateSelect} />
          <AdvancedOptions onTemplateSelect={handleTemplateSelect} />
        </main>
      </div>
    </div>
  );
}
