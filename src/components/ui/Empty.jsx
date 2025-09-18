import React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No products found",
  message = "We couldn't find any products matching your criteria. Try adjusting your filters or browse our featured collection.",
  actionLabel = "View All Products",
  actionHref = "/products",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="Smartphone" size={40} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={actionHref}>
          <Button variant="primary" icon="ArrowRight">
            {actionLabel}
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" icon="Home">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Empty