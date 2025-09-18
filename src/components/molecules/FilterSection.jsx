import React, { useState } from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FilterSection = ({ 
  title, 
  children, 
  defaultExpanded = true,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={cn("border-b border-gray-200 pb-4", className)}>
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto mb-3 text-left font-semibold text-gray-900"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title}
        <ApperIcon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16}
          className="transition-smooth"
        />
      </Button>
      {isExpanded && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

export default FilterSection