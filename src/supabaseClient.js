// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// 1️⃣ Your Supabase Project URL
const supabaseUrl = 'https://royal-spring-hotel.supabase.co'

// 2️⃣ Your Publishable Key (safe for frontend)
const supabaseKey = 'sb_publishable_y-SSEqa4Mn6Pslu2wfAqJg_pw78sa7Z'

// 3️⃣ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)