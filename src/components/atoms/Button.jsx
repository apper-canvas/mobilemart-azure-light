import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg focus:ring-primary",
    secondary: "bg-white text-secondary border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    accent: "bg-gradient-to-r from-accent to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg focus:ring-accent",
    ghost: "text-secondary hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-error"
  }
  
  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    default: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
    xl: "text-lg px-8 py-4 gap-3"
  }
  
  const iconSize = {
    sm: 16,
    default: 18,
    lg: 20,
    xl: 22
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-50 cursor-not-allowed",
        !isDisabled && "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      ref={ref}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize[size]} 
          className="animate-spin" 
        />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button