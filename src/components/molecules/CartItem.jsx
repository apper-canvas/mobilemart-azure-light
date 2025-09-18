import React from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"

const CartItem = ({ item, className }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className={cn("flex gap-4 py-4 border-b border-gray-200", className)}>
      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.product.images?.[0] || "/api/placeholder/80/80"}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {item.product.brand}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
            >
              <ApperIcon name="Minus" size={14} />
            </Button>
            <span className="w-8 text-center font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatPrice(item.product.price * item.quantity)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-error hover:text-error h-auto p-0 mt-1"
              onClick={() => removeFromCart(item.productId)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem