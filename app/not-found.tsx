import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center space-y-4 px-4 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-300">The page you are looking for does not exist.</p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
