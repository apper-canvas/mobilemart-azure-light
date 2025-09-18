import reviewsData from "@/services/mockData/reviews.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reviewService = {
  async getAll() {
    await delay(200)
    return [...reviewsData]
  },

  async getById(id) {
    await delay(150)
    const review = reviewsData.find(r => r.Id === id)
    return review ? { ...review } : null
  },

  async getByProductId(productId) {
    await delay(200)
    return reviewsData
      .filter(r => r.productId === productId)
      .map(r => ({ ...r }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async create(reviewData) {
    await delay(300)
    const maxId = Math.max(...reviewsData.map(r => r.Id))
    const newReview = {
      ...reviewData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    reviewsData.push(newReview)
    return { ...newReview }
  },

  async update(id, reviewData) {
    await delay(250)
    const index = reviewsData.findIndex(r => r.Id === id)
    if (index === -1) return null
    
    reviewsData[index] = { ...reviewsData[index], ...reviewData }
    return { ...reviewsData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = reviewsData.findIndex(r => r.Id === id)
    if (index === -1) return false
    
    reviewsData.splice(index, 1)
    return true
  }
}