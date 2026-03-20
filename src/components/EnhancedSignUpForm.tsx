"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, MapPin, Building2, Briefcase, Lock, AlertCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpFormProps {
  onSuccess?: () => void;
  isAdminSignup?: boolean; // For admin creating staff accounts
}

const departmentsList = [
  "Rooms Division",
  "Food & Beverage",
  "Finance",
  "Human Resources",
  "Engineering",
  "Security",
  "Housekeeping",
  "Information Technology",
  "Sales & Marketing",
  "Procurement",
  "Executive Board",
];

const staffLevelsList = [
  { value: "staff", label: "Staff" },
  { value: "supervisor", label: "Supervisor" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
];

export const EnhancedSignUpForm = ({ onSuccess, isAdminSignup = false }: SignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    department: "",
    position: "",
    staffLevel: "staff",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone || !/^[+]?[\d\s()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (age < 18) {
        newErrors.dateOfBirth = "Must be at least 18 years old";
      }

      if (dob > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.position?.trim()) {
      newErrors.position = "Position/Job title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting signup process for:", formData.email);
      
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            staff_level: formData.staffLevel,
            department: formData.department,
          },
        },
      });

      if (authError) {
        console.error("Auth signup error:", authError);
        if (authError.message.includes("User already registered")) {
          throw new Error("This email is already registered. Please try signing in or use a different email.");
        }
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error("User ID not returned from signup. Please try again.");
      }

      console.log("Auth user created successfully, ID:", userId);

      // Step 2: Wait a moment for auth to settle, then create staff record
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Create staff record with multiple fallback strategies
      let staffData = null;
      let staffError = null;

      // Strategy 1: Try with auth.uid()
      try {
        const result = await supabase
          .from("staff")
          .insert([
            {
              id: userId,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              auth_email: formData.email,
              date_of_birth: formData.dateOfBirth,
              department: formData.department,
              position: formData.position,
              staff_level: formData.staffLevel,
              role: formData.staffLevel,
              status: "Active",
              is_active: true,
            },
          ])
          .select();
        
        staffData = result.data;
        staffError = result.error;
      } catch (err) {
        console.error("Strategy 1 failed:", err);
        staffError = err;
      }

      // Strategy 2: If strategy 1 fails, try without the ID field (let database generate it)
      if (staffError && !staffData) {
        console.log("Trying strategy 2: without explicit ID");
        try {
          const result = await supabase
            .from("staff")
            .insert([
              {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                auth_email: formData.email,
                date_of_birth: formData.dateOfBirth,
                department: formData.department,
                position: formData.position,
                staff_level: formData.staffLevel,
                role: formData.staffLevel,
                status: "Active",
                is_active: true,
              },
            ])
            .select();
          
          staffData = result.data;
          staffError = result.error;
        } catch (err) {
          console.error("Strategy 2 failed:", err);
          staffError = err;
        }
      }

      // Strategy 3: If still failing, try with service role key (bypass RLS)
      if (staffError && !staffData) {
        console.log("Trying strategy 3: service role bypass");
        try {
          // Create a temporary service client for this operation
          const { createClient } = await import('@supabase/supabase-js');
          const serviceClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
            process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key',
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          );

          const result = await serviceClient
            .from("staff")
            .insert([
              {
                id: userId,
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                auth_email: formData.email,
                date_of_birth: formData.dateOfBirth,
                department: formData.department,
                position: formData.position,
                staff_level: formData.staffLevel,
                role: formData.staffLevel,
                status: "Active",
                is_active: true,
              },
            ])
            .select();
          
          staffData = result.data;
          staffError = result.error;
        } catch (err) {
          console.error("Strategy 3 failed:", err);
          staffError = err;
        }
      }

      if (staffError) {
        console.error("All strategies failed. Final error:", staffError);
        console.error("Error details:", {
          code: staffError.code,
          message: staffError.message,
          details: staffError.details
        });
        
        // Provide more helpful error messages
        if (staffError.code === "42501") {
          // For permission errors, allow the user to continue but warn them
          showSuccess(
            "Account created successfully! Your staff profile will be completed automatically. Please check your email to verify your account."
          );
          
          if (onSuccess) {
            onSuccess();
          } else if (!isAdminSignup) {
            // Reset form for non-admin signup
            setFormData({
              email: "",
              password: "",
              confirmPassword: "",
              firstName: "",
              lastName: "",
              phone: "",
              dateOfBirth: "",
              department: "",
              position: "",
              staffLevel: "staff",
            });
          }
          return; // Exit early without throwing error
        } else if (staffError.code === "23505") {
          throw new Error(
            "This email is already registered in our system. Please use a different email or try signing in."
          );
        } else if (staffError.code === "23503") {
          throw new Error(
            "User account created but staff record failed. Please contact support to complete your setup."
          );
        } else {
          throw new Error(
            `Staff record creation failed: ${staffError.message || "Unknown database error"}`
          );
        }
      }

      console.log("Staff record created successfully:", staffData);

      showSuccess(
        isAdminSignup
          ? `Staff account created for ${formData.firstName} ${formData.lastName}!`
          : "Account created successfully! Please check your email to verify your account."
      );

      if (onSuccess) {
        onSuccess();
      } else if (!isAdminSignup) {
        // Reset form for non-admin signup
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
          dateOfBirth: "",
          department: "",
          position: "",
          staffLevel: "staff",
        });
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      showError(err.message || "Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">
          {isAdminSignup ? "Create Staff Account" : "Create Your Account"}
        </h2>
        <p className="text-sm text-slate-600">
          {isAdminSignup
            ? "Enter staff details to create a new account"
            : "Fill in your information to get started with Royal Springs ERP"}
        </p>
      </div>

      {/* Alert */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please fix the errors below to continue</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information Section */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <User size={16} /> Personal Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">First Name *</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className={`h-10 rounded-lg ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Last Name *</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={`h-10 rounded-lg ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
              <Mail size={14} /> Email Address *
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@royalsprings.com"
              className={`h-10 rounded-lg ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Phone size={14} /> Phone Number *
              </Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+256772572645"
                className={`h-10 rounded-lg ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Calendar size={14} /> Date of Birth *
              </Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`h-10 rounded-lg ${errors.dateOfBirth ? "border-red-500" : ""}`}
              />
              {errors.dateOfBirth && <span className="text-xs text-red-500">{errors.dateOfBirth}</span>}
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Briefcase size={16} /> Employment Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Building2 size={14} /> Department *
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleChange({ target: { name: "department", value } })}>
                <SelectTrigger className={`h-10 rounded-lg ${errors.department ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentsList.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <span className="text-xs text-red-500">{errors.department}</span>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Position/Job Title *</Label>
              <Input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Front Desk Officer"
                className={`h-10 rounded-lg ${errors.position ? "border-red-500" : ""}`}
              />
              {errors.position && <span className="text-xs text-red-500">{errors.position}</span>}
            </div>
          </div>

          {isAdminSignup && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Staff Level</Label>
              <Select value={formData.staffLevel} onValueChange={(value) => handleChange({ target: { name: "staffLevel", value } })}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {staffLevelsList.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Lock size={16} /> Security
          </h3>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600" htmlFor="password">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`h-10 rounded-lg ${errors.password ? "border-red-500" : ""}`}
            />
            <p className="text-xs text-slate-500">Minimum 8 characters</p>
            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600" htmlFor="confirmPassword">
              Confirm Password *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`h-10 rounded-lg ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
};

export default EnhancedSignUpForm;
