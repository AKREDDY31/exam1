const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  questions: [String],          // Optional: Q1, Q2, etc. (for mapping)
  answers: [String],            // Array of submitted answers
  score: { type: Number },      // Auto-calculated score
  createdAt: { type: Date, default: Date.now }  // Submission time
});

module.exports = mongoose.model('Answer', answerSchema);
