const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  qty: {
    type: Number,
    min: 0,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  }
})

module.exports = mongoose.model('Cart', cartSchema);