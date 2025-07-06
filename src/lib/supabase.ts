import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our project data from the "Projects" table
export interface Project {
  id: string
  title: string
  description?: string
  long_description?: string
  image?: string
  images?: string[]
  tags?: string[]
  technologies?: string[]
  date?: string
  status?: string
  live_url?: string
  github_url?: string
  created_at?: string
  updated_at?: string
}