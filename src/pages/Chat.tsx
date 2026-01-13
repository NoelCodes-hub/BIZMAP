import SmartFeaturesHub from '@/components/smart/SmartFeaturesHub';
import BusinessStories from '@/components/smart/BusinessStories';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const Chat = () => {
  const [showStories, setShowStories] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Smart Features
            </h1>
            <p className="text-sm text-muted-foreground">AI-powered intelligence & gamification</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStories(true)}
            className="cosmic-gradient text-white border-0"
          >
            View Stories
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <SmartFeaturesHub />
      </div>

      {/* Stories modal */}
      {showStories && <BusinessStories onClose={() => setShowStories(false)} />}
    </div>
  );
};

export default Chat;
