const cuid = require('cuid')
const { connect, mongoose } = require('./db')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  _id: { type: String, default: cuid },
  name: String,
  description: String,
  price: Number,
  image: String,
  urls: {
    regular: String,
    small: String,
    thumb: String
  },
  likes: Number,
  user: {
    id: String,
    first_name: String,
    last_name: String,
    username: String,
    portfolio_url: String
  },
  tags: [{ title: String }]
}, { timestamps: true })

let ProductModel

async function getModel() {
  await connect()
  if (!ProductModel) {
    try { ProductModel = mongoose.model('Product') } catch (e) { ProductModel = mongoose.model('Product', ProductSchema) }
  }
  return ProductModel
}

async function list({ offset = 0, limit = 25, tag } = {}) {
  const Model = await getModel()
  const q = tag ? { 'tags.title': tag } : {}
  return Model.find(q).skip(Number(offset)).limit(Number(limit)).exec()
}

async function get(id) {
  const Model = await getModel()
  return Model.findById(id).exec()
}

async function create(fields) {
  const Model = await getModel()
  return Model.create(fields)
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

module.exports = { list, get, create, edit, destroy }
