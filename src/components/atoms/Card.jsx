import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className,
  variant = "default",
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg border border-gray-200 transition-smooth"
  
  const variants = {
    default: "shadow-card",
    elevated: "shadow-card-hover",
    glass: "backdrop-blur-md bg-white/80 border-white/20",
    gradient: "bg-gradient-to-br from-white to-gray-50"
  }
  
  const hoverStyles = hover ? "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer" : ""

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card