import { useQueries } from '@tanstack/react-query';
import createClient from '../utils/supabase/client';
import { getNetworthHistoryById } from '@/queries/get-networth-history-by-id';

export const useNetworthHistory = (id: string | undefined) => {
    const client = createClient();

    const results = useQueries({
        queries: [
            {
                queryKey: ['networthHistory', id, 'minute'],
                queryFn: async () => {
                    if (!id) return [];
    
                    const { data, error } = await getNetworthHistoryById(client, id, 'minute');
    
                    if (error) {
                        throw error;
                    }
    
                    return data;
                },
                staleTime: 60 * 1000,
            },
            {
                queryKey: ['networthHistory', id, 'hourly'],
                queryFn: async () => {
                    if (!id) return [];
    
                    const { data, error } = await getNetworthHistoryById(client, id, 'hourly');
    
                    if (error) {
                        throw error;
                    }
    
                    return data;
                },
                staleTime: 60 * 1000 * 60,
            },
            {
                queryKey: ['networthHistory', id, 'daily'],
                queryFn: async () => {
                    if (!id) return [];
    
                    const { data, error } = await getNetworthHistoryById(client, id, 'daily');
    
                    if (error) {
                        throw error;
                    }
    
                    return data;
                },
                staleTime: 60 * 1000 * 60 * 24,
            },
            {
                queryKey: ['networthHistory', id, 'weekly'],
                queryFn: async () => {
                    if (!id) return [];
    
                    const { data, error } = await getNetworthHistoryById(client, id, 'weekly');
    
                    if (error) {
                        throw error;
                    }
    
                    return data;
                },
                staleTime: 60 * 1000 * 60 * 24 * 7,
            },
        ],
    });

    const networthHistory = {
        minute: results[0]?.data,
        hourly: results[1]?.data,
        daily: results[2]?.data,
        weekly: results[3]?.data,
    };

    return {
        networthHistory,
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
    };
};