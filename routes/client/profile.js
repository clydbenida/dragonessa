const express = require('express')
const passport = require('passport');
const { regions, provinces, cities } = require("philippines")
const router = express.Router();

const catchAsync = require("../../utils/CatchAsync");

router.get("/profile", catchAsync(async (req, res) => {
   res.render("./client/user", {user: req.user})
}))

router.get("/profile/addresses", catchAsync(async (req, res) => {
   res.render("./client/user/address", {user: req.user})
}))

module.exports = router