const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv');
dotenv.config();





// Create Express app
const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Middleware to parse JSON data
const MONGO_URL = process.env.MONGO_CONNECTION_STRING;

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Create a Mongoose schema and model for Users
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Signup Endpoint
app.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body); // Debugging log

  const { email, password } = req.body; // Removed confirmPassword

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save the new user
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ msg: 'User registered successfully' });
});

// Login Endpoint
app.post('/login', async (req, res) => {
  console.log('Login request received:', req.body); // Debugging log

  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }

  res.status(200).json({ msg: 'Login successful' });
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
