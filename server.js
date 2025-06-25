const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import MongoDB models
const User = require('./models/User');
const Answer = require('./models/Answer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// API Routes

// 🟢 Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ success: false, message: 'User already registered' });
  }
  const user = new User({ name, email, password });
  await user.save();
  res.json({ success: true, message: 'Registration successful' });
});

// 🔵 Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, name: user.name, email: user.email });
  } else {
    res.json({ success: false, message: 'User not registered or wrong credentials' });
  }
});

// 🟡 Submit Answers
app.post('/submit', async (req, res) => {
  const { email, answers } = req.body;
  const submission = new Answer({ email, answers });
  await submission.save();
  res.json({ success: true, message: 'Answers submitted successfully' });
});

// 🌐 Serve index.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🚀 Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
