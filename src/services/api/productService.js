import productsData from "@/services/mockData/products.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(300)
    return [...productsData]
  },

  async getById(id) {
    await delay(200)
    const product = productsData.find(p => p.Id === id)
    return product ? { ...product } : null
  },

  async getByBrand(brand) {
    await delay(250)
    return productsData.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).map(p => ({ ...p }))
  },

  async search(query) {
    await delay(300)
    const searchTerm = query.toLowerCase()
    return productsData
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      )
      .map(p => ({ ...p }))
  },

  async create(productData) {
    await delay(400)
    const maxId = Math.max(...productsData.map(p => p.Id))
    const newProduct = {
      ...productData,
      Id: maxId + 1,
      rating: 0,
      reviewCount: 0,
      inStock: true
    }
    productsData.push(newProduct)
    return { ...newProduct }
  },

  async update(id, productData) {
    await delay(300)
    const index = productsData.findIndex(p => p.Id === id)
    if (index === -1) return null
    
    productsData[index] = { ...productsData[index], ...productData }
    return { ...productsData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = productsData.findIndex(p => p.Id === id)
    if (index === -1) return false
    
productsData.splice(index, 1)
    return true
  },

  // Browsing history and recommendation methods
  trackView(productId) {
    const history = this.getBrowsingHistory()
    const productIdInt = parseInt(productId)
    
    // Remove if already exists to avoid duplicates
    const filteredHistory = history.filter(id => id !== productIdInt)
    
    // Add to beginning and limit to 50 items
    const newHistory = [productIdInt, ...filteredHistory].slice(0, 50)
    
    localStorage.setItem('browsingHistory', JSON.stringify(newHistory))
  },

  getBrowsingHistory() {
    try {
      const history = localStorage.getItem('browsingHistory')
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error parsing browsing history:', error)
      return []
    }
  },

  async getRecommendations(currentProductId = null, limit = 8) {
    await delay(300)
    const history = this.getBrowsingHistory()
    
    if (!history.length) {
      // Return random popular products if no history
      return productsData
        .filter(p => p.rating >= 4.0)
        .sort(() => 0.5 - Math.random())
        .slice(0, limit)
        .map(p => ({ ...p }))
    }

    // Get recently viewed products for similarity analysis
    const recentProducts = history.slice(0, 10)
      .map(id => productsData.find(p => p.Id === id))
      .filter(Boolean)

    if (!recentProducts.length) {
      return []
    }

    // Get similar products based on recent viewing history
    const recommendations = this.getSimilarProducts(recentProducts, currentProductId, limit)
    return recommendations
  },

  getSimilarProducts(baseProducts, excludeId = null, limit = 8) {
    const excludeIdInt = excludeId ? parseInt(excludeId) : null
    const scores = new Map()

    // Calculate similarity scores for all products
    productsData.forEach(product => {
      if (product.Id === excludeIdInt) return
      
      let totalScore = 0
      let weightSum = 0

      baseProducts.forEach((baseProduct, index) => {
        const weight = 1 / (index + 1) // Recent items have higher weight
        let score = 0

        // Brand similarity (highest weight)
        if (product.brand === baseProduct.brand) {
          score += 40
        }

        // Category similarity
        if (product.category === baseProduct.category) {
          score += 30
        }

        // Price similarity (within 20% range)
        const priceDiff = Math.abs(product.price - baseProduct.price) / baseProduct.price
        if (priceDiff <= 0.2) {
          score += 20
        } else if (priceDiff <= 0.5) {
          score += 10
        }

        // Rating similarity
        const ratingDiff = Math.abs(product.rating - baseProduct.rating)
        if (ratingDiff <= 0.5) {
          score += 10
        }

        totalScore += score * weight
        weightSum += weight
      })

      const finalScore = weightSum > 0 ? totalScore / weightSum : 0
      if (finalScore > 0) {
        scores.set(product.Id, finalScore)
      }
    })

    // Sort by score and return top recommendations
    return Array.from(scores.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([productId]) => productsData.find(p => p.Id === productId))
      .filter(Boolean)
      .map(p => ({ ...p }))
  }
}