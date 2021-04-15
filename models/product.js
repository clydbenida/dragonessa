const mongoose = require('mongoose');
const cloudinary = require("../cloudinary")

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      maxLength: 256
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
   images: {
      default: {
         url: String,
         filename: String
      },
      list: [{
         url: String,
         filename: String
      }]
   }
})

productSchema.post("findOneAndDelete", async function(doc){
   cloudinary.cloudinary.api.delete_resources(doc.images.default.filename, function(err, result){
      console.log(err, result)
   });
   for (let img of doc.images.list) {
      cloudinary.cloudinary.api.delete_resources(img.filename, function(err, result){
         console.log(err, result)
      });
   }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product