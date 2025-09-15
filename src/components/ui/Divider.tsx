import type { ReactNode } from 'react';

export interface DividerProps {
  className?: string;
  type?: "horizontal" | "vertical";
  orientation?: "left" | "center" | "right";
  orientationMargin?: string | number;
  dashed?: boolean;
  children?: ReactNode;
  plain?: boolean;
}

export const Divider = ({
  className = "",
  type = "horizontal",
  orientation = "center",
  orientationMargin,
  dashed = false,
  children,
  plain = false,
}: DividerProps) => {
  const isVertical = type === "vertical";
  const hasChildren = !!children;

  const baseClasses = `
    ${isVertical ? "inline-block h-4 w-px mx-2" : "w-full my-4"}
    ${dashed ? "border-dashed" : "border-solid"}
    ${isVertical 
      ? "border-l border-gray-200 dark:border-gray-700" 
      : "border-t border-gray-200 dark:border-gray-700"
    }
  `.trim();

  if (isVertical) {
    return <div className={`${baseClasses} ${className}`} />;
  }

  if (!hasChildren) {
    return <div className={`${baseClasses} ${className}`} />;
  }

  const textClasses = `
    px-4 text-sm
    ${plain 
      ? "text-gray-500 dark:text-gray-400" 
      : "text-gray-900 dark:text-white font-medium"
    }
  `.trim();

  const marginStyle = orientationMargin 
    ? (typeof orientationMargin === 'number' 
        ? `${orientationMargin}px` 
        : orientationMargin)
    : undefined;

  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div 
        className={`
          flex-1 
          ${dashed ? "border-dashed" : "border-solid"} 
          border-t border-gray-200 dark:border-gray-700
          ${orientation === "left" ? "flex-none w-6" : ""}
        `}
        style={orientation === "left" && marginStyle ? { width: marginStyle } : undefined}
      />
      
      {children && (
        <span className={textClasses}>
          {children}
        </span>
      )}
      
      <div 
        className={`
          flex-1 
          ${dashed ? "border-dashed" : "border-solid"} 
          border-t border-gray-200 dark:border-gray-700
          ${orientation === "right" ? "flex-none w-6" : ""}
        `}
        style={orientation === "right" && marginStyle ? { width: marginStyle } : undefined}
      />
    </div>
  );
};
