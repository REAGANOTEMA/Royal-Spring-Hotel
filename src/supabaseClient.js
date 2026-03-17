// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

/**
 * ==============================
 * Supabase Client Initialization
 * ==============================
 * Uses environment variables (Vite) for frontend-safe access
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * ==============================
 * AUTHENTICATION FUNCTIONS
 * ==============================
 */

/** Sign up a new user */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

/** Sign in an existing user */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/** Sign out the current user */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

/** Get current logged-in session */
export const getUserSession = async () => {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/** Get current logged-in user */
export const getUser = async () => {
  const session = await getUserSession()
  return session?.user || null
}

/** Change the logged-in user's password */
export const changeUserPassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data
}

/** Change the logged-in user's email */
export const changeUserEmail = async (newEmail) => {
  const { data, error } = await supabase.auth.updateUser({ email: newEmail })
  if (error) throw error
  return data
}

/**
 * ==============================
 * DATABASE FUNCTIONS
 * ==============================
 */

/** Fetch all rooms */
export const fetchRooms = async () => {
  const { data, error } = await supabase.from('rooms').select('*')
  if (error) throw error
  return data
}

/** Fetch all inventory items */
export const fetchInventory = async () => {
  const { data, error } = await supabase.from('inventory').select('*')
  if (error) throw error
  return data
}

/** Fetch audit logs */
export const fetchAuditLogs = async () => {
  const { data, error } = await supabase.from('audit_logs').select('*')
  if (error) throw error
  return data
}

/** Upload a document (logged-in user auto assigned) */
export const uploadDocument = async (name, category, url) => {
  const user = await getUser()
  if (!user) throw new Error('User not logged in')

  const { data, error } = await supabase
    .from('documents')
    .insert([{ name, category, url, uploaded_by: user.id }])
  if (error) throw error
  return data
}

/** Update a document (only uploader can update) */
export const updateDocument = async (docId, updateFields) => {
  const { data, error } = await supabase
    .from('documents')
    .update(updateFields)
    .eq('id', docId)
  if (error) throw error
  return data
}

/** Delete a document (only uploader can delete) */
export const deleteDocument = async (docId) => {
  const { data, error } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId)
  if (error) throw error
  return data
}