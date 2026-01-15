import { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, Clock, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface BusinessMetrics {
  id: string;
  business_id: string;
  business_name: string;
  current_capacity: number | null;
  max_capacity: number | null;
  wait_time_minutes: number | null;
  is_open: boolean;
  last_updated: string;
}

interface VibeCheckProps {
  businessId?: string;
  businessName?: string;
  compact?: boolean;
}

const VibeCheck = ({ businessId, businessName, compact = false }: VibeCheckProps) => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!businessId && !businessName) {
        setLoading(false);
        return;
      }

      let query = supabase.from('live_business_metrics').select('*');
      
      if (businessId) {
        query = query.eq('business_id', businessId);
      } else if (businessName) {
        query = query.eq('business_name', businessName);
      }

      const { data } = await query.single();
      setMetrics(data);
      setLoading(false);
    };

    fetchMetrics();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('vibe-check')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_business_metrics',
          filter: businessId ? `business_id=eq.${businessId}` : undefined
        },
        (payload) => {
          if (payload.new) {
            setMetrics(payload.new as BusinessMetrics);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, businessName]);

  if (loading) {
    return compact ? null : <div className="h-8 bg-muted animate-pulse rounded" />;
  }

  if (!metrics) {
    // Simulated data for demo
    const simulatedCapacity = Math.floor(Math.random() * 80) + 20;
    const simulatedWait = Math.floor(Math.random() * 15);
    
    return (
      <div className={cn(
        "flex items-center gap-3",
        compact ? "text-xs" : "text-sm"
      )}>
        <VibeIndicator percentage={simulatedCapacity} compact={compact} />
        {!compact && simulatedWait > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>~{simulatedWait}min wait</span>
          </div>
        )}
      </div>
    );
  }

  const capacityPercentage = metrics.max_capacity && metrics.current_capacity
    ? Math.round((metrics.current_capacity / metrics.max_capacity) * 100)
    : 50;

  return (
    <div className={cn(
      "flex items-center gap-3",
      compact ? "text-xs" : "text-sm"
    )}>
      <VibeIndicator percentage={capacityPercentage} compact={compact} />
      {!compact && metrics.wait_time_minutes && metrics.wait_time_minutes > 0 && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>~{metrics.wait_time_minutes}min</span>
        </div>
      )}
      {!metrics.is_open && (
        <span className="text-destructive text-xs">Closed</span>
      )}
    </div>
  );
};

const VibeIndicator = ({ percentage, compact }: { percentage: number; compact: boolean }) => {
  const getVibeInfo = (pct: number) => {
    if (pct >= 80) return { label: 'Packed', icon: Flame, color: 'text-destructive', bg: 'bg-destructive' };
    if (pct >= 60) return { label: 'Busy', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500' };
    if (pct >= 40) return { label: 'Moderate', icon: Users, color: 'text-primary', bg: 'bg-primary' };
    return { label: 'Quiet', icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-500' };
  };

  const { label, icon: Icon, color, bg } = getVibeInfo(percentage);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", color)}>
        <Icon className="h-3 w-3" />
        <span className="font-medium">{percentage}%</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", bg)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={cn("flex items-center gap-1", color)}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
};

export default VibeCheck;
