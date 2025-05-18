import React from 'react';
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressCircle({
  progress,
  size = 120,
  strokeWidth = 8,
  showText = true,
  className,
  children
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-muted-foreground/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-in-out"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      ) : showText ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium">{Math.round(progress)}%</span>
        </div>
      ) : null}
    </div>
  );
}
