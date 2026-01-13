import { useState } from 'react';
import { Bus, Bike, Car, Footprints, Clock, DollarSign, Leaf, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TransportOption {
  id: string;
  type: 'walk' | 'bus' | 'bike' | 'rideshare';
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  duration: string;
  cost: string;
  co2: string;
  details: string[];
  color: string;
}

interface MultiModalTransportProps {
  from?: string;
  to?: string;
}

const transportOptions: TransportOption[] = [
  {
    id: 'walk-bus',
    type: 'bus',
    icon: Bus,
    name: 'Bus + Walk',
    duration: '25 min',
    cost: '$1.50',
    co2: '0.3 kg',
    details: [
      '5 min walk to Main St stop',
      'Bus 42 arrives in 3 min',
      '15 min ride to Central',
      '5 min walk to destination',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'rideshare',
    type: 'rideshare',
    icon: Car,
    name: 'Rideshare',
    duration: '12 min',
    cost: '$8-12',
    co2: '1.2 kg',
    details: [
      'Driver arrives in 4 min',
      'Direct route via Main Ave',
      'Drop-off at entrance',
    ],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'bike',
    type: 'bike',
    icon: Bike,
    name: 'Bike Share',
    duration: '18 min',
    cost: '$2.00',
    co2: '0 kg',
    details: [
      '2 bikes available nearby',
      'Flat route, bike-friendly',
      'Dock available at destination',
    ],
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'walk',
    type: 'walk',
    icon: Footprints,
    name: 'Walk',
    duration: '35 min',
    cost: 'Free',
    co2: '0 kg',
    details: [
      '2.4 km scenic route',
      'Via riverside path',
      'Mostly flat terrain',
    ],
    color: 'from-purple-500 to-pink-500',
  },
];

const MultiModalTransport = ({ from = 'Your Location', to = 'City Center' }: MultiModalTransportProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const selected = transportOptions.find(o => o.id === selectedOption);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Route options</div>
        <div className="flex items-center gap-2 text-foreground">
          <span className="font-medium truncate">{from}</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium truncate">{to}</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {transportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setSelectedOption(option.id);
              setShowDetails(true);
            }}
            className={cn(
              "w-full bg-card border rounded-xl p-4 transition-all duration-200 text-left",
              selectedOption === option.id 
                ? "border-primary shadow-lg shadow-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                option.color
              )}>
                <option.icon className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{option.name}</span>
                  <span className="text-lg font-bold text-foreground">{option.duration}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {option.cost}
                  </span>
                  <span className="flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    {option.co2} CO₂
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {selectedOption === option.id && showDetails && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  {option.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gradient-to-br",
                        option.color
                      )}>
                        <span className="text-white">{i + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 cosmic-gradient text-white">
                  Start Navigation
                </Button>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Eco tip */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2">
        <Leaf className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-medium text-green-600">Eco Tip:</span>
          <span className="text-green-600/80"> Taking the bus saves 0.9 kg CO₂ compared to rideshare!</span>
        </div>
      </div>
    </div>
  );
};

export default MultiModalTransport;
