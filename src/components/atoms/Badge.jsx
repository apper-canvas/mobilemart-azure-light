import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  variant = "default", 
  size = "default",
  className, 
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-smooth"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-gradient-to-r from-accent to-orange-500 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    outline: "border border-gray-200 text-gray-600 bg-white"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  }

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge