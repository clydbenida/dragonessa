const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const Product = require("../models/product")

router.get("/", (req, res) => {
  res.render("./client/index");
});

router.get("/products", catchAsync(async (req, res) => {
    const products = await Product.find();
    console.log(products[0].images)
    res.render("./client/products/show", { products });
  })
);

module.exports = router;