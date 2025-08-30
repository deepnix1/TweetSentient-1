import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, RotateCcw, Brain } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    defaultTone: "professional",
    defaultLength: "concise",
    defaultEmojis: true,
    autoSave: true,
    maxTweets: 3,
    customPrompt: "",
  });

  const handleSave = () => {
    localStorage.setItem('sentient-tweet-settings', JSON.stringify(settings));
    toast({
      title: "Settings saved!",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleReset = () => {
    setSettings({
      defaultTone: "professional",
      defaultLength: "concise", 
      defaultEmojis: true,
      autoSave: true,
      maxTweets: 3,
      customPrompt: "",
    });
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    });
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
              <h1 className="text-lg font-bold" data-testid="text-mobile-title">Settings</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 pb-20 space-y-4">
          <MobileSettings settings={settings} setSettings={setSettings} onSave={handleSave} onReset={handleReset} />
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
              <h2 className="text-2xl font-bold mb-2" data-testid="text-page-title">Settings</h2>
              <p className="text-muted-foreground">Customize your tweet generation preferences</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <DesktopSettings settings={settings} setSettings={setSettings} onSave={handleSave} onReset={handleReset} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileSettings({ settings, setSettings, onSave, onReset }: any) {
  return (
    <>
      <SettingsContent settings={settings} setSettings={setSettings} />
      <div className="flex gap-2">
        <Button onClick={onSave} className="flex-1" data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={onReset} variant="outline" data-testid="button-reset-settings">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

function DesktopSettings({ settings, setSettings, onSave, onReset }: any) {
  return (
    <>
      <SettingsContent settings={settings} setSettings={setSettings} />
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onReset} data-testid="button-reset-settings">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={onSave} data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </>
  );
}

function SettingsContent({ settings, setSettings }: any) {
  return (
    <>
      {/* Default Style Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Default Style Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-tone">Default Tone</Label>
              <Select
                value={settings.defaultTone}
                onValueChange={(value) => setSettings({...settings, defaultTone: value})}
              >
                <SelectTrigger id="default-tone" data-testid="select-default-tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-length">Default Length</Label>
              <Select
                value={settings.defaultLength}
                onValueChange={(value) => setSettings({...settings, defaultLength: value})}
              >
                <SelectTrigger id="default-length" data-testid="select-default-length">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="default-emojis">Include Emojis by Default</Label>
              <div className="text-sm text-muted-foreground">
                Automatically include emojis in generated tweets
              </div>
            </div>
            <Switch
              id="default-emojis"
              checked={settings.defaultEmojis}
              onCheckedChange={(checked) => setSettings({...settings, defaultEmojis: checked})}
              data-testid="switch-default-emojis"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-tweets">Number of Tweet Variations</Label>
            <Select
              value={settings.maxTweets.toString()}
              onValueChange={(value) => setSettings({...settings, maxTweets: parseInt(value)})}
            >
              <SelectTrigger id="max-tweets" data-testid="select-max-tweets">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Tweet</SelectItem>
                <SelectItem value="2">2 Tweets</SelectItem>
                <SelectItem value="3">3 Tweets</SelectItem>
                <SelectItem value="5">5 Tweets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-save Generated Tweets</Label>
              <div className="text-sm text-muted-foreground">
                Automatically save tweets to history
              </div>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
              data-testid="switch-auto-save"
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Prompt Template */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Prompt Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Custom System Prompt (Optional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Add additional instructions for the AI..."
              value={settings.customPrompt}
              onChange={(e) => setSettings({...settings, customPrompt: e.target.value})}
              className="min-h-24"
              data-testid="textarea-custom-prompt"
            />
            <div className="text-sm text-muted-foreground">
              This will be added to the AI's instructions when generating tweets
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}