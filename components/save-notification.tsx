"use client";

import { useSaveNotification } from "@/lib/save-notification-context";

export function SaveNotification() {
  const { notification } = useSaveNotification();

  if (!notification) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div
        className={`px-6 py-3 rounded-xl shadow-lg font-semibold text-white ${
          notification.type === "success"
            ? "bg-gradient-to-r from-blue-600 to-cyan-600"
            : "bg-gradient-to-r from-red-600 to-pink-600"
        }`}
      >
        {notification.message}
      </div>
    </div>
  );
}
