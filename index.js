const express = require("express");
const path = require('path');
const app = express();
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/dragonessa', {useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log("%&%&%&%&%&%&%& MONGO CONNECTION IS OPEN! %&%&%&%&%&%&%&"))
   .catch(err => console.log(err))

const Product = require('./models/product')

app.set("views", path.join(__dirname, "views"))
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
   res.render("index");
});

// %&%&%&%&%&%&%&%&%&%&%&% ADMIN ROUTES %&%&%&%&%&%&%&%&%&%&%&%

app.get("/admin", (req, res) => {
   res.redirect("/admin/login");
})

app.get("/admin/login", (req, res) => {
   res.render("./admin/login");
})

app.get("/admin/dashboard", (req, res) => {
   res.render("./admin/dashboard");
})

app.get("/admin/products", (req, res) => {
   Product.find({})
      .then(p => {
         const products = [...p]
         res.render("./admin/show-products", { products });
      })
      .catch(err => {
         console.log(err);
         res.render("./admin/show-products")
      })
   
})

app.get("/admin/products/new", (req, res) => {
   res.render("./admin/new-product");
})

app.post("/admin/products", (req, res) => {
   const { name, qty, desc, price } = req.body;
   const newProduct = new Product({
      name, qty, desc, price
   }).save()
      .then(() => res.redirect("/admin/products"))
      .catch(err => console.log(err))
})

app.listen(3000, () => console.log('Server is running'));