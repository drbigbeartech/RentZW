import { Currency, ExchangeRate } from "@/types";

// Default exchange rate (1 USD = 320 ZWL as of recent rates)
const DEFAULT_EXCHANGE_RATE = 320;

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    return new Intl.NumberFormat("en-ZW", {
      style: "currency",
      currency: "ZWL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
};

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE,
): number => {
  if (fromCurrency === toCurrency) return amount;

  if (fromCurrency === "USD" && toCurrency === "ZWL") {
    return amount * exchangeRate;
  } else if (fromCurrency === "ZWL" && toCurrency === "USD") {
    return amount / exchangeRate;
  }

  return amount;
};

export const formatPrice = (
  priceUSD: number,
  currency: Currency,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE,
): string => {
  if (currency === "USD") {
    return formatCurrency(priceUSD, "USD");
  } else {
    const priceZWL = convertCurrency(priceUSD, "USD", "ZWL", exchangeRate);
    return formatCurrency(priceZWL, "ZWL");
  }
};

export const parsePrice = (priceStr: string): number => {
  // Remove currency symbols and parse
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;
};

// Mock function to fetch exchange rates (in real app, this would call an API)
export const fetchExchangeRates = async (): Promise<ExchangeRate> => {
  try {
    // In a real application, you would call an external API like:
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    // const data = await response.json();
    // return { USD: 1, ZWL: data.rates.ZWL, lastUpdated: new Date().toISOString() };

    // For demo purposes, return mock data
    return {
      USD: 1,
      ZWL: DEFAULT_EXCHANGE_RATE,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return {
      USD: 1,
      ZWL: DEFAULT_EXCHANGE_RATE,
      lastUpdated: new Date().toISOString(),
    };
  }
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currency === "USD" ? "$" : "ZWL$";
};
