import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text",
  variant = "default",
  size = "default",
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    default: "border-gray-200 focus:border-primary focus:ring-primary",
    filled: "bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-primary",
  }
  
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    default: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  }
  
  const errorStyles = error ? "border-error focus:border-error focus:ring-error" : ""

  return (
    <input
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        errorStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input