import { useState, useEffect } from 'react';
import { getAllCurrentStock } from '../queries/get-all-current-stock';
import createClient from '../utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useStocks = () => {
    const [stocksObject, setStocksObject] = useState<{ [key: string]: any }>({});

    const { data, error, isLoading } = useQuery({
        queryKey: ['currentStocks'],
        queryFn: async () => {
            const client = createClient();
            const { data, error } = await getAllCurrentStock(client);
            if (error) {
                throw error;
            }

            return data;
        },
    });

    useEffect(() => {
        if (data) {
            const stocks = data.reduce((acc: { [key: string]: any }, stock: any) => {
                acc[stock.symbol] = stock;
                return acc;
            }, {});
            setStocksObject(stocks);
        }
    }, [data]);

    useEffect(() => {
        const client = createClient();
        const subscription = client
            .channel('current-stock-price-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'current_stock_prices',
                },
                (payload) => {
                    const updatedStock = payload.new;
                    setStocksObject((prevStocksObject) => ({
                        ...prevStocksObject,
                        [updatedStock.symbol]: updatedStock,
                    }));
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        stocksObject,  // Now we return the stocksObject
        isLoading,
        isError: !!error,
    };
};

