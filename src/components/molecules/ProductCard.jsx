import React from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-toastify"

const ProductCard = ({ product, className, showCompare = true }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  const handleCompare = (e) => {
    e.stopPropagation()
    // Compare functionality will be implemented
    toast.info("Compare feature coming soon")
  }

  const handleCardClick = () => {
    navigate(`/products/${product.Id}`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <Card 
      hover
      className={cn("group cursor-pointer overflow-hidden", className)}
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.images?.[0] || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="error" size="lg">Out of Stock</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
          {showCompare && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0"
              onClick={handleCompare}
            >
              <ApperIcon name="GitCompare" size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <Badge variant="outline" size="sm" className="mb-2">
            {product.brand}
          </Badge>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-smooth line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                size={14}
                className={cn(
                  "transition-smooth",
                  i < Math.floor(product.rating)
                    ? "text-accent fill-current"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold gradient-text">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon="ShoppingCart"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard