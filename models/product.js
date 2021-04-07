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
   },
   rating: {
      type: Number,
      default: 0,
      enum: [0,1,2,3,4,5]
   },
   sold: {
      type: Number,
      min: 0,
      default: 0
   },
   images: [{
      url: String,
      filename: String,
      isDefault: Boolean
   }]
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product