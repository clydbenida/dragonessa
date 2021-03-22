const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))

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
   res.render("./admin/products");
})

app.get("/admin/products/new", (req, res) => {
   res.render("./admin/new-products");
})

app.listen(3000, () => console.log('Server is running'));