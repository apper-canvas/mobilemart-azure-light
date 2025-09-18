import React, { useState } from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import FilterSection from "@/components/molecules/FilterSection"
import PriceRange from "@/components/molecules/PriceRange"
import ApperIcon from "@/components/ApperIcon"

const ProductFilters = ({ 
  filters = {},
  onFiltersChange,
  className 
}) => {
  const [localFilters, setLocalFilters] = useState({
    brands: [],
    priceRange: [0, 2000],
    storage: [],
    rating: 0,
    inStock: false,
    ...filters
  })

  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Sony"]
  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleBrandToggle = (brand) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand]
    handleFilterChange("brands", newBrands)
  }

  const handleStorageToggle = (storage) => {
    const newStorage = localFilters.storage.includes(storage)
      ? localFilters.storage.filter(s => s !== storage)
      : [...localFilters.storage, storage]
    handleFilterChange("storage", newStorage)
  }

  const clearFilters = () => {
    const clearedFilters = {
      brands: [],
      priceRange: [0, 2000],
      storage: [],
      rating: 0,
      inStock: false
    }
    setLocalFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-primary hover:text-primary"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <FilterSection title="Price Range">
          <PriceRange
            value={localFilters.priceRange}
            onChange={(value) => handleFilterChange("priceRange", value)}
          />
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands">
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Storage */}
        <FilterSection title="Storage">
          <div className="grid grid-cols-2 gap-2">
            {storageOptions.map((storage) => (
              <Button
                key={storage}
                variant={localFilters.storage.includes(storage) ? "primary" : "ghost"}
                size="sm"
                className="justify-center"
                onClick={() => handleStorageToggle(storage)}
              >
                {storage}
              </Button>
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Minimum Rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={localFilters.rating === rating}
                  onChange={() => handleFilterChange("rating", rating)}
                  className="border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={14}
                      className={cn(
                        i < rating ? "text-accent fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-700 ml-1">& up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Stock Status */}
        <FilterSection title="Availability">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock}
              onChange={(e) => handleFilterChange("inStock", e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </FilterSection>
      </div>
    </div>
  )
}

export default ProductFilters