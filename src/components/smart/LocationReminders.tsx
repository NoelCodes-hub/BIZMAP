import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  businessName: string;
  reminderText: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  triggerRadius: number;
}

const LocationReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      businessName: 'Hardware Store',
      reminderText: "Don't forget shelf brackets on your wishlist!",
      latitude: -20.1500,
      longitude: 28.5833,
      isActive: true,
      triggerRadius: 500,
    },
    {
      id: '2',
      businessName: 'Grocery Mart',
      reminderText: 'Weekly shopping - check the produce sale',
      latitude: -20.1480,
      longitude: 28.5810,
      isActive: true,
      triggerRadius: 300,
    },
    {
      id: '3',
      businessName: 'Pharmacy',
      reminderText: 'Prescription refill due',
      latitude: -20.1520,
      longitude: 28.5850,
      isActive: false,
      triggerRadius: 200,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ businessName: '', reminderText: '' });
  const { toast } = useToast();

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
    toast({
      title: "Reminder updated",
      description: "Your location reminder has been updated",
    });
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Reminder deleted",
      description: "Location reminder has been removed",
    });
  };

  const addReminder = () => {
    if (!newReminder.businessName.trim() || !newReminder.reminderText.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      businessName: newReminder.businessName,
      reminderText: newReminder.reminderText,
      latitude: -20.15 + Math.random() * 0.01,
      longitude: 28.58 + Math.random() * 0.01,
      isActive: true,
      triggerRadius: 500,
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({ businessName: '', reminderText: '' });
    setShowAddForm(false);
    
    toast({
      title: "Reminder created",
      description: `You'll be notified when near ${reminder.businessName}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Location Reminders</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <Input
            placeholder="Business or location name"
            value={newReminder.businessName}
            onChange={(e) => setNewReminder(prev => ({ ...prev, businessName: e.target.value }))}
          />
          <Input
            placeholder="What to remember..."
            value={newReminder.reminderText}
            onChange={(e) => setNewReminder(prev => ({ ...prev, reminderText: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addReminder} className="cosmic-gradient text-white">
              Save Reminder
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reminders list */}
      <div className="space-y-2">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No location reminders yet</p>
            <p className="text-sm">Add reminders to get notified when near specific places</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={cn(
                "bg-card border rounded-lg p-4 transition-all duration-200",
                reminder.isActive ? "border-primary/30" : "border-border opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  reminder.isActive ? "cosmic-gradient" : "bg-muted"
                )}>
                  <MapPin className={cn(
                    "h-5 w-5",
                    reminder.isActive ? "text-white" : "text-muted-foreground"
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground truncate">
                      {reminder.businessName}
                    </span>
                    <Switch
                      checked={reminder.isActive}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {reminder.reminderText}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      {reminder.triggerRadius}m radius
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-destructive hover:text-destructive h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationReminders;
