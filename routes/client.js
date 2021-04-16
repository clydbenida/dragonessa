const express = require("express");
const passport = require('passport');
const router = express.Router();

const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn } = require("../middleware")

const User = require('../models/user')
const Product = require("../models/product");


router.get("/", (req, res) => {
  res.render("./client/index");
});

router.get("/login", (req, res) => {
  res.render("./client/login");
})

router.get("/register", (req, res) => {
  res.render("./client/register");
});

router.post("/login", 
  passport.authenticate('local', {
    failureFlash: true.valueOf,
    failureRedirect: '/login'
  }), async (req, res) => {
    const redirectUrl = req.session.returnTo || '/products'
    delete req.session.returnTo;
    req.flash('success', `Welcome ${req.user.username}!`);
    res.redirect(redirectUrl)
  })

router.post("/register", catchAsync(async (req, res) => {
  const { email, username, password } = req.body.user;
  const newUser = await new User({email, username})
  const registeredUser = await User.register(newUser, password);
  res.redirect("/products")
}));

router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out')
  res.redirect("/")
})

router.post("/addtocart", isLoggedIn, catchAsync(async (req, res) => {
  const { addToCart } = req.body;
  console.log(req.body);

  // this will execute if user clicks "add to cart"
  if (addToCart === 'AddToCart') {
    return res.send("adding to cart!")

  // this will execute if user clicks "buy now"
  } else if (addToCart === "BuyNow"){
    return res.send("buying now!!")
  }
  res.send("buying nothing :/")
}))

router.get("/search", catchAsync( async (req, res) => {
  const { searchQuery } = req.query;
  const results = await Product.find({
    name: {$regex: searchQuery, $options: "i" }
  })
  res.render("./client/search", { results, searchQuery });
}));

router.get("/products", catchAsync(async (req, res) => {
    const products = await Product.find();
    res.render("./client/products/index", { products });
  })
);

router.get("/products/:id", catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("./client/products/show", {product})
}))

module.exports = router;