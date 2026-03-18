"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showSocialMessage = () => {
    // Show toast notification
    const message = "We're currently working on adding our social media links. Stay tuned!";
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs sm:text-sm rounded-lg shadow-lg animate-slide-up max-w-xs sm:max-w-sm';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  return (
    <footer className="mt-auto border-t border-slate-200/40 bg-gradient-to-b from-slate-50/50 to-slate-100/30 py-12 dark:border-slate-700/30 dark:bg-gradient-to-b dark:from-slate-950/50 dark:to-slate-900/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Qyvex</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Startup-grade career platform connecting talented CS students with cutting-edge opportunities.</p>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Quick Links</p>
            <Link href="/about" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-1">About</Link>
            <Link href="/contact" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-1">Contact</Link>
            <Link href="/privacy" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-1">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-1">Terms</Link>
          </nav>

          <div className="space-y-3">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Follow Us</p>
            <div className="flex items-center gap-4">
              <button
                onClick={showSocialMessage}
                aria-label="GitHub"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer"
              >
                <Github className="size-5" />
              </button>
              <button
                onClick={showSocialMessage}
                aria-label="Twitter"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer"
              >
                <Twitter className="size-5" />
              </button>
              <button
                onClick={showSocialMessage}
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer"
              >
                <Linkedin className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/40 dark:border-slate-700/30 pt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} Qyvex. All rights reserved. Crafted with ❤️
        </div>
      </div>
    </footer>
  );
}
