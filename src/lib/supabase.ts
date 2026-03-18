"use client";

import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

/**
 * Initialize Supabase client (frontend-safe)
 * Uses VITE_ environment variables for URL & anon key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If keys are missing, we use a dummy URL that won't crash the initialization
// but will fail gracefully during actual requests with a clear error.
const isConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseKey || 'placeholder-key'
);

/**
 * ==============================
 * AUTHENTICATION FUNCTIONS
 * ==============================
 */

/** Sign up a new user */
export const signUp = async (email: string, password: string) => {
  if (!isConfigured) throw new Error("Supabase is not connected. Please click 'Add Supabase' in the editor.");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/** Sign in an existing user */
export const signIn = async (email: string, password: string) => {
  if (!isConfigured) throw new Error("Supabase is not connected. Please click 'Add Supabase' in the editor.");
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