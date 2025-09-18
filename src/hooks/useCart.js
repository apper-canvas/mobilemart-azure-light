import { useEffect, useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("mobilemart-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mobilemart-cart", JSON.stringify(cart))
  }, [cart])

const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
const existingItem = prevCart.find(item => item.productId === product.Id)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, {
          productId: product.Id,
          product: product,
          quantity: 1,
          selectedColor: "",
          selectedStorage: ""
        }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const isInCart = (productId) => {
    return cart.some(item => item.productId === productId)
  }

  const getCartItem = (productId) => {
    return cart.find(item => item.productId === productId)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getCartItem
  }
}