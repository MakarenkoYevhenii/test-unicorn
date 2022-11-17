const { Schema, model } = require("mongoose");

const user = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  id: {
    type: String,
    required: [true, "id is required"],
    unique: true,
  },
  id_type: {
    type: String,
    default: "none",
  },
  token: {
    type: String,
  },
});

const User = model("user", user);

module.exports = User;
