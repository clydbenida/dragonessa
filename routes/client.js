const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const Product = require("../models/product")

router.get("/", (req, res) => {
  res.render("./client/index");
});

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