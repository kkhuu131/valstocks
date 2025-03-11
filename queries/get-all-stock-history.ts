import { TypedSupabaseClient } from '@/utils/types'

export function getAllStockHistory(client: TypedSupabaseClient) {
  return client
    .from('stock_prices')
    .select(
      `
      *
    `
    )
    .order('timestamp', { ascending: true })
    .throwOnError()
}