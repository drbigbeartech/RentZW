import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Currency, ExchangeRate } from "@/types";
import { fetchExchangeRates } from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  exchangeRate: ExchangeRate;
  setCurrency: (currency: Currency) => void;
  refreshRates: () => Promise<void>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

const CURRENCY_STORAGE_KEY = "selectedCurrency";

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return (stored as Currency) || "USD";
  });

  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    USD: 1,
    ZWL: 320,
    lastUpdated: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(false);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  };

  const refreshRates = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchExchangeRates();
      setExchangeRate(rates);
    } catch (error) {
      console.error("Failed to refresh exchange rates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial exchange rates
    refreshRates();

    // Set up interval to refresh rates every hour
    const interval = setInterval(refreshRates, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: CurrencyContextType = {
    currency,
    exchangeRate,
    setCurrency,
    refreshRates,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
