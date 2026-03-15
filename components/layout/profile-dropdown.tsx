"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  if (!session?.user) return null;

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-1.5 py-1 rounded-lg transition-all duration-200 hover:ring-2 hover:ring-cyan-400/50"
        aria-label="Profile menu"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow duration-200 group-hover:scale-110">
          {initials}
        </div>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Overlay to fix text mixing - click outside to close */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-72 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden animate-scale-in z-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-gradient-to-br from-white/5 to-white/[0.02]">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/50">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-4 py-3 space-y-2 border-b border-white/5">
            {session.user.collegeName && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-500">College</span>
                <span className="text-sm text-gray-200">
                  {session.user.collegeName}
                </span>
              </div>
            )}
            {session.user.branch && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-500">Branch</span>
                <span className="text-sm text-gray-200">
                  {session.user.branch}
                </span>
              </div>
            )}
            {session.user.graduationYear && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-500">Passing Year</span>
                <span className="text-sm text-gray-200">
                  {session.user.graduationYear}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-2 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 text-sm font-medium"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
