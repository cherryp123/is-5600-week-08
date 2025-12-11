const cuid = require('cuid')
const { connect, mongoose } = require('./db')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{ type: String }],
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'cancelled'], default: 'processing' }
}, { timestamps: true })

let OrderModel

async function getModel() {
  await connect()
  if (!OrderModel) {
    try { OrderModel = mongoose.model('Order') } catch (e) { OrderModel = mongoose.model('Order', OrderSchema) }
  }
  return OrderModel
}

async function create(fields) {
  const Model = await getModel()
  return Model.create(fields)
}

async function get(id) {
  const Model = await getModel()
  return Model.findById(id).exec()
}

async function list({ offset = 0, limit = 25, productId, status } = {}) {
  const Model = await getModel()
  const q = {}
  if (productId) q.products = productId
  if (status) q.status = status
  return Model.find(q).skip(Number(offset)).limit(Number(limit)).exec()
}

async function edit(id, change) {
  const Model = await getModel()
  const doc = await Model.findById(id).exec()
  if (!doc) return null
  Object.keys(change).forEach(k => { doc[k] = change[k] })
  return doc.save()
}

async function destroy(id) {
  const Model = await getModel()
  return Model.deleteOne({ _id: id }).exec()
}

module.exports = { create, get, list, edit, destroy }
