const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  switchCount: { type: Number, default: 0 },     // 🔁 For tab switch tracking
  blocked: { type: Boolean, default: false }     // 🚫 For blocking user
});

module.exports = mongoose.model('User', userSchema);
