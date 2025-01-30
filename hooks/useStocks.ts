// useStocks.ts
import { useState, useEffect } from 'react';
import { fetchStocks } from '../lib/supabaseQueries';

type Stock = {
    symbol: string;
    price: number;
    locked: boolean;
};

export const useStocks = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getStocks = async () => {
            setLoading(true);
            try {
                const data = await fetchStocks();
                if (error) {
                    throw error;
                }
                setStocks(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getStocks();
    }, []);

    return { stocks, loading, error };
};
