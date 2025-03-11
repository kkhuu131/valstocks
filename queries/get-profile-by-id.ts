import { TypedSupabaseClient } from '@/utils/types'

export function getProfileById(client: TypedSupabaseClient, id: string) {
  return client
    .from('profiles')
    .select(
      `
      *
    `
    )
    .eq('id', id)
    .single()
    .throwOnError()
}