import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Calculator, RotateCcw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Point {
  id: string;
  name: string;
  lat: string;
  lng: string;
}

const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const DistanceCalculator = () => {
  const location = useLocation();
  const mapCoords = location.state as { lat?: number; lng?: number } | null;
  
  const [points, setPoints] = useState<Point[]>([
    { id: '1', name: 'Point A', lat: mapCoords?.lat?.toString() ?? '', lng: mapCoords?.lng?.toString() ?? '' },
    { id: '2', name: 'Point B', lat: '', lng: '' },
  ]);
  const [results, setResults] = useState<{ from: string; to: string; distance: number }[] | null>(null);

  const addPoint = () => {
    const letter = String.fromCharCode(65 + points.length);
    setPoints([...points, { id: Date.now().toString(), name: `Point ${letter}`, lat: '', lng: '' }]);
  };

  const removePoint = (id: string) => {
    if (points.length <= 2) return;
    setPoints(points.filter((p) => p.id !== id));
  };

  const updatePoint = (id: string, field: keyof Point, value: string) => {
    setPoints(points.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const calculate = () => {
    const valid = points.filter((p) => p.lat && p.lng);
    if (valid.length < 2) return;
    const res: { from: string; to: string; distance: number }[] = [];
    for (let i = 0; i < valid.length - 1; i++) {
      res.push({
        from: valid[i].name,
        to: valid[i + 1].name,
        distance: haversineDistance(+valid[i].lat, +valid[i].lng, +valid[i + 1].lat, +valid[i + 1].lng),
      });
    }
    setResults(res);
  };

  const reset = () => {
    setPoints([
      { id: '1', name: 'Point A', lat: '', lng: '' },
      { id: '2', name: 'Point B', lat: '', lng: '' },
    ]);
    setResults(null);
  };

  const totalDistance = results?.reduce((s, r) => s + r.distance, 0) ?? 0;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Distance Calculator</h1>
          <p className="text-muted-foreground text-lg">Calculate distances between multiple points using the Haversine formula</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Coordinates</span>
                <Button size="sm" variant="outline" onClick={addPoint}><Plus className="h-4 w-4 mr-1" /> Add Point</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {points.map((p) => (
                <div key={p.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">{p.name}</label>
                    <div className="flex gap-2">
                      <Input placeholder="Latitude" value={p.lat} onChange={(e) => updatePoint(p.id, 'lat', e.target.value)} type="number" step="any" />
                      <Input placeholder="Longitude" value={p.lng} onChange={(e) => updatePoint(p.id, 'lng', e.target.value)} type="number" step="any" />
                    </div>
                  </div>
                  {points.length > 2 && (
                    <Button size="icon" variant="ghost" onClick={() => removePoint(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 cosmic-gradient text-primary-foreground" onClick={calculate}><Calculator className="h-4 w-4 mr-2" /> Calculate</Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader><CardTitle>Results</CardTitle></CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  {results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">{r.from} → {r.to}</span>
                      <Badge variant="secondary">{r.distance.toFixed(2)} km</Badge>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="font-semibold">Total Distance</span>
                    <Badge className="cosmic-gradient text-primary-foreground text-base px-4 py-1">{totalDistance.toFixed(2)} km</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">Enter coordinates and click Calculate to see results</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DistanceCalculator;
