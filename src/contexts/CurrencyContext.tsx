import { createContext, useContext, useState, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'ZAR' | 'ZIG';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  symbol: string;
  format: (usdAmount: number) => string;
}

// Approximate exchange rates from USD
const rates: Record<CurrencyCode, number> = {
  USD: 1,
  ZAR: 18.5,
  ZIG: 13.5,
};

const symbols: Record<CurrencyCode, string> = {
  USD: '$',
  ZAR: 'R',
  ZIG: 'ZiG',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const convert = (usdAmount: number) => usdAmount * rates[currency];
  const symbol = symbols[currency];
  const format = (usdAmount: number) => {
    const converted = convert(usdAmount);
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
