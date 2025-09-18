import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const Footer = () => {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "iPhone", href: "/products?brand=Apple" },
        { label: "Samsung", href: "/products?brand=Samsung" },
        { label: "Google Pixel", href: "/products?brand=Google" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Warranty", href: "#" },
        { label: "Returns", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Blog", href: "#" }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Smartphone" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">MobileMart</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted destination for the latest mobile phones. Compare, discover, and purchase with confidence.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Twitter", "Instagram", "Youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-smooth"
                >
                  <ApperIcon name={social} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-smooth"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 MobileMart. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link to="#" className="text-gray-400 hover:text-white transition-smooth text-sm">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-smooth text-sm">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-smooth text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer