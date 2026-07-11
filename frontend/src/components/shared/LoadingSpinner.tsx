// Copyright © 2026 Browns Studio
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  centered?: boolean;
}

const SIZE_MAP = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export function LoadingSpinner({ size = "md", label, centered = true }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${SIZE_MAP[size]} border-[#10B981] border-t-transparent rounded-full animate-spin`}
      />
      {label && <p className="text-[#94A3B8] text-sm">{label}</p>}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center py-12">
        {spinner}
      </div>
    );
  }

  return spinner;
}
