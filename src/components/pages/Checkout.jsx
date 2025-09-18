import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"
import { orderService } from "@/services/api/orderService"
import { toast } from "react-toastify"

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  })

  const [errors, setErrors] = useState({})

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Billing validation
    if (!billingInfo.firstName.trim()) newErrors.firstName = "First name is required"
    if (!billingInfo.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!billingInfo.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(billingInfo.email)) newErrors.email = "Email is invalid"
    if (!billingInfo.phone.trim()) newErrors.phone = "Phone is required"
    if (!billingInfo.address.trim()) newErrors.address = "Address is required"
    if (!billingInfo.city.trim()) newErrors.city = "City is required"
    if (!billingInfo.state.trim()) newErrors.state = "State is required"
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    
    // Payment validation
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
    if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required"
    if (!paymentInfo.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }
    
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    try {
      setLoading(true)
      
      const orderData = {
        items: cart,
        total: subtotal + tax + shipping,
        customerInfo: billingInfo,
        status: "pending"
      }
      
      const order = await orderService.create(orderData)
      
      // Clear cart after successful order
      clearCart()
      
      toast.success("Order placed successfully!")
      navigate("/", { 
        state: { 
          message: `Order #${order.Id} has been placed successfully!` 
        }
      })
    } catch (err) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBillingChange = (field, value) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    navigate("/cart")
    return null
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08
  const shipping = subtotal > 299 ? 0 : 15
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Billing Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Billing Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>First Name</Label>
                    <Input
                      value={billingInfo.firstName}
                      onChange={(e) => handleBillingChange("firstName", e.target.value)}
                      error={!!errors.firstName}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-error text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label required>Last Name</Label>
                    <Input
                      value={billingInfo.lastName}
                      onChange={(e) => handleBillingChange("lastName", e.target.value)}
                      error={!!errors.lastName}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-error text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <Label required>Email</Label>
                    <Input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => handleBillingChange("email", e.target.value)}
                      error={!!errors.email}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label required>Phone</Label>
                    <Input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => handleBillingChange("phone", e.target.value)}
                      error={!!errors.phone}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-error text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label required>Address</Label>
                    <Input
                      value={billingInfo.address}
                      onChange={(e) => handleBillingChange("address", e.target.value)}
                      error={!!errors.address}
                      placeholder="Enter your street address"
                    />
                    {errors.address && (
                      <p className="text-error text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <Label required>City</Label>
                    <Input
                      value={billingInfo.city}
                      onChange={(e) => handleBillingChange("city", e.target.value)}
                      error={!!errors.city}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-error text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label required>State</Label>
                    <Input
                      value={billingInfo.state}
                      onChange={(e) => handleBillingChange("state", e.target.value)}
                      error={!!errors.state}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <p className="text-error text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <Label required>ZIP Code</Label>
                    <Input
                      value={billingInfo.zipCode}
                      onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                      error={!!errors.zipCode}
                      placeholder="Enter your ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="text-error text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Payment Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label required>Card Number</Label>
                    <Input
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                      error={!!errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="text-error text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div>
                    <Label required>Expiry Date</Label>
                    <Input
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                      error={!!errors.expiryDate}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && (
                      <p className="text-error text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <Label required>CVV</Label>
                    <Input
                      value={paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                      error={!!errors.cvv}
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="text-error text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label required>Name on Card</Label>
                    <Input
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
                      error={!!errors.nameOnCard}
                      placeholder="Enter name as it appears on card"
                    />
                    {errors.nameOnCard && (
                      <p className="text-error text-sm mt-1">{errors.nameOnCard}</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img
                        src={item.product.images?.[0] || "/api/placeholder/50/50"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
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
                
                {/* Place Order Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  icon="CreditCard"
                >
                  Place Order
                </Button>
                
                <div className="text-center mt-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Shield" size={16} />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout