"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const safeParams = params || new URLSearchParams();

  return (
    <Input
      placeholder="Search jobs, companies, skills..."
      defaultValue={safeParams.get("search") || ""}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          const target = event.target as HTMLInputElement;
          const next = new URLSearchParams(safeParams.toString());
          if (target.value) {
            next.set("search", target.value);
          } else {
            next.delete("search");
          }
          next.set("page", "1");
          router.push(`/jobs?${next.toString()}`);
        }
      }}
    />
  );
}
