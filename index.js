if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });

mongoose
  .connect("mongodb://localhost:27017/dragonessa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("%&%&%&%&%&%&%& MONGO CONNECTION IS OPEN! %&%&%&%&%&%&%&")
  )
  .catch((err) => console.log(err));

const Product = require("./models/product");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("show-products", { products });
});

// %&%&%&%&%&%&%&%&%&%&%&% ADMIN ROUTES %&%&%&%&%&%&%&%&%&%&%&%

app.get("/admin", (req, res) => {
  res.redirect("/admin/login");
});

app.get("/admin/login", (req, res) => {
  res.render("./admin/login");
});

app.get("/admin/dashboard", (req, res) => {
  res.render("./admin/dashboard");
});

app.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find({});

    for (let p of products) {
      const newDesc = removeTags(p.desc);
      p.desc = newDesc.slice(0, 28).concat("...");
      for (let img of p.images) {
        if (img["isDefault"]) p.defaultImg = img;
      }
    }
    res.render("./admin/show-products", { products });
  } catch (err) {
    console.log(err);
    res.render("./admin/show-products");
  }
});

app.get("/admin/products/new", (req, res) => {
  res.render("./admin/new-product");
});

app.get("/admin/product/:id", async (req, res) => {
   const product = await Product.findOne({_id: req.params.id})
   res.render("./admin/show-product", { product });
});

app.post("/admin/products", upload.array("image"), async (req, res) => {
  const { name, qty, desc, price, defaultImg } = req.body;
  console.log(req.body);

  try {
    const newProduct = new Product({
      name,
      qty,
      desc,
      price,
    });
    newProduct.images = req.files.map((f, idx) => {
      if (idx == defaultImg) {
        console.log("index: ", idx);
        console.log("defaultIMG: ", defaultImg);
        return { url: f.path, filename: f.filename, isDefault: true };
      }
      return { url: f.path, filename: f.filename };
    });
    await newProduct.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }

  // const { name, qty, desc, price } = req.body;
  // const newProduct = await new Product({
  //    name, qty, desc, price
  // }).save()
  //    .then(() => res.redirect("/admin/products"))
  //    .catch(err => console.log(err))
});

app.listen(3000, () => console.log("Server is running"));
