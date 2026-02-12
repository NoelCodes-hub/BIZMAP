import { useState } from 'react';
import { ArrowLeft, MapPin, Loader2, RotateCcw, Download, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface GeoResult {
  address: string;
  lat: number | null;
  lng: number | null;
  status: 'success' | 'error';
  display?: string;
}

const BatchGeocoding = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const geocode = async () => {
    const addresses = input.split('\n').map(a => a.trim()).filter(Boolean);
    if (!addresses.length) return;
    setLoading(true);
    setResults([]);

    const res: GeoResult[] = [];
    for (const address of addresses) {
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await resp.json();
        if (data.length > 0) {
          res.push({ address, lat: +data[0].lat, lng: +data[0].lon, status: 'success', display: data[0].display_name });
        } else {
          res.push({ address, lat: null, lng: null, status: 'error' });
        }
      } catch {
        res.push({ address, lat: null, lng: null, status: 'error' });
      }
      // Rate limit for Nominatim
      await new Promise(r => setTimeout(r, 1100));
    }
    setResults(res);
    setLoading(false);
  };

  const copyCSV = () => {
    const csv = ['Address,Latitude,Longitude,Status', ...results.map(r => `"${r.address}",${r.lat ?? ''},${r.lng ?? ''},${r.status}`)].join('\n');
    navigator.clipboard.writeText(csv);
    setCopied(true);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    const csv = ['Address,Latitude,Longitude,Status', ...results.map(r => `"${r.address}",${r.lat ?? ''},${r.lng ?? ''},${r.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'geocoded_results.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const successCount = results.filter(r => r.status === 'success').length;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Batch Geocoding</h1>
          <p className="text-muted-foreground text-lg">Convert multiple addresses to coordinates at once (one per line)</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader><CardTitle>Addresses</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={"123 Main Street, Harare\n45 Fife Street, Bulawayo\nMasvingo City Centre"}
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">{input.split('\n').filter(l => l.trim()).length} addresses entered</p>
              <div className="flex gap-2">
                <Button className="flex-1 cosmic-gradient text-primary-foreground" onClick={geocode} disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</> : <><MapPin className="h-4 w-4 mr-2" /> Geocode All</>}
                </Button>
                <Button variant="outline" onClick={() => { setInput(''); setResults([]); }}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Results {results.length > 0 && <Badge variant="secondary" className="ml-2">{successCount}/{results.length}</Badge>}</span>
                {results.length > 0 && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={copyCSV}>{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}</Button>
                    <Button size="sm" variant="outline" onClick={downloadCSV}><Download className="h-3 w-3" /></Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Geocoding addresses... This may take a moment.</p>
                </div>
              )}
              {!loading && results.length === 0 && (
                <p className="text-muted-foreground text-center py-10">Enter addresses and click Geocode All</p>
              )}
              {!loading && results.length > 0 && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {results.map((r, i) => (
                    <div key={i} className={`p-3 rounded-lg text-sm ${r.status === 'success' ? 'bg-muted/50' : 'bg-destructive/10'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-foreground">{r.address}</span>
                        <Badge variant={r.status === 'success' ? 'secondary' : 'destructive'} className="text-xs ml-2 shrink-0">{r.status}</Badge>
                      </div>
                      {r.lat !== null && (
                        <span className="text-xs text-muted-foreground font-mono">{r.lat.toFixed(6)}, {r.lng!.toFixed(6)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatchGeocoding;
