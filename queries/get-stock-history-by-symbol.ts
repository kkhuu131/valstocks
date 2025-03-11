import { TypedSupabaseClient } from '@/utils/types'

// interval_type:
    // possible values: minute (last 6 hours), 5-minute (last 24 hours), hourly (last 30 days), daily (last week)
export async function getStockHistoryBySymbol(client: TypedSupabaseClient, symbol: string, interval_type: string = '5-minute') {
  const { data, error } = await client
    .from('stock_prices')
    .select(
      `
      *
    `
    )
    .eq('symbol', symbol)
    .eq('interval_type', interval_type)
    .order('timestamp', { ascending: true })
    .throwOnError();

    if (error) {
      throw new Error(`Error fetching stock history: ${error}`);
    }
    
    return data;
}