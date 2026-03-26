import React from "react";

const variantClass = {
  neutral: "ei-badge--neutral",
  info: "ei-badge--info",
  warning: "ei-badge--warning",
  danger: "ei-badge--danger",
  success: "ei-badge--success",
};

// PUBLIC_INTERFACE
export default function Badge({ variant = "neutral", children, className = "", ...props }) {
  /** Small status label with theme variants. */
  const cls = variantClass[variant] ?? variantClass.neutral;
  return (
    <span className={`ei-badge ${cls} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
