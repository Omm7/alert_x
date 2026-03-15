"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  isLoading?: boolean;
}

export function AnimatedButton({
  children,
  loading = false,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const isButtonLoading = loading || isLoading;
  const isButtonDisabled = disabled || isButtonLoading;

  return (
    <Button
      {...props}
      disabled={isButtonDisabled}
      className={`transition-all duration-150 active:scale-95 disabled:opacity-60 hover:shadow-md ${className}`}
    >
      {children}
    </Button>
  );
}
