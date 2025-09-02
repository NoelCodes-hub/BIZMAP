import { useState } from 'react';
import { X, MapPin, Search, Star, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Business } from '@/types/business';

interface BusinessPanelProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  currentCity: string;
  businessType: string;
  onBusinessTypeChange: (type: string) => void;
  onBusinessSelect: (business: Business) => void;
  selectedBusiness: Business | null;
  isLoading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BusinessPanel = ({
  isOpen,
  onClose,
  businesses,
  currentCity,
  businessType,
  onBusinessTypeChange,
  onBusinessSelect,
  selectedBusiness,
  isLoading = false,
  searchQuery,
  onSearchChange
}: BusinessPanelProps) => {
  const getBusinessCount = () => {
    const count = businesses.length;
    let message = `${count} business${count !== 1 ? 'es' : ''} found`;
    
    if (businessType) {
      message += ` in ${businessType.replace('_', ' ')}`;
    }
    
    return message;
  };

  const formatBusinessType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-gradient-card border-l border-border shadow-elegant transform transition-all duration-300 z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full backdrop-blur-sm">
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Businesses</h2>
              <p className="text-sm text-muted-foreground">{currentCity}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-accent">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
            />
          </div>
          
          {/* Business Type Filter */}
          <Select value={businessType || "all"} onValueChange={(value) => onBusinessTypeChange(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full bg-background/50 border-border/50 focus:bg-background transition-colors">
              <SelectValue placeholder="All business types" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">All business types</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="fast_food">Fast Food</SelectItem>
              <SelectItem value="tourism">Tourism</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Business Count */}
          <p className="text-xs text-muted-foreground mt-2">{getBusinessCount()}</p>
        </div>

        {/* Business List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-fade-in">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-3 h-3 rounded-full mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : businesses.length > 0 ? (
              businesses.map((business, index) => (
                <Card 
                  key={business.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-card hover:scale-[1.02] animate-fade-in ${
                    selectedBusiness?.id === business.id 
                      ? 'bg-accent border-primary shadow-glow' 
                      : 'hover:bg-accent/50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => onBusinessSelect(business)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0 animate-pulse-glow"
                        style={{ backgroundColor: getMarkerColor(business.type) }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-card-foreground truncate pr-2">{business.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {formatBusinessType(business.type)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{business.address}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span>4.5</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Open</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground animate-fade-in">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No businesses found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const getMarkerColor = (type: string): string => {
  const colors = {
    'restaurant': '#28a745',
    'fast_food': '#ffc107',
    'tourism': '#dc3545'
  };
  return colors[type as keyof typeof colors] || '#007bff';
};

export default BusinessPanel;