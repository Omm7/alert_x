"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

function updateParam(
  router: ReturnType<typeof useRouter>,
  searchParams: { toString(): string } | null,
  key: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams?.toString() || "");
  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  params.set("page", "1");
  router.push(`/jobs?${params.toString()}`);
}

export function FilterPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const safeParams = params || new URLSearchParams();

  return (
    <div className="space-y-3 rounded-xl border border-slate-300 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900/60 transition-all duration-300 hover:border-slate-400 hover:shadow-lg dark:hover:border-slate-600">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Filters</h3>

      <Select
        defaultValue={safeParams.get("location") || ""}
        onChange={(event) => updateParam(router, safeParams, "location", event.target.value)}
      >
        <option value="">All Locations</option>
        <option value="Remote">Remote</option>
        <option value="Bengaluru">Bengaluru</option>
        <option value="Hyderabad">Hyderabad</option>
      </Select>

      <Select
        defaultValue={safeParams.get("jobType") || ""}
        onChange={(event) => updateParam(router, safeParams, "jobType", event.target.value)}
      >
        <option value="">All Job Types</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="INTERN">Internship</option>
        <option value="OFF_CAMPUS">Off Campus</option>
      </Select>

      <Select
        defaultValue={safeParams.get("experience") || ""}
        onChange={(event) => updateParam(router, safeParams, "experience", event.target.value)}
      >
        <option value="">All Experience</option>
        <option value="ENTRY">Entry</option>
        <option value="MID">Mid</option>
        <option value="SENIOR">Senior</option>
      </Select>

      <Select
        defaultValue={safeParams.get("sort") || "latest"}
        onChange={(event) => updateParam(router, safeParams, "sort", event.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="highest_salary">Highest Salary</option>
        <option value="relevant">Most Relevant</option>
      </Select>
    </div>
  );
}
