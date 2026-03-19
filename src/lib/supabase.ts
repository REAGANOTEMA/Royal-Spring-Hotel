"use client";

import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

/**
 * Initialize Supabase client (frontend-safe)
 * Uses VITE_ environment variables (Vite) but also falls back to NEXT_PUBLIC_ for compatibility.
 */
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Check if keys are provided
const isConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isConfigured) {
  // Fail fast: missing env vars cause silent "Failed to fetch" errors.
  throw new Error(
    '[supabase] Missing environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or in your deployment environment (Render/Netlify/etc).' 
  );
}

if (import.meta.env.DEV) {
  console.log('[supabase] URL:', supabaseUrl);
  console.log('[supabase] using anon key length:', supabaseKey.length);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Expose for debugging and diagnostics
export const supabaseConfig = {
  url: supabaseUrl,
  anonKeyLength: supabaseKey.length,
};


/**
 * ==============================
 * AUTHENTICATION FUNCTIONS
 * ==============================
 */

/** Sign up a new user */
export const signUp = async (email: string, password: string) => {
  if (!isConfigured) throw new Error("Supabase is not connected. Please configure NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/** Sign in an existing user */
export const signIn = async (email: string, password: string) => {
  if (!isConfigured) throw new Error("Supabase is not connected. Please configure NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

/** Sign out current user */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

/** Get current user session */
export const getUserSession = async (): Promise<Session | null> => {
  if (!isConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/** Get current logged-in user */
export const getUser = async (): Promise<User | null> => {
  const session = await getUserSession();
  return session?.user || null;
};

/** Change logged-in user's password */
export const changeUserPassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
};

/** Change logged-in user's email */
export const changeUserEmail = async (newEmail: string) => {
  const { data, error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
  return data;
};

/**
 * ==============================
 * DATABASE FUNCTIONS
 * ==============================
 */

/** Fetch all rooms */
export const fetchRooms = async () => {
  if (!isConfigured) return [];
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) throw error;
  return data;
};

/** Fetch all inventory items */
export const fetchInventory = async () => {
  if (!isConfigured) return [];
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) throw error;
  return data;
};

/** Fetch audit logs */
export const fetchAuditLogs = async () => {
  if (!isConfigured) return [];
  const { data, error } = await supabase.from('audit_logs').select('*');
  if (error) throw error;
  return data;
};