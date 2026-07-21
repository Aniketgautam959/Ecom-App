"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiClient } from "@/lib/api-client";

export interface Currency {
  code: string;
  symbol: string;
}

export function formatPrice(amount: number, currency: Currency | null): string {
  if (!currency) return `₹ ${amount.toFixed(2)}`;
  return `${currency.symbol} ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CurrencyContext = createContext<Currency>({ code: "INR", symbol: "₹" });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>({ code: "INR", symbol: "₹" });

  useEffect(() => {
    apiClient.get("/settings/currency").then((res) => {
      const data = res.data.data ?? { code: "INR", symbol: "₹" };
      setCurrency(data);
    }).catch(() => {});
  }, []);

  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
