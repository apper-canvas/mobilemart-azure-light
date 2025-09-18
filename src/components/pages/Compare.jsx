import React, { useEffect, useState } from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-toastify"

const Compare = () => {
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToCart } = useCart()

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const allProducts = await productService.getAll()
      setProducts(allProducts)
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const addProductToCompare = (product) => {
    if (selectedProducts.length >= 4) {
      toast.warning("You can compare up to 4 products at once")
      return
    }
    
    if (selectedProducts.find(p => p.Id === product.Id)) {
      toast.warning("Product is already in comparison")
      return
    }
    
    setSelectedProducts([...selectedProducts, product])
    toast.success("Product added to comparison")
  }

  const removeFromCompare = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.Id !== productId))
    toast.success("Product removed from comparison")
  }

  const clearComparison = () => {
    setSelectedProducts([])
    toast.success("Comparison cleared")
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getComparisonRows = () => {
    if (selectedProducts.length === 0) return []
    
    const rows = [
      { label: "Name", key: "name" },
      { label: "Brand", key: "brand" },
      { label: "Price", key: "price", format: formatPrice },
      { label: "Rating", key: "rating", format: (val) => `${val}/5` },
      { label: "In Stock", key: "inStock", format: (val) => val ? "Yes" : "No" }
    ]

    // Add specification rows if products have specs
    if (selectedProducts[0]?.specifications) {
      const specKeys = Object.keys(selectedProducts[0].specifications)
      specKeys.forEach(key => {
        rows.push({
          label: key.replace(/([A-Z])/g, ' $1').trim(),
          key: `specifications.${key}`
        })
      })
    }

    return rows
  }

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadProducts} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Compare Phones
              </h1>
              <p className="text-gray-600">
                Compare specifications and features side by side
              </p>
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedProducts.length}/4 products selected
                </span>
                <Button
                  variant="ghost"
                  onClick={clearComparison}
                  icon="X"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Selection */}
        {selectedProducts.length < 4 && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Products to Compare
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.Id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer"
                  onClick={() => addProductToCompare(product)}
                >
                  <img
                    src={product.images?.[0] || "/api/placeholder/60/60"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {product.brand}
                    </p>
                    <p className="font-semibold text-primary text-sm">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <ApperIcon name="Plus" size={16} className="text-primary flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comparison Table */}
        {selectedProducts.length > 0 ? (
          <Card className="p-6 overflow-x-auto">
            <div className="min-w-full">
              {/* Product Headers */}
              <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}>
                <div></div>
                {selectedProducts.map((product) => (
                  <div key={product.Id} className="text-center">
                    <div className="relative mb-4">
                      <img
                        src={product.images?.[0] || "/api/placeholder/200/200"}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                        onClick={() => removeFromCompare(product.Id)}
                      >
                        <ApperIcon name="X" size={14} />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {product.name}
                    </h3>
                    <Badge variant="outline" size="sm" className="mb-3">
                      {product.brand}
                    </Badge>
                    <div className="space-y-2">
                      <p className="text-xl font-bold gradient-text">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <ApperIcon
                            key={i}
                            name="Star"
                            size={12}
                            className={cn(
                              "transition-smooth",
                              i < Math.floor(product.rating)
                                ? "text-accent fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="ShoppingCart"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="space-y-4">
                {getComparisonRows().map((row, index) => (
                  <div 
                    key={row.key}
                    className={cn(
                      "grid gap-4 py-3 border-b border-gray-200",
                      index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    )}
                    style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}
                  >
                    <div className="font-medium text-gray-700 flex items-center">
                      {row.label}
                    </div>
                    {selectedProducts.map((product) => {
                      const value = getNestedValue(product, row.key)
                      return (
                        <div key={product.Id} className="text-center text-gray-900">
                          {row.format ? row.format(value) : value}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Empty
            title="No products to compare"
            message="Select products from the list above to start comparing their features and specifications side by side."
            actionLabel="Browse Products"
            actionHref="/products"
          />
        )}
      </div>
    </div>
  )
}

export default Compare