const express = require('express');
const router = express.Router()

const catchAsync = require("../../utils/CatchAsync");
const { isLoggedIn } = require("../../middleware")

// Models 
const User = require('../../models/user');
const Product = require("../../models/product");
const Cart = require("../../models/cart");

router.get("/checkout", catchAsync(async (req, res) => {
   res.render("./client/checkout")
}))
 
router.get("/cart", catchAsync(async (req, res) => {
   const userCart = await Cart.find({user: req.user._id}).populate({
      path: 'product',
      populate: {path: 'images'}
   });
   res.render("./client/cart", {userCart});
}));
 
router.post("/cart/:productId", catchAsync(async (req, res) => {
   const qty = parseInt(req.body.amount);
   const { addToCart } = req.body;

   // this will execute if user clicks "add to cart"
   if (addToCart === 'AddToCart') {
      const product = await Product.findById(req.params.productId);
      const currentUser = await User.findById(req.user._id);

      if (currentUser.cart.list.length) {
         // execute if there's something inside in user's cart already
         const foundCart = await Cart.findOne({user: {$eq: currentUser._id}, product: {$eq: product._id}})
         if (foundCart){
         foundCart.qty += 1;
         foundCart.price = product.price * foundCart.qty;
         await foundCart.save()

         req.flash("success", "Item successfully added in cart!")
         return res.redirect(`/products/${product._id}`)
         }
      } 

      const price = product.price * qty;
      // execute if user's cart is empty
      const newCart = new Cart({
         product,
         user: currentUser,
         price,
         qty
      })

      currentUser.cart.list.push(newCart)
      await newCart.save()
      await currentUser.save()

      req.flash("success", "Item successfully added in cart!")
      res.redirect("back")
   // this will execute if user clicks "buy now"
   } else if (addToCart === "BuyNow"){
      return res.send(`/products/${product._id}`)
   }
   res.send("buying nothing :/")
}))

module.exports = router