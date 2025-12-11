const express = require('express')
const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')
const router = express.Router()

async function handleRoot(req, res) {
  const p = path.join(__dirname, 'index.html')
  res.sendFile(p, err => { if (err) res.send('OK') })
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  const r = await Products.list({ offset: Number(offset), limit: Number(limit), tag })
  res.json(r)
}

async function getProduct(req, res, next) {
  const { id } = req.params
  const p = await Products.get(id)
  if (!p) return next()
  res.json(p)
}

async function createProduct(req, res) {
  const p = await Products.create(req.body)
  res.json(p)
}

async function editProduct(req, res, next) {
  const { id } = req.params
  const p = await Products.edit(id, req.body)
  if (!p) return next()
  res.json(p)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  if (typeof Products.destroy === 'function') {
    const r = await Products.destroy(id)
    return res.json(r || { success: true })
  }
  if (typeof Products.remove === 'function') {
    const r = await Products.remove(id)
    return res.json(r || { success: true })
  }
  if (typeof Products.deleteOne === 'function') {
    const r = await Products.deleteOne({ _id: id })
    return res.json(r)
  }
  res.json({ success: true })
}

async function createOrder(req, res) {
  const o = await Orders.create(req.body)
  res.json(o)
}

async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query
  const r = await Orders.list({ offset: Number(offset), limit: Number(limit), productId, status })
  res.json(r)
}

async function editOrder(req, res, next) {
  const { id } = req.params
  const o = await Orders.edit(id, req.body)
  if (!o) return next()
  res.json(o)
}

const h = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  editOrder
})

router.get('/', h.handleRoot)
router.get('/products', h.listProducts)
router.get('/products/:id', h.getProduct)
router.post('/products', h.createProduct)
router.put('/products/:id', h.editProduct)
router.delete('/products/:id', h.deleteProduct)
router.post('/orders', h.createOrder)
router.get('/orders', h.listOrders)
router.put('/orders/:id', h.editOrder)

module.exports = router
