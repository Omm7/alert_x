import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
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
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300">
                <Github className="size-5" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300">
                <Twitter className="size-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300">
                <Linkedin className="size-5" />
              </a>
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
