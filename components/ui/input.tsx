import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-lg border-2 border-slate-300/60 bg-gradient-to-r from-white/80 to-slate-50/80 px-4 py-2 text-sm text-slate-900 outline-none transition-all duration-300 hover:border-slate-400 hover:shadow-md hover:from-white hover:to-slate-50 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 focus:ring-2 focus:ring-blue-200 dark:border-slate-600/60 dark:bg-gradient-to-r dark:from-slate-800/60 dark:to-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-900/40 dark:focus:shadow-cyan-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium",
        className,
      )}
      {...props}
    />
  );
}
