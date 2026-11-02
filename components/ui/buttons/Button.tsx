"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warning" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", type = "button", className, children, ...rest }, ref) => {
    // Variant style mapping
    const variantClasses = {
      primary: "rounded-sm border border-red-500/60 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
      secondary: "rounded-sm border border-white/10 px-2 py-1 text-xs text-zinc-300 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
      warning: "rounded-sm border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300 transition hover:bg-yellow-400/20 cursor-pointer",
      ghost: "rounded-sm px-2 py-1 text-xs text-zinc-500 transition hover:text-red-400 cursor-pointer disabled:cursor-not-allowed"
    };

    // Get base classes for selected variant
    const baseClasses = variantClasses[variant];
    
    // Merge custom className with variant base classes
    const mergedClassName = className ? `${baseClasses} ${className}` : baseClasses;

    return (
      <button
        ref={ref}
        type={type}
        className={mergedClassName}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
