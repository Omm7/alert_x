"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LoadingProvider } from "@/lib/loading-context";
import { SaveNotificationProvider } from "@/lib/save-notification-context";
import { BugReportProvider } from "@/lib/bug-report-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LoadingProvider>
          <SaveNotificationProvider>
            <BugReportProvider>
              {children}
            </BugReportProvider>
          </SaveNotificationProvider>
        </LoadingProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
