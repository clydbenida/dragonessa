if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const adminRoutes = require("./routes/admin");
const clientRoutes = require("./routes/client");

mongoose
  .connect("mongodb://localhost:27017/dragonessa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() =>
    console.log("%&%&%&%&%&%&%& MONGO CONNECTION IS OPEN! %&%&%&%&%&%&%&")
  )
  .catch((err) => console.log(err));

// views & ejs configs
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use("/admin", adminRoutes)
app.use("/", clientRoutes)

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no! Something went wrong!";
  res.status(statusCode).render("error", {err})
})

app.listen(process.env.PORT || 3000, () => console.log("Server is running"));