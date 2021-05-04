if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Require NPM packages
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

// Routes variables
const adminRoutes = require("./routes/admin");
const clientRoutes = require("./routes/client");
const authRoutes = require('./routes/client/authentication');
const purchaseRoutes = require('./routes/client/purchase')
const profileRoutes = require('./routes/client/profile')

const User = require('./models/user');
const { isLoggedIn } = require("./middleware");

mongoose
  .connect("mongodb://localhost:27017/dragonessa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() =>
    console.log("%&%&%&%&%&%&%& MONGO CONNECTION IS OPEN! %&%&%&%&%&%&%&")
  )
  .catch((err) => console.log(err));

// views & ejs configs
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// other express configs
app.use(express.static("public"));
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

// How to serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Indicate a secret to sign a cookie, for it to become tamper proof
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.warning = req.flash('warning')
  res.locals.currentUser = req.user;
  next();
})

// ROUTES
app.use("/", clientRoutes)
app.use("/", authRoutes);
app.use("/", isLoggedIn, purchaseRoutes);
app.use("/", isLoggedIn, profileRoutes);
app.use("/admin", adminRoutes)

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no! Something went wrong!";
  res.status(statusCode).render("error", {err})
})

app.listen(process.env.PORT || 3000, () => console.log("Server is running"));