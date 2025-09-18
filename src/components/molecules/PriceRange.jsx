import React, { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"

const PriceRange = ({ 
  min = 0, 
  max = 2000, 
  value = [0, 2000],
  onChange,
  className 
}) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e) => {
    const newMin = Math.max(min, Math.min(Number(e.target.value) || 0, localValue[1]))
    const newValue = [newMin, localValue[1]]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleMaxChange = (e) => {
    const newMax = Math.min(max, Math.max(Number(e.target.value) || max, localValue[0]))
    const newValue = [localValue[0], newMax]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-3">
        <div>
          <Label>Min Price</Label>
          <Input
            type="number"
            min={min}
            max={max}
            value={localValue[0]}
            onChange={handleMinChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Max Price</Label>
          <Input
            type="number"
            min={min}
            max={max}
            value={localValue[1]}
            onChange={handleMaxChange}
            placeholder="2000"
          />
        </div>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-gradient-to-r from-primary to-blue-600 rounded"
            style={{
              marginLeft: `${(localValue[0] / max) * 100}%`,
              width: `${((localValue[1] - localValue[0]) / max) * 100}%`
            }}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>${localValue[0]}</span>
        <span>${localValue[1]}</span>
      </div>
    </div>
  )
}

export default PriceRange