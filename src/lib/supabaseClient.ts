// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Supabase client setup (frontend-safe, uses anon/public key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Change the currently logged-in user's password
 * @param newPassword - the new password string
 */
export const changeUserPassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return "Password updated successfully";
};

/**
 * Change the currently logged-in user's email
 * @param newEmail - the new email string
 */
export const changeUserEmail = async (newEmail: string) => {
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
  return "Confirmation email sent. Please verify.";
};