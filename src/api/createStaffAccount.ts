// src/api/createStaffAccount.ts
// Server-side staff account creation using service role (bypasses RLS)
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

const getSupabaseAdmin = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Supabase configuration missing. Please check environment variables.");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
};

interface CreateStaffAccountRequest {
  id: string; // Auth user ID from signup
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  department: string;
  position: string;
  staffLevel: string;
}

export const createStaffAccount = async (data: CreateStaffAccountRequest) => {
  try {
    const {
      id,
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      department,
      position,
      staffLevel,
    } = data;

    // Validation
    if (!id) throw new Error("User ID is required");
    if (!email) throw new Error("Email is required");
    if (!firstName?.trim()) throw new Error("First name is required");
    if (!lastName?.trim()) throw new Error("Last name is required");
    if (!department) throw new Error("Department is required");
    if (!position?.trim()) throw new Error("Position is required");

    const supabaseAdmin = getSupabaseAdmin();

    // Insert staff record using service role (bypasses RLS)
    const { data: staffData, error: staffError } = await supabaseAdmin
      .from("staff")
      .insert([
        {
          id,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          auth_email: email,
          date_of_birth: dateOfBirth,
          department,
          position,
          staff_level: staffLevel,
          role: staffLevel,
          status: "Active",
          is_active: true,
        },
      ])
      .select();

    if (staffError) {
      console.error("Staff insertion error:", staffError);
      throw new Error(
        `Failed to create staff record: ${staffError.message || "Unknown error"}`
      );
    }

    return {
      success: true,
      message: "Staff account created successfully!",
      staff: staffData?.[0],
    };
  } catch (error: any) {
    console.error("Create staff account error:", error);
    throw new Error(error.message || "Staff account creation failed");
  }
};
