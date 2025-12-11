const mongoose = require('mongoose')
let connected = false
async function connect() {
  if (connected) return mongoose
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://root:example@127.0.0.1:27017/?authSource=admin'
  const opts = { serverSelectionTimeoutMS: 5000 }
  await mongoose.connect(MONGO_URI, opts)
  connected = true
  return mongoose
}
module.exports = { connect, mongoose }
