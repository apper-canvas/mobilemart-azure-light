import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import CartItem from "@/components/molecules/CartItem"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"

const Cart = () => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart()
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 299 ? 0 : 15
  const total = subtotal + tax + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            title="Your cart is empty"
            message="Looks like you haven't added any items to your cart yet. Start exploring our amazing collection of mobile phones."
            actionLabel="Start Shopping"
            actionHref="/products"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart ({getTotalItems()} items)
            </h1>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-error hover:text-error"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/products">
                  <Button variant="ghost" icon="ArrowLeft">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={cn(
                    "font-medium",
                    shipping === 0 ? "text-success" : ""
                  )}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $299
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold gradient-text">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  icon="CreditCard"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Shield" size={16} />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Icons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center mb-3">
                  We accept
                </p>
                <div className="flex justify-center gap-3">
                  {["CreditCard", "Smartphone", "Wallet"].map((icon) => (
                    <div
                      key={icon}
                      className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center"
                    >
                      <ApperIcon name={icon} size={14} className="text-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart