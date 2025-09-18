import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Brands", href: "/products?category=brands" },
    { label: "Compare", href: "/compare" }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-smooth">
              <ApperIcon name="Smartphone" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MobileMart</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar 
              variant="integrated"
              placeholder="Search for mobile phones..."
              onSearch={handleSearch}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 hover:text-primary transition-smooth font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8 p-0"
              onClick={() => {/* Mobile search modal */}}
            >
              <ApperIcon name="Search" size={18} />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 w-8 p-0"
              >
                <ApperIcon name="ShoppingCart" size={18} />
                {getTotalItems() > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-accent to-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce-subtle">
                    {getTotalItems()}
                  </div>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={18} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <SearchBar 
                placeholder="Search for mobile phones..."
                onSearch={handleSearch}
                className="mb-4"
              />
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block text-gray-700 hover:text-primary transition-smooth font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header