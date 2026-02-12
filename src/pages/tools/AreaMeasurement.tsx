import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Ruler, RotateCcw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Vertex {
  id: string;
  lat: string;
  lng: string;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const sphericalArea = (vertices: { lat: number; lng: number }[]) => {
  const R = 6371000;
  const n = vertices.length;
  if (n < 3) return 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    total += toRad(vertices[j].lng - vertices[i].lng) * (2 + Math.sin(toRad(vertices[i].lat)) + Math.sin(toRad(vertices[j].lat)));
  }
  return Math.abs((total * R * R) / 2);
};

const AreaMeasurement = () => {
  const location = useLocation();
  const mapCoords = location.state as { lat?: number; lng?: number } | null;
  
  const [vertices, setVertices] = useState<Vertex[]>([
    { id: '1', lat: mapCoords?.lat?.toString() ?? '', lng: mapCoords?.lng?.toString() ?? '' },
    { id: '2', lat: '', lng: '' },
    { id: '3', lat: '', lng: '' },
  ]);
  const [result, setResult] = useState<{ area: number; perimeter: number } | null>(null);

  const addVertex = () => setVertices([...vertices, { id: Date.now().toString(), lat: '', lng: '' }]);
  const removeVertex = (id: string) => { if (vertices.length > 3) setVertices(vertices.filter(v => v.id !== id)); };
  const update = (id: string, field: 'lat' | 'lng', val: string) => setVertices(vertices.map(v => v.id === id ? { ...v, [field]: val } : v));

  const calculate = () => {
    const valid = vertices.filter(v => v.lat && v.lng).map(v => ({ lat: +v.lat, lng: +v.lng }));
    if (valid.length < 3) return;
    let perimeter = 0;
    for (let i = 0; i < valid.length; i++) {
      const j = (i + 1) % valid.length;
      perimeter += haversine(valid[i].lat, valid[i].lng, valid[j].lat, valid[j].lng);
    }
    setResult({ area: sphericalArea(valid), perimeter });
  };

  const reset = () => {
    setVertices([{ id: '1', lat: '', lng: '' }, { id: '2', lat: '', lng: '' }, { id: '3', lat: '', lng: '' }]);
    setResult(null);
  };

  const formatArea = (m2: number) => m2 > 1e6 ? `${(m2 / 1e6).toFixed(4)} km²` : `${m2.toFixed(2)} m²`;
  const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(3)} km` : `${m.toFixed(2)} m`;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Area Measurement</h1>
          <p className="text-muted-foreground text-lg">Measure areas and perimeters of custom polygon regions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Polygon Vertices</span>
                <Button size="sm" variant="outline" onClick={addVertex}><Plus className="h-4 w-4 mr-1" /> Add Vertex</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vertices.map((v, i) => (
                <div key={v.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Vertex {i + 1}</label>
                    <div className="flex gap-2">
                      <Input placeholder="Latitude" value={v.lat} onChange={e => update(v.id, 'lat', e.target.value)} type="number" step="any" />
                      <Input placeholder="Longitude" value={v.lng} onChange={e => update(v.id, 'lng', e.target.value)} type="number" step="any" />
                    </div>
                  </div>
                  {vertices.length > 3 && (
                    <Button size="icon" variant="ghost" onClick={() => removeVertex(v.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 cosmic-gradient text-primary-foreground" onClick={calculate}><Ruler className="h-4 w-4 mr-2" /> Measure</Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader><CardTitle>Results</CardTitle></CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Area</p>
                    <Badge className="cosmic-gradient text-primary-foreground text-lg px-4 py-2">{formatArea(result.area)}</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Perimeter</p>
                    <Badge variant="secondary" className="text-lg px-4 py-2">{formatDist(result.perimeter)}</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Vertices</p>
                    <span className="text-2xl font-bold text-foreground">{vertices.filter(v => v.lat && v.lng).length}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">Enter at least 3 vertices and click Measure</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AreaMeasurement;
