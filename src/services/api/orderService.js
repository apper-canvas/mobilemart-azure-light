// Mock order storage (in a real app, this would be a database)
let ordersData = []

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const orderService = {
  async getAll() {
    await delay(300)
    return [...ordersData]
  },

  async getById(id) {
    await delay(200)
    const order = ordersData.find(o => o.Id === id)
    return order ? { ...order } : null
  },

  async create(orderData) {
    await delay(500) // Simulate processing time
    const maxId = ordersData.length > 0 ? Math.max(...ordersData.map(o => o.Id)) : 0
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      status: "pending",
      createdAt: new Date().toISOString()
    }
    ordersData.push(newOrder)
    return { ...newOrder }
  },

  async update(id, orderData) {
    await delay(300)
    const index = ordersData.findIndex(o => o.Id === id)
    if (index === -1) return null
    
    ordersData[index] = { ...ordersData[index], ...orderData }
    return { ...ordersData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = ordersData.findIndex(o => o.Id === id)
    if (index === -1) return false
    
    ordersData.splice(index, 1)
    return true
  }
}