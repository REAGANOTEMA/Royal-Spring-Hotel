// src/api/createUser.ts
import { createClient } from '@supabase/supabase-js';

// Server-only keys (Note: These should be in environment variables)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const createUser = async (reqBody: any) => {
  try {
    const { email, password, role } = reqBody;

    if (!email || !password || !role) {
      throw new Error('Email, password, and role are required.');
    }

    const allowedRoles = ['director', 'gm', 'hr', 'staff'];
    if (!allowedRoles.includes(role)) {
      throw new Error('Invalid role specified.');
    }

    // Check how many users exist for this role
    const { data: existingUsers, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('role', role);

    if (userError) throw userError;

    // Role limits
    if (role === 'director' && existingUsers && existingUsers.length >= 1) {
      throw new Error('Only one director can exist.');
    }
    if (['gm', 'hr', 'staff'].includes(role) && existingUsers && existingUsers.length >= 12) {
      throw new Error(`Role limit reached for ${role.toUpperCase()}.`);
    }

    // Create Supabase Auth user (server-side)
    const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });

    if (authError) throw authError;

    // Insert into custom users table
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert([{ email, role }]);

    if (insertError) throw insertError;

    return { message: `${role.toUpperCase()} account created successfully!`, user: data.user };
  } catch (error: any) {
    console.error('Create user error:', error.message || error);
    throw error;
  }
};