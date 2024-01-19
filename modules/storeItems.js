const { Schema, model } = require('mongoose')

const storeItems = new Schema({
  company: String,
  colors: String,
  featured: Boolean,
  price: Number,
  name: String,
  imageId: String,
  imageUrl: String,
  imageLargeurl: String,
  imageSmall: String,
})

module.exports = model('StoreItems', storeItems)
