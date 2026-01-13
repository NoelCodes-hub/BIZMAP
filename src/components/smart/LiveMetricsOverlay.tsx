import { useEffect, useState } from 'react';
import { Users, Clock, Car, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface LiveMetric {
  id: string;
  business_id: string;
  business_name: string;
  current_capacity: number | null;
  max_capacity: number | null;
  wait_time_minutes: number | null;
  parking_spots_available: number | null;
  is_open: boolean;
  last_updated: string;
}

interface LiveMetricsOverlayProps {
  businessId?: string;
  compact?: boolean;
}

const LiveMetricsOverlay = ({ businessId, compact = false }: LiveMetricsOverlayProps) => {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      let query = supabase
        .from('live_business_metrics')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query.limit(10);
      
      if (!error && data) {
        setMetrics(data);
      }
      setLoading(false);
    };

    fetchMetrics();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        current_capacity: m.max_capacity 
          ? Math.min(m.max_capacity, Math.max(0, (m.current_capacity || 0) + Math.floor(Math.random() * 5) - 2))
          : m.current_capacity,
        wait_time_minutes: m.wait_time_minutes 
          ? Math.max(0, m.wait_time_minutes + Math.floor(Math.random() * 3) - 1)
          : m.wait_time_minutes,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [businessId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (metrics.length === 0) {
    return null;
  }

  const getCapacityColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio < 0.5) return 'text-green-500';
    if (ratio < 0.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWaitColor = (minutes: number) => {
    if (minutes < 10) return 'text-green-500';
    if (minutes < 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (compact) {
    const metric = metrics[0];
    return (
      <div className="flex items-center gap-3 text-xs">
        {metric.current_capacity !== null && metric.max_capacity !== null && (
          <div className="flex items-center gap-1">
            <Users className={cn("h-3 w-3", getCapacityColor(metric.current_capacity, metric.max_capacity))} />
            <span>{metric.current_capacity}/{metric.max_capacity}</span>
          </div>
        )}
        {metric.wait_time_minutes !== null && (
          <div className="flex items-center gap-1">
            <Clock className={cn("h-3 w-3", getWaitColor(metric.wait_time_minutes))} />
            <span>{metric.wait_time_minutes}m</span>
          </div>
        )}
        {metric.parking_spots_available !== null && (
          <div className="flex items-center gap-1">
            <Car className="h-3 w-3 text-primary" />
            <span>{metric.parking_spots_available}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Activity className="h-4 w-4 text-primary animate-pulse" />
        <span>Live Business Metrics</span>
      </div>
      
      <div className="grid gap-2">
        {metrics.map((metric) => (
          <div 
            key={metric.id}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-foreground">{metric.business_name}</span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                metric.is_open ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
              )}>
                {metric.is_open ? 'Open' : 'Closed'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              {metric.current_capacity !== null && metric.max_capacity !== null && (
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded">
                  <Users className={cn("h-4 w-4 mb-1", getCapacityColor(metric.current_capacity, metric.max_capacity))} />
                  <span className="font-semibold">{metric.current_capacity}/{metric.max_capacity}</span>
                  <span className="text-muted-foreground">Capacity</span>
                </div>
              )}
              
              {metric.wait_time_minutes !== null && (
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded">
                  <Clock className={cn("h-4 w-4 mb-1", getWaitColor(metric.wait_time_minutes))} />
                  <span className="font-semibold">{metric.wait_time_minutes} min</span>
                  <span className="text-muted-foreground">Wait Time</span>
                </div>
              )}
              
              {metric.parking_spots_available !== null && (
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded">
                  <Car className="h-4 w-4 mb-1 text-primary" />
                  <span className="font-semibold">{metric.parking_spots_available}</span>
                  <span className="text-muted-foreground">Parking</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMetricsOverlay;
