import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-slate-200/60 bg-gradient-to-br from-white/80 to-slate-50/60 backdrop-blur-sm p-5 shadow-lg shadow-slate-200/30 dark:border-slate-700/50 dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-900/50 dark:shadow-slate-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/40 hover:border-slate-300/80 dark:hover:border-cyan-500/30 dark:hover:shadow-cyan-500/10", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-slate-600 dark:text-slate-300", className)} {...props} />;
}
