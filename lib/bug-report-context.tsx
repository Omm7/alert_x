"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BugReportContextType {
  isVisible: boolean;
  showBugReport: () => void;
  hideBugReport: () => void;
}

const BugReportContext = createContext<BugReportContextType | undefined>(undefined);

export function BugReportProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const showBugReport = () => setIsVisible(true);
  const hideBugReport = () => setIsVisible(false);

  return (
    <BugReportContext.Provider value={{ isVisible, showBugReport, hideBugReport }}>
      {children}
    </BugReportContext.Provider>
  );
}

export function useBugReport() {
  const context = useContext(BugReportContext);
  if (!context) {
    throw new Error("useBugReport must be used within BugReportProvider");
  }
  return context;
}
