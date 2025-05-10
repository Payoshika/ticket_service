// User data model with id, name, email, password
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
// This code defines a Mongoose schema and model for a user in a ticketing system. The user has fields for ID, name, email, password, and a timestamp for when the account was created. The model is then exported for use in other parts of the application.
