const fs = require('fs/promises')
const path = require('path')
const { create: createProduct, destroy } = require('../../products')
const { create: createOrder } = require('../../orders')

const productTestHelper = {
  testProductIds: [],
  testOrderIds: [],
  async setupTestData() {
    try {
      const p = path.join(__dirname, '../../data/full-products.json')
      const data = await fs.readFile(p, 'utf8')
      const testProducts = JSON.parse(data)
      for (const product of testProducts) {
        if (!product.price) product.price = Math.floor(Math.random() * 100) + 1
        const created = await createProduct(product)
        this.testProductIds.push(created._id || created.id)
      }
      return this.testProductIds
    } catch (err) {
      console.error('Error in setupTestData:', err)
      throw err
    }
  },
  async cleanupTestData() {
    for (const id of this.testProductIds) {
      try { await destroy(id) } catch (e) {}
    }
    for (const id of this.testOrderIds) {
      try { await destroy(id) } catch (e) {}
    }
    this.testProductIds = []
    this.testOrderIds = []
  },
  async createTestOrder() {
    if (this.testProductIds.length === 0) throw new Error('No test products')
    const num = Math.floor(Math.random() * 5) + 1
    const products = []
    for (let i = 0; i < num; i++) {
      const idx = Math.floor(Math.random() * this.testProductIds.length)
      products.push(this.testProductIds[idx])
    }
    const orderData = { buyerEmail: `test${Date.now()}@example.com`, products }
    const created = await createOrder(orderData)
    this.testOrderIds.push(created._id || created.id)
    return created
  },
  async createTestOrders(count = 5) {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push(await this.createTestOrder())
    }
    return arr
  }
}
module.exports = productTestHelper
