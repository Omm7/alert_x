"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Loader } from "@/components/ui/loader";

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
      className={`transition-all duration-150 active:scale-95 disabled:opacity-60 hover:shadow-md relative ${className}`}
    >
      {isButtonLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="scale-[0.45]">
            <Loader />
          </div>
        </span>
      )}
      <span className={isButtonLoading ? "invisible" : "visible"}>
        {children}
      </span>
    </Button>
  );
}
