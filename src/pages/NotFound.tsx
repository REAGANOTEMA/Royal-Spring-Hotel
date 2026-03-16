"use client";

import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-4">
        <h1 className="text-6xl font-extrabold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 underline font-semibold"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;