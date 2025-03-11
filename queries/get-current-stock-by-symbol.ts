import { TypedSupabaseClient } from '@/utils/types'

export function getCurrentStockBySymbol(client: TypedSupabaseClient, symbol: string) {
  return client
    .from('current_stock_prices')
    .select(
      `
      symbol,
      price,
      locked
    `
    )
    .eq('symbol', symbol)
    .single()
    .throwOnError()
}