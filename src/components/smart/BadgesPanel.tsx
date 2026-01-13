import { useEffect, useState } from 'react';
import { Award, Lock, Compass, Utensils, ShoppingBag, MapPin, Navigation, Heart, Briefcase, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  requirement_category: string | null;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  'map-pin': MapPin,
  navigation: Navigation,
  heart: Heart,
  briefcase: Briefcase,
  camera: Camera,
};

const BadgesPanel = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (allBadges) {
        setBadges(allBadges);
      }

      // For demo, randomly mark some as earned
      const randomEarned = new Set(
        (allBadges || [])
          .filter(() => Math.random() > 0.6)
          .map(b => b.id)
      );
      setEarnedBadges(randomEarned);
      
      setLoading(false);
    };

    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const earnedCount = earnedBadges.size;
  const totalCount = badges.length;
  const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Your Achievements</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {earnedCount}/{totalCount} badges
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full cosmic-gradient transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => {
          const isEarned = earnedBadges.has(badge.id);
          const IconComponent = iconMap[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300",
                isEarned 
                  ? "bg-card border-primary/50 shadow-lg shadow-primary/10" 
                  : "bg-muted/30 border-border opacity-60"
              )}
            >
              {!isEarned && (
                <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                isEarned ? "cosmic-gradient" : "bg-muted"
              )}>
                <IconComponent className={cn(
                  "h-6 w-6",
                  isEarned ? "text-white" : "text-muted-foreground"
                )} />
              </div>

              <h4 className={cn(
                "font-semibold text-sm mb-1",
                isEarned ? "text-foreground" : "text-muted-foreground"
              )}>
                {badge.name}
              </h4>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {badge.description}
              </p>

              {isEarned && (
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesPanel;
