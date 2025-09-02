import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
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
}

const BusinessPanel = ({
  isOpen,
  onClose,
  businesses,
  currentCity,
  businessType,
  onBusinessTypeChange,
  onBusinessSelect,
  selectedBusiness
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
    <div className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-lg transform transition-transform z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-card-foreground">Businesses</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{currentCity}</p>
          
          {/* Business Type Filter */}
          <Select value={businessType || "all"} onValueChange={(value) => onBusinessTypeChange(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All business types" />
            </SelectTrigger>
            <SelectContent>
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
            {businesses.map((business) => (
              <Card 
                key={business.id} 
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedBusiness?.id === business.id ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => onBusinessSelect(business)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: getMarkerColor(business.type) }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-card-foreground truncate">{business.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize mb-1">
                        {formatBusinessType(business.type)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{business.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {businesses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No businesses found</p>
                <p className="text-xs mt-1">Try changing the filter or city</p>
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