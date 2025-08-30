import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Bot, Combine, Expand } from "lucide-react";
import { type TweetStyle } from "@shared/schema";

interface StyleSelectorProps {
  style: TweetStyle;
  onStyleChange: (style: TweetStyle) => void;
}

export function StyleSelector({ style, onStyleChange }: StyleSelectorProps) {
  const updateStyle = (updates: Partial<TweetStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tweet Style Options</h3>
      
      {/* Tone Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tone</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={style.tone === "professional" ? "default" : "outline"}
            onClick={() => updateStyle({ tone: "professional" })}
            className="justify-start"
            data-testid="button-tone-professional"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Professional
          </Button>
          <Button
            variant={style.tone === "autonomous" ? "default" : "outline"}
            onClick={() => updateStyle({ tone: "autonomous" })}
            className="justify-start"
            data-testid="button-tone-autonomous"
          >
            <Bot className="mr-2 h-4 w-4" />
            Autonomous
          </Button>
        </div>
      </div>

      {/* Length Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Length</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={style.length === "concise" ? "default" : "outline"}
            onClick={() => updateStyle({ length: "concise" })}
            className="justify-start"
            data-testid="button-length-concise"
          >
            <Combine className="mr-2 h-4 w-4" />
            Concise
          </Button>
          <Button
            variant={style.length === "expanded" ? "default" : "outline"}
            onClick={() => updateStyle({ length: "expanded" })}
            className="justify-start"
            data-testid="button-length-expanded"
          >
            <Expand className="mr-2 h-4 w-4" />
            Expanded
          </Button>
        </div>
      </div>

      {/* Emoji Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">😊</span>
          <div>
            <div className="font-medium">Include Emojis</div>
            <div className="text-sm text-muted-foreground">Add emojis to make tweets more engaging</div>
          </div>
        </div>
        <Switch
          checked={style.includeEmojis}
          onCheckedChange={(checked) => updateStyle({ includeEmojis: checked })}
          data-testid="switch-include-emojis"
        />
      </div>
    </div>
  );
}
