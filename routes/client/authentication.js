const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');
const catchAsync = require("../../utils/CatchAsync");

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
    const redirectUrl = req.session.returnTo || '/products';
    delete req.session.returnTo;
    req.flash('success', `Welcome ${req.user.username}!`);
    res.redirect(redirectUrl)
  })

router.post("/register", catchAsync(async (req, res) => {
  const { email, username, password } = req.body.user;
  const newUser = await new User({email, username})

  // Make user automatically logged in after registering
  const registeredUser = await User.register(newUser, password);
  res.redirect("/products")
}));

router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out')
  res.redirect("/")
})

module.exports = router