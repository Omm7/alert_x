import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 dark:from-blue-600 dark:to-blue-700 dark:hover:shadow-blue-500/30",
        accent: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/30",
        outline: "border-2 border-blue-500/50 bg-transparent text-blue-600 hover:bg-blue-50/10 hover:border-blue-500 shadow-sm dark:border-cyan-500/50 dark:text-cyan-300 dark:hover:bg-cyan-500/10 dark:hover:border-cyan-500 transition-all",
        ghost: "text-blue-600 hover:bg-blue-100/50 dark:text-cyan-300 dark:hover:bg-cyan-500/10 hover:shadow-md hover:shadow-blue-500/10",
        secondary: "bg-gradient-to-br from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900 shadow-md hover:shadow-lg dark:from-slate-600 dark:to-slate-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
