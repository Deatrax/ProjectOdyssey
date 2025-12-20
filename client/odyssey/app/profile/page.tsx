"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user data to show their name
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // 1. Clear session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // 2. Redirect to login
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FFF5E9] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-stone-100">
        
        {/* Profile Avatar Placeholder */}
        <div className="w-24 h-24 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          👤
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {user?.username || "Traveller"}
        </h1>
        <p className="text-gray-500 text-sm mb-8">{user?.email || "User Profile"}</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition"
          >
            ← Back to Dashboard
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 border border-red-100 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}