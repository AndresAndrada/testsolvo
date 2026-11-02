"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Inherits all standard HTML input attributes
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    // Base styling with disabled states
    const baseClasses = "rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    
    // Merge custom className with base classes
    const mergedClassName = className ? `${baseClasses} ${className}` : baseClasses;

    return (
      <input
        ref={ref}
        className={mergedClassName}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";
