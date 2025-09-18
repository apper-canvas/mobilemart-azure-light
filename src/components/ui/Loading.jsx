import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ variant = "default", className }) => {
  if (variant === "products") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
              <div className="flex justify-between">
                <div className="h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
                <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "detail") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer" />
          <div className="space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
            <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center p-12", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default Loading