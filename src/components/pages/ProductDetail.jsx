import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import ProductRecommendationCarousel from "@/components/molecules/ProductRecommendationCarousel"
import { productService } from "@/services/api/productService"
import { reviewService } from "@/services/api/reviewService"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-toastify"
const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      const productData = await productService.getById(parseInt(id))
      if (!productData) {
        setError("Product not found")
        return
      }
      setProduct(productData)
      
// Load reviews
const productReviews = await reviewService.getByProductId(productData.Id)
      setReviews(productReviews)

      // Track product view
      productService.trackView(productData.Id)
    } catch (err) {
      setError("Failed to load product details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading variant="detail" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadProduct} />
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
addToCart(product)
    }
    toast.success(`${product.name} added to cart`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/cart")
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              Back
            </Button>
            <span>Home</span>
            <ApperIcon name="ChevronRight" size={14} />
            <span>Products</span>
            <ApperIcon name="ChevronRight" size={14} />
<span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
src={product.images?.[selectedImage] || "/api/placeholder/600/600"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
              <div className="grid grid-cols-4 gap-3">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square bg-white rounded-lg border-2 overflow-hidden transition-smooth",
                      selectedImage === index 
                        ? "border-primary" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
{product.brand}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={18}
                      className={cn(
                        "transition-smooth",
i < Math.floor(product.rating)
                          ? "text-accent fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
{product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold gradient-text">
{formatPrice(product.price)}
                </span>
                {product.inStock ? (
                  <Badge variant="success">In Stock</Badge>
                ) : (
                  <Badge variant="error">Out of Stock</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <ApperIcon name="Minus" size={14} />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <ApperIcon name="Plus" size={14} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon="ShoppingCart"
                  onClick={handleAddToCart}
disabled={!product.inStock}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
{product.specifications && Object.keys(product.specifications).length > 0 && (
          <Card className="mb-12 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Reviews */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    size={16}
                    className={cn(
                      "transition-smooth",
i < Math.floor(product.rating)
                        ? "text-accent fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {product.rating} out of 5 stars
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
<div key={review.Id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
{review.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.author}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          size={14}
                          className={cn(
"transition-smooth",
                            i < review.rating
                              ? "text-accent fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
<p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reviews yet</p>
                <p className="text-sm text-gray-500">Be the first to review this product</p>
              </div>
            )}
</div>
        </Card>
      </div>

      {/* Product Recommendations */}
      <div className="mt-12">
<ProductRecommendationCarousel 
          currentProductId={product?.Id}
          title="Similar Products You Might Like"
        />
      </div>
    </div>
  )
}

export default ProductDetail