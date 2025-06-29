const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables
dotenv.config();

// Models
const User = require('./models/user');
const Answer = require('./models/answer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB Connected");
}).catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});

// ------------------- API Routes -------------------

// 🟢 Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.json({ success: false, message: 'User already registered' });
  }

  const user = new User({ name, email, password, switchCount: 0, blocked: false });
  await user.save();

  res.json({ success: true, message: 'Registration successful' });
});

// 🔵 Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.json({ success: false, message: 'Invalid credentials or user not registered' });
  }

  if (user.blocked) {
    return res.json({ success: false, message: 'Your account is blocked due to tab switching' });
  }

  // Reset tab switch count on successful login
  user.switchCount = 0;
  await user.save();

  res.json({ success: true, name: user.name, email: user.email });
});

// 🟡 Submit Answers
app.post('/submit', async (req, res) => {
  const { email, answers, score, timestamp } = req.body;

  const submission = new Answer({ email, answers, score, timestamp });
  await submission.save();

  res.json({ success: true, message: 'Answers submitted successfully' });
});

// 🚨 Tab Switch Detection API
app.post('/warn-user', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ blocked: true, message: "User not found" });

  user.switchCount = (user.switchCount || 0) + 1;

  if (user.switchCount >= 2) {
    user.blocked = true;
    await user.save();
    return res.json({
      blocked: true,
      message: "🚫 You switched tabs again. Your session is now blocked!"
    });
  }

  await user.save();
  return res.json({
    blocked: false,
    message: "⚠️ You have switched tabs. One more switch and your account will be blocked!"
  });
});

// 🌐 Serve Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
