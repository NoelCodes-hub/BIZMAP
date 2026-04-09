import { useCurrency, CurrencyCode } from '@/contexts/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

const currencies: { code: CurrencyCode; label: string; flag: string }[] = [
  { code: 'USD', label: 'USD ($)', flag: '🇺🇸' },
  { code: 'ZAR', label: 'ZAR (R)', flag: '🇿🇦' },
  { code: 'ZIG', label: 'ZiG', flag: '🇿🇼' },
];

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger className="w-[120px] bg-background/50">
        <DollarSign className="h-4 w-4 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.flag} {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
