const express = require("express")
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const { productSchema } = require("../utils/validate");
const { update } = require("../models/product");

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
    }
    res.render("./admin/products/index", { products });
  })
);

router.get("/products/new", (req, res) => {
  res.render("./admin/products/new");
});

router.get("/products/:id", async (req, res) => {
  console.log(cloudinary.api)
  const product = await Product.findOne({ _id: req.params.id });
  res.render("./admin/products/edit", { product });
});

// CREATE PRODUCT ROUTE
router.post("/products", upload.fields([{name: 'default', max: 1}, {name: 'images', max: 5}]), catchAsync(async (req, res) => {
    const { name, qty, desc, price } = req.body;
    const defaultImg = req.files.default[0];

    const newProduct = new Product({
      name,
      qty,
      desc,
      price,
      images: {
        default: {
          url: defaultImg.path,
          filename: defaultImg.filename
        },
        list: []
      }
    });

    req.files.images.forEach(el => newProduct.images.list.push({url: el.path, filename: el.filename}))
    await newProduct.save();
    res.redirect("/admin/products");
  })
);

// UPDATE ROUTE
router.put("/products/:id", upload.fields([{name: 'default', max: 1}, {name: 'images', max: 5}]), catchAsync(async (req, res) => {
  const { product } = req.body;
  const { files } = req;
  product.images = {}
  const oldProduct = await Product.findById(req.params.id)


  if (Object.keys(files).length === 0) {
    await Product.findByIdAndUpdate(req.params.id, {
      $set: {
        name: product.name,
        desc: product.desc,
        qty: product.qty,
        price: product.price
      }
    });
  } else {

    // This will trigger if there is only default present
    if (files.default) {
      cloudinary.api.delete_resources(oldProduct.images.default.filename, function(err, result){console.log(err)});
      product.images.default = {
        url: files.default[0].path,
        filename: files.default[0].filename,
      }
    }
    
    // This will trigger if there is only image list present
    if (files.images){
      for (let img of oldProduct.images.list) {
        cloudinary.api.delete_resources(img.filename, function(err, result){});
      }
      product.images.list = files.images.map(img => ({url: img.path, filename: img.filename}))
    }

    Object.assign(oldProduct.images, product.images)
    oldProduct.save();
  }
  res.redirect("/admin/products/")
}))

// Delete Route
router.delete("/products/:id", catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products")
}))

module.exports = router;