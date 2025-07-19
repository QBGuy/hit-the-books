import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined or using placeholder value')
    // Return a mock client to prevent crashes
    return null
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined or using placeholder value')
    // Return a mock client to prevent crashes
    return null
  }

  console.log('Creating Supabase client with URL:', supabaseUrl)

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient() 