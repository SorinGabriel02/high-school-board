require("dotenv").config();
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const userToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

// on signup user gets a jwt
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      errorMessage:
        "Email or password is invalid. Please verify and try again.",
    });

  try {
    const { email, password } = req.body;
    // check if email is in use before trying to create a new user
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(409).json({
        errorMessage: "An account with this email already exists.",
      });
    // create and save the new user
    const newUser = new User({
      email,
      password,
    });
    const savedUser = await newUser.save();

    res.status(201).json({ token: userToken(savedUser.id) });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Server error. Pease try again later.",
    });
  }
};

const login = async (req, res) => {
  const user = req.user;
  // email and password are valid
  // send back token
  if (user.teacher) {
    // if user has teacher privileges
    return res.json({
      token: userToken(user.id),
      teacher: true,
    });
  }

  res.json({ token: userToken(user.id) });
};

module.exports = { signup, login };
