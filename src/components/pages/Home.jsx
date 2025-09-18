import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ProductGrid from "@/components/organisms/ProductGrid"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const products = await productService.getAll()
      // Get top rated and featured products
      const featured = products
        .filter(product => product.rating >= 4.5)
        .slice(0, 8)
      setFeaturedProducts(featured)
    } catch (err) {
      setError("Failed to load featured products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  const brands = [
    { name: "Apple", icon: "Apple", gradient: "from-gray-800 to-gray-600" },
    { name: "Samsung", icon: "Smartphone", gradient: "from-blue-600 to-blue-800" },
    { name: "Google", icon: "Chrome", gradient: "from-red-500 to-yellow-500" },
    { name: "OnePlus", icon: "Zap", gradient: "from-red-600 to-black" },
    { name: "Xiaomi", icon: "Smartphone", gradient: "from-orange-500 to-red-600" },
    { name: "Sony", icon: "Radio", gradient: "from-purple-600 to-blue-600" }
  ]

  const features = [
    {
      icon: "Shield",
      title: "Warranty Protection",
      description: "All devices come with comprehensive warranty coverage"
    },
    {
      icon: "Truck",
      title: "Free Shipping",
      description: "Free delivery on orders over $299"
    },
    {
      icon: "RotateCcw",
      title: "Easy Returns",
      description: "30-day hassle-free return policy"
    },
    {
      icon: "Headphones",
      title: "24/7 Support",
      description: "Expert customer support available anytime"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Discover the Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mobile Phone
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Compare features, read reviews, and find the smartphone that perfectly matches your lifestyle and budget.
            </p>
            
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                placeholder="Search for your next phone..."
                onSearch={handleSearch}
                className="flex gap-3"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="accent" size="lg" icon="ArrowRight">
                  Shop All Phones
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="ghost" size="lg" icon="GitCompare" className="text-white border-white hover:bg-white hover:text-primary">
                  Compare Phones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Brand
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our extensive collection from the world's leading smartphone manufacturers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <Link key={brand.name} to={`/products?brand=${brand.name}`}>
                <Card hover className="p-6 text-center group">
                  <div className={cn(
                    "w-16 h-16 rounded-xl bg-gradient-to-br mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-smooth",
                    brand.gradient
                  )}>
                    <ApperIcon name={brand.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-smooth">
                    {brand.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Discover our top-rated smartphones
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" icon="ArrowRight">
                View All
              </Button>
            </Link>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            loading={loading}
            error={error}
            onRetry={loadFeaturedProducts}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MobileMart?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a seamless smartphone shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center group hover:shadow-card-hover transition-smooth">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                  <ApperIcon name={feature.icon} size={28} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Phone?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of satisfied customers who found their ideal smartphone with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="accent" size="lg" icon="Search">
                Start Shopping
              </Button>
            </Link>
            <Link to="/compare">
              <Button variant="ghost" size="lg" icon="GitCompare" className="text-white border-white hover:bg-white hover:text-gray-900">
                Compare Phones
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home