"use client";

import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Lock } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center bg-white border border-red-200 shadow-xl rounded-3xl p-10 w-full max-w-md">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-700 mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">
            You don't have permission to view this page. Please contact your administrator if you believe this is an error.
          </p>
          <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Take me back
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unauthorized;
