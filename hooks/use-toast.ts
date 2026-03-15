"use client";

import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const toast = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  return { message, toast };
}
