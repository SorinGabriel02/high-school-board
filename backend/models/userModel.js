const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 200,
  },
  teacher: { type: Boolean, default: false },
});

// password hash before saving user
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    const hash = await bcrypt.hash(user.password, 11);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
