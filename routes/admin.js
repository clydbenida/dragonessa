const express = require("express")
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const { productSchema } = require("../utils/validate");

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.get("", (req, res) => {
  res.redirect("/admin/login");
});

router.get("/login", (req, res) => {
  res.render("./admin/login");
});

router.get("/dashboard", (req, res) => {
  res.render("./admin/dashboard");
});

router.get("/products", catchAsync(async (req, res) => {
    const products = await Product.find({});

    for (let p of products) {
      const newDesc = removeTags(p.desc);
      p.desc = newDesc.slice(0, 28).concat("...");
      for (let img of p.images) {
        if (img["isDefault"]) p.defaultImg = img;
      }
    }
    res.render("./admin/products/show", { products });
  })
);

router.get("/products/new", (req, res) => {
  res.render("./admin/products/new");
});

router.get("/products/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  res.render("./admin/products/edit", { product });
});

router.post("/products", upload.array("image"), catchAsync(async (req, res) => {
    const { name, qty, desc, price, defaultImg } = req.body;

    const newProduct = new Product({
      name,
      qty,
      desc,
      price,
    });
    // console.log(req.files);
    newProduct.images = req.files.map((f, idx) => {
      if (idx == defaultImg) {
        return { url: f.path, filename: f.filename, isDefault: true };
      }
      return { url: f.path, filename: f.filename };
    });
    await newProduct.save();
    res.redirect("/admin/products");

    // const { name, qty, desc, price } = req.body;
    // const newProduct = await new Product({
    //    name, qty, desc, price
    // }).save()
    //    .then(() => res.redirect("/admin/products"))
    //    .catch(err => console.log(err))
  })
);

router.delete("/products/:id", catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products")
}))

module.exports = router;