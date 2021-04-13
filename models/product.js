const mongoose = require('mongoose');
const cloudinary = require("../cloudinary")

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

productSchema.post("findOneAndDelete", async function(doc){
   console.log(cloudinary.cloudinary.api)
   for (let img of doc.images) {
      cloudinary.cloudinary.api.delete_resources(img.filename, function(err, result){
         console.log(err, result)
      });
   }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product