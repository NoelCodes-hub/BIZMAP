import { useState, useEffect } from 'react';
import { BarChart3, MapPin, TrendingUp, Calendar, Clock, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightData {
  totalVisits: number;
  topCategories: { name: string; count: number; percentage: number }[];
  topAreas: { name: string; visits: number }[];
  peakHours: { hour: string; visits: number }[];
  weeklyPattern: { day: string; visits: number }[];
}

const PersonalInsights = () => {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Simulate loading insights data
    const loadInsights = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setInsights({
        totalVisits: 47,
        topCategories: [
          { name: 'Restaurants', count: 18, percentage: 38 },
          { name: 'Retail', count: 12, percentage: 26 },
          { name: 'Banking', count: 8, percentage: 17 },
          { name: 'Healthcare', count: 5, percentage: 11 },
          { name: 'Other', count: 4, percentage: 8 },
        ],
        topAreas: [
          { name: 'City Center', visits: 23 },
          { name: 'North Suburb', visits: 12 },
          { name: 'Industrial Area', visits: 8 },
          { name: 'East District', visits: 4 },
        ],
        peakHours: [
          { hour: '9-11 AM', visits: 12 },
          { hour: '12-2 PM', visits: 18 },
          { hour: '3-5 PM', visits: 10 },
          { hour: '6-8 PM', visits: 7 },
        ],
        weeklyPattern: [
          { day: 'Mon', visits: 8 },
          { day: 'Tue', visits: 6 },
          { day: 'Wed', visits: 9 },
          { day: 'Thu', visits: 5 },
          { day: 'Fri', visits: 11 },
          { day: 'Sat', visits: 5 },
          { day: 'Sun', visits: 3 },
        ],
      });
      setLoading(false);
    };

    loadInsights();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!insights) return null;

  const maxWeeklyVisits = Math.max(...insights.weeklyPattern.map(d => d.visits));

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
        {(['week', 'month', 'year'] as const).map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              selectedPeriod === period 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Your Activity</span>
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        
        <div className="text-4xl font-bold text-foreground mb-1">
          {insights.totalVisits}
        </div>
        <div className="text-sm text-muted-foreground">
          places visited this {selectedPeriod}
        </div>
      </div>

      {/* Weekly pattern */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Weekly Pattern</span>
        </div>
        
        <div className="flex items-end justify-between gap-1 h-20">
          {insights.weeklyPattern.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full cosmic-gradient rounded-t transition-all duration-500"
                style={{ height: `${(day.visits / maxWeeklyVisits) * 100}%`, minHeight: '4px' }}
              />
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Top Categories</span>
        </div>
        
        <div className="space-y-3">
          {insights.topCategories.slice(0, 4).map((cat, i) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{cat.name}</span>
                <span className="text-muted-foreground">{cat.count} visits</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    i === 0 ? "bg-primary" : i === 1 ? "bg-secondary" : i === 2 ? "bg-accent" : "bg-muted-foreground"
                  )}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top areas */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Top Areas</span>
        </div>
        
        <div className="space-y-2">
          {insights.topAreas.map((area, i) => (
            <div key={area.name} className="flex items-center gap-3">
              <span className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                i === 0 ? "cosmic-gradient text-white" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-foreground">{area.name}</span>
              <span className="text-sm text-muted-foreground">{area.visits} visits</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak hours */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Peak Activity Hours</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {insights.peakHours.map((slot) => (
            <div key={slot.hour} className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-foreground">{slot.visits}</div>
              <div className="text-xs text-muted-foreground">{slot.hour}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInsights;
