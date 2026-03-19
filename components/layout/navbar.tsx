"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ProfileDropdown } from "./profile-dropdown";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/internships", label: "Internships" },
  { href: "/companies", label: "Companies" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setMounted(true);
    setCurrentPath(typeof window !== "undefined" ? window.location.pathname : "");
  }, []);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Check if route is active
  const isActive = (href: string) => currentPath === href;

  // Only render user buttons once component is mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/5 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]" />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
            <Image 
              src="/qyvex short logo.png" 
              alt="QYVEX Logo" 
              width={32} 
              height={32} 
              priority 
              className="object-contain"
            />
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">QYVEX</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:scale-105 transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
    }`}>
      {/* Background layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/5 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]" />
      
      {/* Content layer */}
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <Image 
            src="/qyvex short logo.png" 
            alt="QYVEX Logo" 
            width={32} 
            height={32} 
            priority 
            className="object-contain"
          />
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">QYVEX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors duration-200 relative group"
              >
                {link.label}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Area */}
        <div className="hidden items-center gap-4 md:flex">
          {status === "loading" ? (
              <div className="flex items-center justify-center px-3">
                <div className="scale-[0.4]">
                  <Loader />
                </div>
            </div>
          ) : !session ? (
            <>
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button 
                asChild 
                size="sm" 
                className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:scale-105 transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                asChild 
                variant="ghost"
                size="sm" 
                className="text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                <Link href="/dashboard">Saved Jobs</Link>
              </Button>
              <ProfileDropdown />
              {session.user.role === "ADMIN" && (
                <Button 
                  asChild 
                  size="sm"
                  className="text-sm px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-all duration-200"
                >
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-gray-300 hover:text-cyan-400 transition-colors duration-200 relative w-6 h-6"
          onClick={() => setOpen((prev) => !prev)} 
          aria-label="Toggle menu"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <span className={`h-0.5 w-5 bg-current transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-5 bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-current transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-40 md:hidden">
          <div className="relative bg-black/60 backdrop-blur-xl border-b border-white/5 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 animate-slide-up">
            <div className="mx-auto max-w-7xl px-6 py-4 space-y-3">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={`block text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        active
                          ? "text-white bg-cyan-500/20 border border-cyan-500/30"
                          : "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Auth Area */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                {status === "loading" ? (
                    <div className="flex items-center justify-center py-3">
                      <div className="scale-[0.4]">
                        <Loader />
                      </div>
                  </div>
                ) : !session ? (
                  <>
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-sm text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button 
                      asChild 
                      size="sm" 
                      className="w-full text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium"
                    >
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      asChild 
                      variant="ghost"
                      size="sm" 
                      className="w-full justify-start text-sm text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                    >
                      <Link href="/dashboard">Saved Jobs</Link>
                    </Button>
                    <ProfileDropdown />
                    {session.user.role === "ADMIN" && (
                      <Button 
                        asChild 
                        size="sm"
                        className="w-full text-sm bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30"
                      >
                        <Link href="/admin">Admin</Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
