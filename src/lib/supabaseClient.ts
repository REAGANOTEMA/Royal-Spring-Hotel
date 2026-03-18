// src/lib/supabaseClient.ts
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

/**
 * Initialize Supabase client (frontend-safe)
 * Uses VITE_ environment variables for URL & anon key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * ==============================
 * AUTHENTICATION FUNCTIONS
 * ==============================
 */

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Sign in existing user
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

/**
 * Get current user session
 */
export const getUserSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Change logged-in user's password
 */
export const changeUserPassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
};

/**
 * Change logged-in user's email
 */
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

/**
 * Fetch all rooms
 */
export const fetchRooms = async () => {
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) throw error;
  return data;
};

/**
 * Fetch inventory
 */
export const fetchInventory = async () => {
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) throw error;
  return data;
};

/**
 * Upload a document
 */
export const uploadDocument = async (
  name: string,
  category: string,
  url: string
) => {
  const session = await getUserSession();
  if (!session) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        name,
        category,
        url,
        uploaded_by: session.user.id, // stores auth.uid()
      },
    ]);
  if (error) throw error;
  return data;
};

/**
 * Update a document (only allowed if current user uploaded it)
 */
export const updateDocument = async (docId: string, updateFields: Partial<{ name: string; category: string; url: string }>) => {
  const { data, error } = await supabase
    .from('documents')
    .update(updateFields)
    .eq('id', docId);
  if (error) throw error;
  return data;
};

/**
 * Delete a document (only allowed if current user uploaded it)
 */
export const deleteDocument = async (docId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId);
  if (error) throw error;
  return data;
};

/**
 * Fetch audit logs
 */
export const fetchAuditLogs = async () => {
  const { data, error } = await supabase.from('audit_logs').select('*');
  if (error) throw error;
  return data;
};