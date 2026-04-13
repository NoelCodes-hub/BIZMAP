import SmartFeaturesHub from '@/components/smart/SmartFeaturesHub';
import BusinessStories from '@/components/smart/BusinessStories';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const Chat = () => {
  const [showStories, setShowStories] = useState(false);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1531746790095-e6d591840e15?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/92 backdrop-blur-sm" />
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/60 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-lg cosmic-gradient">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              Smart Features
            </h1>
            <p className="text-sm text-muted-foreground">AI-powered intelligence & gamification</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStories(true)}
            className="cosmic-gradient text-primary-foreground border-0"
          >
            View Stories
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden z-10">
        <SmartFeaturesHub />
      </div>

      {/* Stories modal */}
      {showStories && <BusinessStories onClose={() => setShowStories(false)} />}
    </div>
  );
};

export default Chat;
