const mongoose = require("mongoose");

const user_model = new mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model('user', user_model);
