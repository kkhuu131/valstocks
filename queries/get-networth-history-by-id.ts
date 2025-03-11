import { TypedSupabaseClient } from '@/utils/types'

// interval_type:
    // possible values: minute (last 6 hours), 5-minute (last 24 hours), hourly (last 30 days), daily (last week)
export function getNetworthHistoryById(client: TypedSupabaseClient, id: string, interval_type: string) {
  return client
    .from('networth_history')
    .select(
      `
      timestamp,
      networth
    `
    )
    .eq('user_id', id)
    .eq('interval_type', interval_type)
    .order('timestamp', { ascending: true })
    .throwOnError()
}