// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// ✅ Use environment variables instead of hardcoding
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 3️⃣ Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)