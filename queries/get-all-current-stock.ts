import { TypedSupabaseClient } from '@/utils/types'

export function getAllCurrentStock(client: TypedSupabaseClient) {
  return client
    .from('current_stock_prices')
    .select(
      `
      symbol,
      price,
      locked
    `
    )
    .throwOnError()
}