"use client";

import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

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

/** Sign up a new user */
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/** Sign in an existing user */
export const signIn = async (email: string, password: string) => {
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
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) throw error;
  return data;
};

/** Fetch all inventory items */
export const fetchInventory = async () => {
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) throw error;
  return data;
};

/** Fetch audit logs */
export const fetchAuditLogs = async () => {
  const { data, error } = await supabase.from('audit_logs').select('*');
  if (error) throw error;
  return data;
};

/** Upload a document (auto-assigns logged-in user as uploader) */
export const uploadDocument = async (
  name: string,
  category: string,
  url: string
) => {
  const user = await getUser();
  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('documents')
    .insert([{ name, category, url, uploaded_by: user.id }]);
  if (error) throw error;
  return data;
};

/** Update a document (only the uploader can update) */
export const updateDocument = async (
  docId: string,
  updateFields: Partial<{ name: string; category: string; url: string }>
) => {
  const { data, error } = await supabase
    .from('documents')
    .update(updateFields)
    .eq('id', docId);
  if (error) throw error;
  return data;
};

/** Delete a document (only the uploader can delete) */
export const deleteDocument = async (docId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId);
  if (error) throw error;
  return data;
};