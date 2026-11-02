"use client";

import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Inherits all standard HTML select attributes
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...rest }, ref) => {
    // Base styling matching original select components
    const baseClasses = "w-full rounded-sm border border-white/10 bg-black/65 px-3 py-2 text-sm text-zinc-100 shadow-[0_20px_60px_-40px_rgba(239,68,68,0.8)] transition focus:border-red-500/60 focus:outline-none focus:ring-0";
    
    // Merge custom className with base classes
    const mergedClassName = className ? `${baseClasses} ${className}` : baseClasses;

    return (
      <select
        ref={ref}
        className={mergedClassName}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
