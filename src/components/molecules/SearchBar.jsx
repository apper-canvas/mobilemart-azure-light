import React, { useState } from "react"
import { cn } from "@/utils/cn"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ 
  className,
  placeholder = "Search products...",
  onSearch,
  variant = "default"
}) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const variants = {
    default: "flex gap-2",
    integrated: "relative"
  }

  if (variant === "integrated") {
    return (
      <form onSubmit={handleSubmit} className={cn("relative", className)}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-12"
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        >
          <ApperIcon name="Search" size={16} />
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn(variants[variant], className)}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" icon="Search" variant="primary">
        Search
      </Button>
    </form>
  )
}

export default SearchBar