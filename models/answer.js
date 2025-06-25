const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  email: String,
  answers: [String],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
