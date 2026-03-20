/**
 * Supabase Configuration and Utilities
 * Complete setup for Royal Springs Resort
 */

import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// Environment variables - supports both Vite and Next.js
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseServiceKey = 
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check if configuration is complete
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  throw new Error(`
========================================
SUPABASE CONFIGURATION ERROR
========================================

Missing environment variables. Please set up your Supabase project:

Required Variables:
- VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY

Optional Variables:
- SUPABASE_SERVICE_ROLE_KEY (for admin operations)

Get these from your Supabase Dashboard > Settings > API
========================================
  `);
}

// Create different clients for different use cases
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Service client for admin operations (if service key is available)
export const supabaseAdmin: SupabaseClient = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client

// Export configuration for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  anonKeyLength: supabaseAnonKey.length,
  isConfigured,
  hasServiceKey: Boolean(supabaseServiceKey)
};

// Type definitions for better TypeScript support
export interface DatabaseUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    staff_level?: string;
    department?: string;
    role?: string;
  };
  created_at: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  staff_level: string;
  role: string;
  status: string;
  is_active: boolean;
  date_of_birth?: string;
  auth_email?: string;
}

export interface Room {
  id: string;
  room_number: string;
  room_type: string;
  bed_type: string;
  status: string;
  rate: number;
  capacity: number;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  created_at: string;
}

// Enhanced authentication functions with better error handling
export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(`Registration failed: ${error.message}`);
      }
      
      return data;
    } catch (err) {
      console.error('Unexpected signup error:', err);
      throw new Error('Registration failed. Please try again.');
    }
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase signin error:', error);
        throw new Error(`Login failed: ${error.message}`);
      }
      
      return data;
    } catch (err) {
      console.error('Unexpected signin error:', err);
      throw new Error('Login failed. Please try again.');
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        throw new Error('Sign out failed');
      }
      return true;
    } catch (err) {
      console.error('Unexpected signout error:', err);
      throw new Error('Sign out failed');
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        return null;
      }
      return session;
    } catch (err) {
      console.error('Unexpected session error:', err);
      return null;
    }
  },

  // Get current user
  getUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (error) {
        console.error('Get user error:', error);
        return null;
      }
      return user;
    } catch (err) {
      console.error('Unexpected user error:', err);
      return null;
    }
  },

  // Update user
  updateUser: async (metadata: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.updateUser(metadata);
      if (error) {
        console.error('Update user error:', error);
        throw new Error(`Update failed: ${error.message}`);
      }
      return data;
    } catch (err) {
      console.error('Unexpected update error:', err);
      throw new Error('Update failed. Please try again.');
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Reset password error:', error);
        throw new Error(`Password reset failed: ${error.message}`);
      }
      return { data: {}, error: null };
    } catch (err) {
      console.error('Unexpected reset error:', err);
      throw new Error('Password reset failed. Please try again.');
    }
  }
};

// Enhanced database functions with proper error handling
export const db = {
  // Generic fetch function
  fetch: async <T>(table: string, options?: any) => {
    try {
      let query = supabase.from(table).select('*');
      
      if (options?.where) {
        query = query.where(options.where);
      }
      
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, options.orderBy.ascending ? { ascending: true } : { ascending: false });
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.single) {
        query = query.single();
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Database fetch error (${table}):`, error);
        throw new Error(`Failed to fetch ${table}: ${error.message}`);
      }
      
      return data as T[];
    } catch (err) {
      console.error(`Unexpected database error (${table}):`, err);
      throw new Error(`Failed to fetch ${table}. Please try again.`);
    }
  },

  // Insert function
  insert: async <T>(table: string, records: Partial<T>[]) => {
    try {
      const { data, error } = await supabase.from(table).insert(records);
      
      if (error) {
        console.error(`Database insert error (${table}):`, error);
        throw new Error(`Failed to insert ${table}: ${error.message}`);
      }
      
      return data as T[];
    } catch (err) {
      console.error(`Unexpected database error (${table}):`, err);
      throw new Error(`Failed to insert ${table}. Please try again.`);
    }
  },

  // Update function
  update: async <T>(table: string, id: string, updates: Partial<T>) => {
    try {
      const { data, error } = await supabase.from(table).update(updates).eq('id', id);
      
      if (error) {
        console.error(`Database update error (${table}):`, error);
        throw new Error(`Failed to update ${table}: ${error.message}`);
      }
      
      return data as T[];
    } catch (err) {
      console.error(`Unexpected database error (${table}):`, err);
      throw new Error(`Failed to update ${table}. Please try again.`);
    }
  },

  // Delete function
  delete: async <T>(table: string, id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) {
        console.error(`Database delete error (${table}):`, error);
        throw new Error(`Failed to delete ${table}: ${error.message}`);
      }
      
      return true;
    } catch (err) {
      console.error(`Unexpected database error (${table}):`, err);
      throw new Error(`Failed to delete ${table}. Please try again.`);
    }
  },

  // Real-time subscription
  subscribe: <T>(table: string, callback: (payload: T) => void) => {
    try {
      return supabase
        .channel(`public:${table}`)
        .on('postgres_changes', (event) => {
          if (event.eventType === 'INSERT' || event.eventType === 'UPDATE' || event.eventType === 'DELETE') {
            callback(event.new as T);
          }
        })
        .subscribe();
    } catch (err) {
      console.error(`Subscription error (${table}):`, err);
      // Return empty subscription
      return { data: [], unsubscribe: () => {} };
    }
  }
};

// Utility functions
export const utils = {
  // Format date
  formatDate: (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Generate unique ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36).substr(2);
  },

  // Validate email
  validateEmail: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Calculate occupancy rate
  calculateOccupancyRate: (occupied: number, total: number) => {
    return total > 0 ? (occupied / total) * 100 : 0;
  },

  // Format currency
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};

export default supabase;
