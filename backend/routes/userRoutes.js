const express = require("express");
const { body } = require("express-validator");
const { signup, login } = require("../controllers/usersController");
const passport = require("passport");
const passportUtils = require("../utils/passport");

const router = express.Router();

const requireLocalAuth = passport.authenticate("local", {
  session: false,
});

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8, max: 250 }).escape(),
  ],
  signup
);

router.post("/login", requireLocalAuth, login);

module.exports = router;
