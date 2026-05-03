const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/error');

// Temporary storage until we connect the database
const users = [];

// Generate JWT token
const signToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required.' });
  }

  // Check if user already exists
  const existing = users.find((u) => u.username === username || u.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Username or email already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role: role || 'member',
  };

  users.push(newUser);

  const token = signToken(newUser);

  res.status(201).json({
    message: 'Registration successful.',
    token,
    user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = signToken(user);

  res.json({
    message: 'Login successful.',
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});

module.exports = { register, login, getMe };