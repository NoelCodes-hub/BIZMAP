import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Route, RotateCcw, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Stop {
  id: string;
  name: string;
  lat: string;
  lng: string;
}

const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Nearest-neighbor heuristic
const optimizeRoute = (stops: { name: string; lat: number; lng: number }[]) => {
  if (stops.length <= 2) return { order: stops, totalDistance: stops.length === 2 ? haversine(stops[0].lat, stops[0].lng, stops[1].lat, stops[1].lng) : 0 };
  const remaining = [...stops];
  const ordered = [remaining.shift()!];
  let total = 0;
  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((s, i) => {
      const d = haversine(last.lat, last.lng, s.lat, s.lng);
      if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
    });
    total += nearestDist;
    ordered.push(remaining.splice(nearestIdx, 1)[0]);
  }
  return { order: ordered, totalDistance: total };
};

const RouteOptimizer = () => {
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', name: 'Start', lat: '', lng: '' },
    { id: '2', name: 'Stop 1', lat: '', lng: '' },
    { id: '3', name: 'Stop 2', lat: '', lng: '' },
  ]);
  const [result, setResult] = useState<{ order: { name: string; lat: number; lng: number }[]; totalDistance: number } | null>(null);

  const addStop = () => setStops([...stops, { id: Date.now().toString(), name: `Stop ${stops.length}`, lat: '', lng: '' }]);
  const removeStop = (id: string) => { if (stops.length > 2) setStops(stops.filter(s => s.id !== id)); };
  const update = (id: string, field: keyof Stop, val: string) => setStops(stops.map(s => s.id === id ? { ...s, [field]: val } : s));

  const optimize = () => {
    const valid = stops.filter(s => s.lat && s.lng).map(s => ({ name: s.name, lat: +s.lat, lng: +s.lng }));
    if (valid.length < 2) return;
    setResult(optimizeRoute(valid));
  };

  const reset = () => {
    setStops([
      { id: '1', name: 'Start', lat: '', lng: '' },
      { id: '2', name: 'Stop 1', lat: '', lng: '' },
      { id: '3', name: 'Stop 2', lat: '', lng: '' },
    ]);
    setResult(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Route Optimizer</h1>
          <p className="text-muted-foreground text-lg">Find the optimal order to visit multiple destinations (nearest-neighbor)</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Destinations</span>
                <Button size="sm" variant="outline" onClick={addStop}><Plus className="h-4 w-4 mr-1" /> Add Stop</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stops.map((s) => (
                <div key={s.id} className="flex items-end gap-2">
                  <div className="w-24">
                    <label className="text-xs text-muted-foreground">Name</label>
                    <Input value={s.name} onChange={e => update(s.id, 'name', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Coordinates</label>
                    <div className="flex gap-2">
                      <Input placeholder="Lat" value={s.lat} onChange={e => update(s.id, 'lat', e.target.value)} type="number" step="any" />
                      <Input placeholder="Lng" value={s.lng} onChange={e => update(s.id, 'lng', e.target.value)} type="number" step="any" />
                    </div>
                  </div>
                  {stops.length > 2 && (
                    <Button size="icon" variant="ghost" onClick={() => removeStop(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 cosmic-gradient text-primary-foreground" onClick={optimize}><Route className="h-4 w-4 mr-2" /> Optimize</Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader><CardTitle>Optimized Route</CardTitle></CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {result.order.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">{i + 1}</div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{s.lat.toFixed(4)}, {s.lng.toFixed(4)}</p>
                        </div>
                      </div>
                      {i < result.order.length - 1 && (
                        <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="font-semibold">Total Distance</span>
                    <Badge className="cosmic-gradient text-primary-foreground text-base px-4 py-1">{result.totalDistance.toFixed(2)} km</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">Enter destinations and click Optimize</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
