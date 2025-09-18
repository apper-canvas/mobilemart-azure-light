import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { toast } from "react-toastify"

export default function ProductRecommendationCarousel({ currentProductId = null, title = "Recommended for You" }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  useEffect(() => {
    loadRecommendations()
  }, [currentProductId])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError("")
      const recommendedProducts = await productService.getRecommendations(currentProductId)
      setRecommendations(recommendedProducts)
    } catch (err) {
      setError("Failed to load recommendations")
      toast.error("Failed to load recommendations")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`
  }

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const cardWidth = 280 // card width + gap
      const scrollPosition = index * cardWidth
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      setCurrentIndex(index)
    }
  }

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToIndex(newIndex)
  }

  const handleNext = () => {
    const maxIndex = Math.max(0, recommendations.length - Math.floor(carouselRef.current?.clientWidth / 280) || 3)
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    scrollToIndex(newIndex)
  }

  const handleProductClick = (productId) => {
    productService.trackView(productId)
  }

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-none w-64">
              <Card className="p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <Error 
          message={error}
          onRetry={loadRecommendations}
          className="h-64"
        />
      </div>
    )
  }

  if (!recommendations.length) {
    return null
  }

  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < recommendations.length - (Math.floor(carouselRef.current?.clientWidth / 280) || 3)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canScrollLeft}
            className={cn(
              "p-2",
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            )}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canScrollRight}
            className={cn(
              "p-2",
              !canScrollRight && "opacity-50 cursor-not-allowed"
            )}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recommendations.map((product) => (
          <div key={product.Id} className="flex-none w-64">
            <Link 
              to={`/products/${product.Id}`}
              onClick={() => handleProductClick(product.Id)}
              className="block group"
            >
              <Card className="p-4 h-full transition-all duration-200 group-hover:shadow-card-hover group-hover:scale-[1.02]">
                {/* Product Image */}
                <div className="relative mb-4">
                  <img
                    src={product.image || `https://picsum.photos/seed/${product.Id}/300/300`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg bg-gray-100"
                    loading="lazy"
                  />
                  {product.discount > 0 && (
                    <Badge 
                      variant="destructive"
                      className="absolute top-2 left-2 text-xs"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Badge variant="secondary" className="text-sm">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          size={12}
                          className={cn(
                            "transition-colors",
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile scroll indicators */}
      <div className="flex justify-center space-x-2 mt-4 md:hidden">
        {recommendations.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-primary" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  )
}