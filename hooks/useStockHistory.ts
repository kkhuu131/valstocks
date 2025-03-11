import { useQueries } from '@tanstack/react-query';
import createClient from '../utils/supabase/client';
import { getStockHistoryBySymbol } from '../queries/get-stock-history-by-symbol';

export const useStockHistory = (symbol: string) => {
    const client = createClient();

    const results = useQueries({
        queries: [
        {
            queryKey: ['stock', symbol, 'minute'],
            queryFn: () => getStockHistoryBySymbol(client, symbol, 'minute'),
            staleTime: 60 * 1000,
        },
        {
            queryKey: ['stock', symbol, '5-minute'],
            queryFn: () => getStockHistoryBySymbol(client, symbol, '5-minute'),
            staleTime: 60 * 1000 * 5,
        },
        {
            queryKey: ['stock', symbol, 'hourly'],
            queryFn: () => getStockHistoryBySymbol(client, symbol, 'hourly'),
            staleTime: 60 * 1000 * 60,
        },
        {
            queryKey: ['stock', symbol, 'daily'],
            queryFn: () => getStockHistoryBySymbol(client, symbol, 'daily'),
            staleTime: 60 * 1000 * 60 * 24,
        }
        ],
    });

    const stockHistory = {
        minute: results[0]?.data,
        fiveMinute: results[1]?.data,
        hourly: results[2]?.data,
        daily: results[3]?.data,
    };

    return {
        stockHistory,
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
    };
};