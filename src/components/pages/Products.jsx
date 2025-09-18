import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ProductGrid from "@/components/organisms/ProductGrid"
import ProductFilters from "@/components/organisms/ProductFilters"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("name")
const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 2000],
    storage: [],
    camera: [],
    battery: [],
    ram: [],
    rating: 0,
    inStock: false
  })
  const [searchParams, setSearchParams] = useSearchParams()

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

useEffect(() => {
    // Apply URL parameters to filters
    const searchQuery = searchParams.get("search") || ""
    const brandParam = searchParams.get("brand") || ""
    
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Brand filter from URL
    if (brandParam) {
      filtered = filtered.filter(product =>
        product.brand.toLowerCase() === brandParam.toLowerCase()
      )
    }

    // Apply other filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand))
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      )
    }

    if (filters.camera && filters.camera.length > 0) {
      filtered = filtered.filter(product => {
        const primaryCamera = product.specifications?.camera?.split('+')[0]?.trim()
        return filters.camera.some(cam => primaryCamera?.includes(cam))
      })
    }

    if (filters.battery && filters.battery.length > 0) {
      filtered = filtered.filter(product => {
        const batteryMah = parseInt(product.specifications?.battery)
        return filters.battery.some(range => {
          if (range === "3000-4000 mAh") return batteryMah >= 3000 && batteryMah <= 4000
          if (range === "4000-5000 mAh") return batteryMah >= 4000 && batteryMah <= 5000
          if (range === "5000+ mAh") return batteryMah >= 5000
          return false
        })
      })
    }

    if (filters.ram && filters.ram.length > 0) {
      filtered = filtered.filter(product => 
        filters.ram.includes(product.specifications?.ram)
      )
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock)
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, filters, searchParams, sortBy])
  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchParams({ search: query })
    } else {
      setSearchParams({})
    }
  }

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mobile Phones
              </h1>
              <p className="text-gray-600">
                Discover the latest smartphones from top brands
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar
                placeholder="Search products..."
                onSearch={handleSearch}
                className="min-w-[300px]"
              />
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  icon="SlidersHorizontal"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  Filters
                </Button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={cn(
            "lg:w-80 flex-shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              className="sticky top-4"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            {!loading && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                </p>
                
                {searchParams.get("search") && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Search results for:</span>
                    <span className="font-medium text-primary">
                      "{searchParams.get("search")}"
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchParams({})}
                      className="h-6 w-6 p-0"
                    >
                      <ApperIcon name="X" size={14} />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
              variant="products"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products