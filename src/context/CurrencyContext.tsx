"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  GHS: { code: "GHS", symbol: "GH₵", label: "GHS (GH₵)", flag: "🇬🇭" },
  USD: { code: "USD", symbol: "$", label: "USD ($)", flag: "🇺🇸" },
  GBP: { code: "GBP", symbol: "£", label: "GBP (£)", flag: "🇬🇧" },
  EUR: { code: "EUR", symbol: "€", label: "EUR (€)", flag: "🇪🇺" },
  CAD: { code: "CAD", symbol: "CA$", label: "CAD (CA$)", flag: "🇨🇦" },
  
  // African Currencies
  NGN: { code: "NGN", symbol: "₦", label: "NGN (₦)", flag: "🇳🇬" },
  KES: { code: "KES", symbol: "KSh", label: "KES (KSh)", flag: "🇰🇪" },
  ZAR: { code: "ZAR", symbol: "R", label: "ZAR (R)", flag: "🇿🇦" },
  EGP: { code: "EGP", symbol: "E£", label: "EGP (E£)", flag: "🇪🇬" },
  MAD: { code: "MAD", symbol: "DH", label: "MAD (DH)", flag: "🇲🇦" },
  DZD: { code: "DZD", symbol: "DA", label: "DZD (DA)", flag: "🇩🇿" },
  TND: { code: "TND", symbol: "DT", label: "TND (DT)", flag: "🇹🇳" },
  BWP: { code: "BWP", symbol: "P", label: "BWP (P)", flag: "🇧🇼" },
  RWF: { code: "RWF", symbol: "FRw", label: "RWF (FRw)", flag: "🇷🇼" },
  UGX: { code: "UGX", symbol: "USh", label: "UGX (USh)", flag: "🇺🇬" },
  ZMW: { code: "ZMW", symbol: "ZK", label: "ZMW (ZK)", flag: "🇿🇲" },
  MZN: { code: "MZN", symbol: "MT", label: "MZN (MT)", flag: "🇲🇿" },
  ETB: { code: "ETB", symbol: "Br", label: "ETB (Br)", flag: "🇪🇹" },
  MUR: { code: "MUR", symbol: "₨", label: "MUR (₨)", flag: "🇲🇺" },
  TZS: { code: "TZS", symbol: "TSh", label: "TZS (TSh)", flag: "🇹🇿" },
  XOF: { code: "XOF", symbol: "CFA", label: "XOF (CFA)", flag: "🇨🇮" },
  XAF: { code: "XAF", symbol: "FCFA", label: "XAF (FCFA)", flag: "🇨🇲" },
  ZWG: { code: "ZWG", symbol: "ZiG", label: "ZWG (ZiG)", flag: "🇿🇼" },
};

export const isAfricanCurrency = (currencyCode: string): boolean => {
  const international = ["USD", "GBP", "EUR", "CAD"];
  return !international.includes(currencyCode.toUpperCase());
};

// Fallback rates if API fails (1 GHS to X)
const FALLBACK_RATES: Record<string, number> = {
  GHS: 1.0,
  USD: 0.085,
  GBP: 0.063,
  EUR: 0.073,
  CAD: 0.118,
  
  // African Currencies
  NGN: 116.0,
  KES: 11.0,
  ZAR: 1.37,
  EGP: 4.23,
  MAD: 0.79,
  DZD: 11.3,
  TND: 0.25,
  BWP: 1.15,
  RWF: 125.0,
  UGX: 318.0,
  ZMW: 1.60,
  MZN: 5.41,
  ETB: 13.6,
  MUR: 4.00,
  TZS: 225.0,
  XOF: 48.2,
  XAF: 48.2,
  ZWG: 2.26,
};

interface CurrencyContextType {
  currency: CurrencyConfig;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
  convertPrice: (amountInGhs: number) => number;
  formatPrice: (amountInGhs: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected_currency");
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        return saved;
      }
    }
    return "GHS";
  });
  const [rates, setRates] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const cachedRates = localStorage.getItem("currency_rates");
      const cachedTime = localStorage.getItem("currency_rates_timestamp");
      const cacheDuration = 12 * 60 * 60 * 1000; // 12 hours

      if (cachedRates && cachedTime && Date.now() - Number(cachedTime) < cacheDuration) {
        try {
          return JSON.parse(cachedRates);
        } catch {
          return FALLBACK_RATES;
        }
      }
    }
    return FALLBACK_RATES;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected_currency");
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        return false;
      }
    }
    return true;
  });
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    // 2. Geo-detect currency with a timeout fallback
    const detectGeo = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      try {
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code; // e.g. "NG", "US", "GH"
          const countryCurrency = data.currency; // e.g. "NGN", "USD", "GHS"
          if (countryCurrency && SUPPORTED_CURRENCIES[countryCurrency]) {
            setCurrencyCode(countryCurrency);
            localStorage.setItem("selected_currency", countryCurrency);
          } else if (countryCode) {
            // Map European Union countries to EUR
            const euCountryCodes = ["AT","BE","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"];
            if (euCountryCodes.includes(countryCode)) {
              setCurrencyCode("EUR");
              localStorage.setItem("selected_currency", "EUR");
            }
          }
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.log("Geo-detection timed out or failed. Falling back to timezone detection.", e);
        // Try timezone heuristic
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz.includes("Accra")) {
            setCurrencyCode("GHS");
          } else if (tz.includes("Lagos")) {
            setCurrencyCode("NGN");
          } else if (tz.includes("London")) {
            setCurrencyCode("GBP");
          } else if (tz.includes("Nairobi")) {
            setCurrencyCode("KES");
          } else if (tz.includes("Europe")) {
            setCurrencyCode("EUR");
          } else {
            setCurrencyCode("USD"); // international default
          }
        } catch {
          // Check fallback timezone
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    detectGeo();
  }, [isLoading]);

  // 3. Fetch live rates against GHS
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cachedRates = localStorage.getItem("currency_rates");
        const cachedTime = localStorage.getItem("currency_rates_timestamp");
        const cacheDuration = 12 * 60 * 60 * 1000; // 12 hours

        if (cachedRates && cachedTime && Date.now() - Number(cachedTime) < cacheDuration) {
          return; // already loaded in initializer
        }

        const res = await fetch("https://open.er-api.com/v6/latest/GHS");
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            // Merge with FALLBACK_RATES to make sure all supported currencies exist
            const newRates = { ...FALLBACK_RATES };
            Object.keys(SUPPORTED_CURRENCIES).forEach((code) => {
              if (data.rates[code] !== undefined) {
                newRates[code] = data.rates[code];
              }
            });
            setRates(newRates);
            localStorage.setItem("currency_rates", JSON.stringify(newRates));
            localStorage.setItem("currency_rates_timestamp", String(Date.now()));
          }
        }
      } catch (e) {
        console.error("Failed to fetch exchange rates, using fallbacks:", e);
      }
    };

    fetchRates();
  }, []);

  const setCurrency = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyCode(code);
      localStorage.setItem("selected_currency", code);
    }
  };

  const convertPrice = (amountInGhs: number): number => {
    const code = mounted ? currencyCode : "GHS";
    const rate = rates[code] || FALLBACK_RATES[code] || 1;
    return amountInGhs * rate;
  };

  const formatPrice = (amountInGhs: number): string => {
    const code = mounted ? currencyCode : "GHS";
    const targetConfig = SUPPORTED_CURRENCIES[code];
    const converted = convertPrice(amountInGhs);
    
    // Round to whole numbers for African currencies or standard decimals for USD/GBP/EUR/CAD
    const hasDecimals = ["USD", "GBP", "EUR", "CAD"].includes(code);
    const formattedVal = converted.toLocaleString("en-US", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    });
    
    return `${targetConfig.symbol} ${formattedVal}`;
  };

  // Avoid hydration mismatch by waiting until mounted to return user-customized state.
  // GHS is returned as the baseline/default on SSR.
  const activeCurrency = mounted ? SUPPORTED_CURRENCIES[currencyCode] : SUPPORTED_CURRENCIES.GHS;

  return (
    <CurrencyContext.Provider
      value={{
        currency: activeCurrency,
        setCurrency,
        rates,
        convertPrice,
        formatPrice,
        isLoading: !mounted || isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
