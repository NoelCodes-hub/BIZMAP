import { useState } from 'react';
import { Sparkles, Award, Bell, BarChart3, Navigation, Radio, ListMusic } from 'lucide-react';
import SmartAIChat from './SmartAIChat';
import BadgesPanel from './BadgesPanel';
import LocationReminders from './LocationReminders';
import PersonalInsights from './PersonalInsights';
import MultiModalTransport from './MultiModalTransport';
import LiveMetricsOverlay from './LiveMetricsOverlay';
import PlacePlaylistPanel from './PlacePlaylistPanel';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type TabType = 'ai' | 'badges' | 'reminders' | 'insights' | 'transport' | 'live' | 'playlists';

const tabs = [
  { id: 'ai' as const, label: 'AI Chat', icon: Sparkles },
  { id: 'playlists' as const, label: 'Playlists', icon: ListMusic },
  { id: 'live' as const, label: 'Live Data', icon: Radio },
  { id: 'badges' as const, label: 'Badges', icon: Award },
  { id: 'reminders' as const, label: 'Reminders', icon: Bell },
  { id: 'insights' as const, label: 'Insights', icon: BarChart3 },
  { id: 'transport' as const, label: 'Routes', icon: Navigation },
];

const SmartFeaturesHub = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ai');

  return (
    <div className="h-full flex flex-col">
      {/* Tab navigation */}
      <div className="flex gap-1 p-2 bg-muted/30 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "cosmic-gradient text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'ai' && <SmartAIChat />}
        {activeTab === 'playlists' && <PlacePlaylistPanel />}
        {activeTab !== 'ai' && activeTab !== 'playlists' && (
          <ScrollArea className="h-full p-4">
            {activeTab === 'live' && <LiveMetricsOverlay />}
            {activeTab === 'badges' && <BadgesPanel />}
            {activeTab === 'reminders' && <LocationReminders />}
            {activeTab === 'insights' && <PersonalInsights />}
            {activeTab === 'transport' && <MultiModalTransport />}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default SmartFeaturesHub;
