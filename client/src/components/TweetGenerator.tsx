import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { StyleSelector } from "./StyleSelector";
import { TweetPreview } from "./TweetPreview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type TweetStyle, type GenerateTweetRequest } from "@shared/schema";

interface GeneratedTweet {
  id: string;
  content: string;
  characterCount: number;
  style: TweetStyle;
  createdAt: string;
}

interface TweetGeneratorProps {
  onTemplateSelect?: (template: string) => void;
}

export function TweetGenerator({ onTemplateSelect }: TweetGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<TweetStyle>({
    tone: "professional",
    length: "concise",
    includeEmojis: true,
  });
  const [generatedTweets, setGeneratedTweets] = useState<GeneratedTweet[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (request: GenerateTweetRequest) => {
      const response = await apiRequest("POST", "/api/tweets/generate", request);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedTweets(data.tweets);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["/api/tweets/history"] });
        queryClient.invalidateQueries({ queryKey: ["/api/tweets/stats"] });
        toast({
          title: "Tweets generated!",
          description: `Generated ${data.tweets.length} tweet variations.`,
        });
      } else {
        throw new Error(data.error || "Failed to generate tweets");
      }
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate tweets",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a topic or idea for your tweet.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({ prompt: prompt.trim(), style });
  };

  const handleTemplateUse = (template: string) => {
    setPrompt(template);
  };

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold mb-2" data-testid="text-page-title">Generate AI Tweets</h2>
        <p className="text-muted-foreground">Create engaging tweets with the power of Sentient AI</p>
      </div>

      {/* Generation Form */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">What would you like to tweet about?</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your topic, idea, or ask the AI to create something specific..."
            className="min-h-24 resize-none"
            maxLength={500}
            data-testid="textarea-prompt"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Be specific for better results</span>
            <span data-testid="text-prompt-length">{prompt.length}/500</span>
          </div>
        </div>

        {/* Style Options */}
        <StyleSelector style={style} onStyleChange={setStyle} />

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full"
          size="lg"
          data-testid="button-generate-tweets"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sentient AI is crafting your tweets...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Tweets
            </>
          )}
        </Button>

        {/* Loading State */}
        {generateMutation.isPending && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 text-primary mb-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sentient AI is crafting your tweets...</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "65%" }}></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Tweets */}
        {generatedTweets.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="text-primary mr-2 h-5 w-5" />
                Generated Tweets
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                data-testid="button-regenerate"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
            
            {generatedTweets.map((tweet, index) => (
              <TweetPreview
                key={tweet.id || index}
                content={tweet.content}
                characterCount={tweet.characterCount}
                createdAt={tweet.createdAt}
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {generateMutation.isError && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Failed to generate tweets</p>
                <p className="text-sm mt-1">
                  {generateMutation.error instanceof Error 
                    ? generateMutation.error.message 
                    : "An unexpected error occurred. Please try again."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => generateMutation.reset()}
                  data-testid="button-try-again"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
