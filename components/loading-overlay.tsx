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
          <Loader />
        </div>
      )}
    </>
  );
}
