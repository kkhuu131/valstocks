import { supabase } from './supabase';

export const fetchStocks = async () => {
    const { data, error } = await supabase.from('stock_prices').select('*');
    if (error) throw new Error(error.message);
    return data;
};

export const fetchStockBySymbol = async (symbol: string) => {
    const { data, error } = await supabase.from('stock_prices').select('*').eq('symbol', symbol).order('timestamp', {ascending: true});
    if (error) throw new Error(error.message);
    return data;
};

export const fetchCurrentStocks = async () => {
    const { data, error } = await supabase.from('current_stock_prices').select('symbol, price, locked');
    if (error) throw new Error(error.message);
    return data;
};
  
export const fetchCurrentStockBySymbol = async (symbol: string) => {
    const { data, error } = await supabase.from('current_stock_prices').select('symbol, price, locked').eq('symbol', symbol).single();
    if (error) throw new Error(error.message);
    return data;
};


