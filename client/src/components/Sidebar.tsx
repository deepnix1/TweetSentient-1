import { Link, useLocation } from "wouter";
import { Brain, History, Settings, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Generate", href: "/", icon: Sparkles, current: location === "/" },
    { name: "History", href: "/history", icon: History, current: location === "/history" },
    { name: "Settings", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
            <Brain className="text-primary-foreground text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-app-title">Sentient</h1>
            <p className="text-sm text-muted-foreground">Tweet Generator</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer",
                    item.current
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50"
                  )}
                  data-testid={`link-${item.name.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className={item.current ? "font-medium" : ""}>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <div className="flex items-center space-x-3 p-3 rounded-lg">
          <ThemeToggle />
          <span>Dark Mode</span>
        </div>
      </div>
    </aside>
  );
}
