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
  }
}