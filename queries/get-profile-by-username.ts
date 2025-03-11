import { TypedSupabaseClient } from '@/utils/types'

export function getProfileByUsername(client: TypedSupabaseClient, username: string) {
  return client
    .from('profiles')
    .select(
      `
      *
    `
    )
    .eq('username', username)
    .single()
    .throwOnError()
}