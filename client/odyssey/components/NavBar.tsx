"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Exclude NavBar on Landing Page, Login, and Signup
    if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
        return null;
    }

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsProfileHovered(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsProfileHovered(false);
        }, 200); // Small delay to allow moving mouse to dropdown
    };

    return (
        // Centered, constrained width "pill" style
        <nav className="sticky top-4 z-[1000] mx-auto w-[90%] max-w-[1200px] px-7 py-3.5 mt-5 flex items-center justify-between shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md bg-[#F5EFE6]/30 border border-white/40 rounded-[18px] transition-all duration-300">

            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/dashboard")}
            >
                <div className="w-7 h-7 flex items-center justify-center">
                    <img
                        src="/Odyssey_Logo.png"
                        alt="Odyssey Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <span className="text-xl sm:text-2xl font-medium font-odyssey tracking-wider text-[#111]">
                    Odyssey
                </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-7">
                {[
                    { name: "Home", path: "/dashboard" },
                    { name: "Planner", path: "/planner" },
                    { name: "Trip Mode", path: "/trip" },
                    { name: "Destinations", path: "/destinations" },
                    { name: "Co-travellers", path: "/co-travellers" },
                ].map((link) => (
                    <Link
                        key={link.name}
                        href={link.path}
                        className={`text-sm font-medium relative transition-opacity hover:opacity-70 ${isActive(link.path) ? "text-black after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-black after:left-0 after:-bottom-1.5" : "text-[#111]"
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Profile & Mobile Toggle */}
            <div className="flex items-center gap-3 relative">
                <button className="p-2 text-gray-700 hover:bg-black/5 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                </button>

                {/* Profile Dropdown Container */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-white shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => router.push("/profile")}
                    >
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                    </div>

                    {/* Bridge pseudo-element to bridge gap if needed, but relative positioning usually handles it. Adding padding-top to dropdown container helps too. */}

                    <div
                        className={`absolute right-0 top-full pt-2 w-56 transition-all duration-300 origin-top-right z-50 ${isProfileHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                            }`}
                    >
                        {/* Actual Dropdown Content */}
                        <div className="bg-[#FFF5E9] rounded-2xl shadow-xl border border-white/50 overflow-hidden p-2">
                            <Link href="/my-destinations" className="block px-4 py-3 text-sm text-gray-800 hover:bg-[#FCE1CC] rounded-xl transition-colors font-medium">
                                My Destinations
                            </Link>
                            <Link href="/saved-places" className="block px-4 py-3 text-sm text-gray-800 hover:bg-[#FCE1CC] rounded-xl transition-colors font-medium">
                                Saved Places
                            </Link>
                            <Link href="/admin" className="block px-4 py-3 text-sm text-gray-800 hover:bg-[#FCE1CC] rounded-xl transition-colors font-medium">
                                Settings
                            </Link>
                            <div className="h-px bg-gray-200 my-1 mx-2"></div>
                            <Link href="/login" className="block px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
