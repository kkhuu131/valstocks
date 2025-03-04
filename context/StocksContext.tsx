"use client"

// StocksContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStocks, fetchCurrentStocks, fetchStockBySymbol } from '../lib/supabaseQueries';
import { supabase } from '../lib/supabase';

export type StockData = {
    symbol: string;
    price: number;
    timestamp: Date;
  };

export type Stock = {
    symbol: string;
    price: number;
    locked: boolean;
    data?: StockData[] | null | undefined;
};

type StocksMap = Record<string, Stock>;
  
type StocksContextType = {
    stocks: StocksMap;
    loading: boolean;
    error: string | null;
};

const StocksContext = createContext<StocksContextType | undefined>(undefined);

export const StocksProvider = ({ children }: {children: React.ReactNode}) => {
  const [stocks, setStocks] = useState<StocksMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStocks = async () => {
        try {
            // Fetch the current stocks
            const data = await fetchCurrentStocks();

            // Fetch additional data for each stock and combine it
            const stocksWithData: Stock[] = await Promise.all(
                (data as Stock[]).map(async (stock) => {
                try {
                    const additionalData = await fetchStockBySymbol(stock.symbol, "minute");
                    return { ...stock, data: additionalData };
                } catch (err) {
                    console.error(`Failed to fetch data for symbol: ${stock.symbol}`, err);
                    return { ...stock, data: null };
                }
                })
            );

            // Convert the array to a map with the symbol as the key
            const stocksMap: StocksMap = stocksWithData.reduce((acc, stock) => {
                acc[stock.symbol] = stock;
                return acc;
            }, {} as StocksMap);

            setStocks(stocksMap);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch stocks:", err);
            setError("Failed to fetch stocks.");
        } finally {
            setLoading(false);
        }
    };

    getStocks();
    
    const channel = supabase
        .channel("current_stock-updates")
        .on("postgres_changes", 
            {
                event: "UPDATE",
                schema: "public",
                table: "current_stock_prices",
                filter: 'column IN ("price", "locked")'
            },
            (payload) => {
                setStocks(prevStocks => {
                    const updatedStocks = { ...prevStocks };
                    if (updatedStocks[payload.new.symbol]) {       
                        updatedStocks[payload.new.symbol] = {
                            ...updatedStocks[payload.new.symbol],
                            price: payload.new.price,
                            locked: payload.new.locked,
                        };
                    }
                    return updatedStocks;
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };

  }, []);

  return (
    <StocksContext.Provider value={{ stocks, loading, error }}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
    const context = useContext(StocksContext);
    if (!context) {
        throw new Error('useStocksContext must be used within a StocksProvider');
    }
    return context;
};
