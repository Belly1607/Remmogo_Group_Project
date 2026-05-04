const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/error');

// Generate JWT token
const signToken = (user) =>
  jwt.sign(
    { id: user.user_id, username: user.username, role: user.role },
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
  const [existing] = await pool.query(
    'SELECT user_id FROM user WHERE username = ? OR email = ?',
    [username, email]
  );

  if (existing.length > 0) {
    return res.status(409).json({ message: 'Username or email already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userRole = role || 'member';

  const [result] = await pool.query(
    'INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, userRole]
  );

  const newUser = {
    user_id: result.insertId,
    username,
    email,
    role: userRole,
  };

  const token = signToken(newUser);

  res.status(201).json({
    message: 'Registration successful.',
    token,
    user: newUser,
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const [rows] = await pool.query(
    'SELECT * FROM user WHERE username = ?',
    [username]
  );

  const user = rows[0];

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
    user: { id: user.user_id, username: user.username, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT user_id, username, email, role FROM user WHERE user_id = ?',
    [req.user.id]
  );

  if (!rows[0]) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.json(rows[0]);
});

module.exports = { register, login, getMe };