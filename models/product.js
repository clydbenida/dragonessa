const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      maxLength: 128
   },
   desc: {
      type: String,
   },
   qty: {
      type: Number,
      required: true,
      min: 0
   },
   price: {
      type: Number,
      required: true,
      min: 0
   }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product