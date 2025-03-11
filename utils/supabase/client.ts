import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/utils/database.types'
import type { TypedSupabaseClient } from '../types'

let client: TypedSupabaseClient | undefined

function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

export default createClient;