import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Heart, MessageCircle, Repeat2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TweetPreviewProps {
  content: string;
  characterCount: number;
  createdAt?: string;
}

export function TweetPreview({ content, characterCount, createdAt }: TweetPreviewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Tweet copied!",
        description: "Tweet has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy tweet to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getCharacterCountColor = () => {
    if (characterCount > 280) return "text-destructive";
    if (characterCount > 260) return "text-warning";
    return "text-success";
  };

  return (
    <div className="tweet-preview bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all">
      <div className="flex items-start space-x-3">
        {/* User avatar placeholder */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">AI</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold" data-testid="text-username">Sentient AI</span>
            <span className="text-muted-foreground" data-testid="text-handle">@sentient_ai</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">
              {createdAt ? new Date(createdAt).toLocaleTimeString() : "now"}
            </span>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-tweet-content">
            {content}
          </p>
          <div className="flex items-center justify-between mt-4 text-muted-foreground">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors" data-testid="button-comment">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">12</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-green-500 transition-colors" data-testid="button-retweet">
                <Repeat2 className="h-4 w-4" />
                <span className="text-sm">34</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-red-500 transition-colors" data-testid="button-like">
                <Heart className="h-4 w-4" />
                <span className="text-sm">89</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className={cn("text-xs px-2 py-1 rounded-full", getCharacterCountColor())}>
                <span data-testid="text-character-count">{characterCount}</span>/280
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy to clipboard"
                data-testid="button-copy-tweet"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
