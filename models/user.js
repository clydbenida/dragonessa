const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
   fname: {type: String},
   lname: {type: String},
   address: {
      default: {
         fullAdress: String
      },
      list: [{
         fullAdress: String
      }]
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   cart: {
      checkoutPrice: {
         type: Number,
         default: 0
      },
      list: [{
         type: Schema.Types.ObjectId,
         ref: 'Cart'
   }]}
});

userSchema.methods.fullName = function() {
   return `${this.fname} ${this.lname}`
}

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);