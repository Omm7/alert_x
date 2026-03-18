"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SaveNotification {
  message: string;
  type: "success" | "error";
}

interface SaveNotificationContextType {
  notification: SaveNotification | null;
  showNotification: (message: string, type?: "success" | "error") => void;
  clearNotification: () => void;
}

const SaveNotificationContext = createContext<SaveNotificationContextType | undefined>(undefined);

export function SaveNotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<SaveNotification | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const clearNotification = () => setNotification(null);

  return (
    <SaveNotificationContext.Provider value={{ notification, showNotification, clearNotification }}>
      {children}
    </SaveNotificationContext.Provider>
  );
}

export function useSaveNotification() {
  const context = useContext(SaveNotificationContext);
  if (!context) {
    throw new Error("useSaveNotification must be used within SaveNotificationProvider");
  }
  return context;
}
