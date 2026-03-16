// src/api/createUser.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Never expose this to the frontend

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  // Ensure only allowed roles
  const allowedRoles = ["director", "gm", "hr", "staff"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  // Check the number of users for the selected role
  const { data: users, error: userError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('role', role);

  if (userError) {
    return res.status(500).json({ message: userError.message });
  }

  // Role-specific limits
  if (role === 'director' && users.length >= 1) {
    return res.status(400).json({ message: 'Only one director can be created.' });
  }
  if (['gm', 'hr', 'staff'].includes(role) && users.length >= 12) {
    return res.status(400).json({ message: 'Role limit reached for GM, HR, or Staff.' });
  }

  // Create the user in Supabase Auth using service key
  const { user, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (authError) {
    return res.status(500).json({ message: authError.message });
  }

  // Add the user to your custom users table (if needed)
  const { error: insertError } = await supabaseAdmin
    .from('users')
    .insert([{ email, role }]);

  if (insertError) {
    return res.status(500).json({ message: insertError.message });
  }

  // Return success
  return res.status(200).json({ message: `${role} account created successfully.` });
};