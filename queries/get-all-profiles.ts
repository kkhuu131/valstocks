import { TypedSupabaseClient } from '@/utils/types'

// interval_type:
    // possible values: minute (last 6 hours), 5-minute (last 24 hours), hourly (last 30 days), daily (last week)
export function getAllProfiles(client: TypedSupabaseClient) {
  return client
    .from('profiles')
    .select(
      `
      username, picture
    `
    )
    .throwOnError()
}