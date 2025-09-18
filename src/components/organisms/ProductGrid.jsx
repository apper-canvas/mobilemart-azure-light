import React from "react"
import { cn } from "@/utils/cn"
import ProductCard from "@/components/molecules/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onRetry,
  className,
  showCompare = true 
}) => {
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />
  }

  if (!products?.length) {
    return <Empty />
  }

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          showCompare={showCompare}
        />
      ))}
    </div>
  )
}

export default ProductGrid