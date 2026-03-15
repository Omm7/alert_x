"use client";

import { useLoading } from "@/lib/loading-context";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

export function LoadingOverlay() {
  const { isLoading } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
